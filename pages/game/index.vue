<template>
  <section id="game" class="game">
    <app-loader v-if="isMapLoading" class="game-map-loader app-loader"></app-loader>
    <div ref="mapContainer" class="game-map-container map-container connections" @wheel.prevent="scaleMap">
      <transition name="fade">
        <segment-popup />
      </transition>
      <canvas id="game-world-map" class="game-world-map"></canvas>
    </div>
  </section>
</template>
<script>
import "@pixi/events";
import mapDefaultValues from "@/mixins/mapDefaultValues.js";
import drawGameMap from "@/mixins/drawGameMap.js";
import user from "@/mixins/user";
import gameSockets from "@/mixins/gameSockets";

import {mapGetters, mapActions} from "vuex";

export default {
  mixins: [mapDefaultValues, drawGameMap, user, gameSockets],
  data() {
    return {
      gameInfo: "",
      winnerImage: "",
      isPopupActive: true,
      worldMap: [],
      isShowUserSegments: false,
      gameMapOwnersState: null,
      isUpdatedWinnerImage: false,
      isLoadMapState: false,
      isNewGameOwnerAdded: false,
      isNewSegmentAttacked: false,
      isNewSegmentFended: false,
      isUserGameSegmentsVisibleUpdated: false,
      showSegmentPopupUpdated: false,
      newSegmentOwner: {},
      newAttackedSegment: {},
      newFendedSegment: {},
      socket: null,
    };
  },
  computed: {
    ...mapGetters({
      isMapLoading: "game/getIsMapLoading",
      userGameSegments: "game/getUserGameSegments",
      isMarkedUserGameSegments: "game/getIsMarkedUserGameSegments",
      checkId: "game/getCheckId",
    }),
  },
  watch: {
    checkId() {
      this.showSegmentPopupUpdated = true;
    },
    isMarkedUserGameSegments() {
      this.isUserGameSegmentsVisibleUpdated = true;
    },
    address() {
      this.updateGameData();
      this.loadStateByStatus();
    },
  },

  async mounted() {
    this.setGameMapLoading(true);
    if (this.address !== null) {
      this.updateGameData();
    }
    this.addEventListeners();
    this.normalizeScreen();
    this.drawGameMap();
    await this.updateStatusMap();
    this.loadStateByStatus();
    this.addNuxtListeners();
  },
  destroyed() {
    document.getElementById("app").classList.remove("screen-full-height");
    document.getElementById("__nuxt").style.height = "100%";
    document.getElementById("__nuxt").style.overflow = "auto";
    this.$nuxt.$off("fend-segment");
    this.$nuxt.$off("surrender-segment");
    this.$nuxt.$off("upload-winner-image");
    this.isDestroyMap = true;
  },
  methods: {
    ...mapActions({
      setGameMapLoading: "game/setGameMapLoading",
      updateUserGameBalance: "game/updateUserGameBalance",
      addNewUserSegment: "game/addNewUserSegment",
      removeUserSegment: "game/removeUserSegment",
      setNewUserAttackedSegment: "game/setNewUserAttackedSegment",
      setNewUserFendedSegment: "game/setNewUserFendedSegment",
      setCheckId: "game/setCheckId",
      setIsTheGame: "game/setIsTheGame",
      setUserGameData: "game/setUserGameData",
    }),

    addNuxtListeners() {
      this.$nuxt.$on("fend-segment", (coordinate) => this.fendSegment(coordinate));
      this.$nuxt.$on("surrender-segment", (coordinate) => this.surrenderSegment(coordinate));
      this.$nuxt.$on("upload-winner-image", async () => {
        await this.updateStatusMap();
        this.addWinnerImageToMap();
      });
    },

    showWinnerInterface() {
      if (!this.gameInfo.winnerImage) {
        this.showWinnerNotification();
      } else {
        this.setGameMapLoading(false);
      }
      //add button "update image" to header
      this.$nuxt.$emit("show-winner-interface", true);
    },

    gameEnded() {
      //change interface if game ended
      let notificationData = {};
      this.addWinnerImageToMap();
      if (this.gameInfo.winnerWallet === this.address) {
        this.showWinnerInterface();
      } else {
        notificationData = {
          header: "Game over.",
          text: `Winner wallet: ${this.gameInfo.winnerWallet}`,
          buttonText: "Close",
        };
        this.$nuxt.$emit("openGamePopup", notificationData);
        this.$nuxt.$emit("show-winner-interface", false);
      }
    },

    loadStateByStatus() {
      if (this.gameInfo.status === "OFFLINE") {
        this.gameEnded();
      } else {
        this.addMapCondition();
        this.addGameWebSocketEvents();
      }
    },

    normalizeScreen() {
      document.getElementById("app").classList.add("screen-full-height");
      document.getElementById("__nuxt").style.height = 100 + "vh";
      document.getElementById("__nuxt").style.overflow = "hidden";
    },

    blockPopup(bool) {
      this.$store.commit("segmentPopupState/blockPopup", bool);
    },
    unblockPopup() {
      this.blockPopup(false);
    },

    //------QUERIES------
    async updateGameData() {
      try {
        const isInTheGame = await this.$axios.$get(`${process.env.SERVER_GAME_URL}/api/game/connect/status`, this.requestConfig);
        isInTheGame === "REGISTERED" ? this.setIsTheGame(true) : this.setIsTheGame(false);
      } catch (error) {
        this.setIsTheGame(false);
        console.log(error);
      }
      try {
        const userGameData = await this.$axios.$get(
          `${process.env.SERVER_GAME_URL}/api/game/stats/current-user/in-game`,
          this.requestConfig
        );
        this.setUserGameData(userGameData);
      } catch (error) {
        this.setUserGameData(null);
        console.log(error);
      }
    },

    async updateStatusMap() {
      try {
        this.gameInfo = await this.$axios.$get(`${process.env.SERVER_GAME_URL}/api/game/current-game`);
      } catch (error) {
        let notificationData = {buttonText: "Close"};
        if (error?.response?.data) {
          notificationData.header = error?.response?.data;
        } else {
          notificationData.header = error;
        }
        this.$nuxt.$emit("openGamePopup", notificationData);
      }
    },

    async addWinnerImageToMap() {
      if (this.gameInfo.winnerImage) {
        this.winnerImage = `${process.env.SERVER_GAME_URL}/files/winner-images/${this.gameInfo.winnerImageMini}`;
        this.winnerLargeImage = `${process.env.SERVER_GAME_URL}/files/winner-images/${this.gameInfo.winnerImage}`;
        this.isUpdatedWinnerImage = true;
      } else {
        let userData = await this.$axios.$get(`${process.env.SERVER_URL}/user/${this.gameInfo.winnerWallet.toString().toLowerCase()}`);
        if (userData.avatar) {
          this.winnerLargeImage = process.env.SERVER_URL + userData.avatar;
        }
      }
    },

    // @ts-check
    /**
     *@typedef {Object} GameOwnerState
     *@property  {Number} id
     *@property  {String} coordinate
     *@property  {Null | String}  owner
     *@property  {Null | String}  color
     *@property  {Null | String}  attackedBy
     *@property  {Null | String}   attackedTill
     */
    async addMapCondition() {
      try {
        /**
         *@type{ GameOwnerState []}
         */
        const gameMapOwnersStateResponse = await this.$axios.$get(`${process.env.SERVER_GAME_URL}/api/game/current-game/map`);
        this.gameMapOwnersState = gameMapOwnersStateResponse;
        this.isLoadMapState = true;
      } catch (error) {
        if (error?.response?.data?.error) {
          console.log(error.response.data.error);
        } else {
          console.log(error);
        }
        this.isLoadMapState = false;
        this.setGameMapLoading(false);
      }
    },
    //------USER-ACTIONS----
    async fendSegment(coordinate) {
      this.setGameMapLoading(true);
      let notificationData = {
        buttonText: "Back to conquest",
      };
      try {
        await this.$axios.$post(`${process.env.SERVER_GAME_URL}/api/game/action/defend`, {coordinate: coordinate}, this.requestConfig);
        this.showFendSuccessNotification(notificationData, coordinate);
      } catch (error) {
        this.showFendErrorNotification(notificationData, error);
      } finally {
        this.finishLoading();
      }
    },

    async surrenderSegment(coordinate) {
      this.setGameMapLoading(true);
      let notificationData = {
        buttonText: "Back to conquest",
      };
      try {
        await this.$axios.$post(`${process.env.SERVER_GAME_URL}/api/game/action/surrend`, {coordinate: coordinate}, this.requestConfig);
        this.removeUserSegment(coordinate);
        this.showSurrenderSuccessNotification(notificationData, coordinate);
      } catch (error) {
        this.showFendErrorNotification(notificationData, error);
      } finally {
        this.finishLoading();
      }
    },

    //------NOTIFICATIONS------
    showWinnerNotification() {
      let notificationData = {
        isWinnerPopup: true,
        header: "Congratulations you won the game!",
        text: "Load your NFT onto the map before the next battle begins!",
        buttonText: "Upload a photo",
      };
      this.$nuxt.$emit("openGamePopup", notificationData);
    },

    finishLoading() {
      this.setGameMapLoading(false);
      this.unblockPopup();
    },
    showSurrenderSuccessNotification(notificationData, coordinate) {
      notificationData.header = `Surrender of segment ${coordinate}`;
      this.$nuxt.$emit("openGamePopup", notificationData);
    },
    showSurrenderErrorNotification(notificationData, error) {
      notificationData.header = error.response.data.error;
      this.$nuxt.$emit("openGamePopup", notificationData);
    },
    showFendSuccessNotification(notificationData, coordinate) {
      notificationData.header = `Segment ${coordinate} successfully protected.`;
      this.$nuxt.$emit("openGamePopup", notificationData);
    },
    showFendErrorNotification(notificationData, error) {
      notificationData.header = error.response.data.error;
      this.$nuxt.$emit("openGamePopup", notificationData);
    },
    showUserSegmentAttackAlert(newSegmentAttackState) {
      this.$nuxt.$emit("openToast", {text: `Attack on your segment ${newSegmentAttackState.coordinate}`}, () => {
        this.setCheckId(newSegmentAttackState.segmentId);
        this.showSegmentPopupUpdated = true;
      });
    },

    showUserAttackDefendedAlert(newSegmentAttackState) {
      this.$nuxt.$emit("openToast", {text: `Your attack on segment ${newSegmentAttackState.coordinate} is repulsed`}, () => {
        let notificationData = {
          header: `Your attack on segment ${newSegmentAttackState.coordinate} is repulsed`,
          text: "Attack more free lands and try again!",
          buttonText: "Back to conquest",
        };
        this.$nuxt.$emit("openGamePopup", notificationData);
      });
    },
    showUserLostSegmentAlert(coordinate) {
      this.$nuxt.$emit("openToast", {text: `You lost segment ${coordinate}`});
    },
    showOwnedByAttackAlert(coordinate, country) {
      this.$nuxt.$emit("openToast", {text: `${coordinate} segment is now yours`}, () =>
        this.showOwnedByAttackNotification(coordinate, country)
      );
    },
    showOwnedByAttackNotification(coordinate, country) {
      let notificationData = {
        isPopupWithSegment: true,
        header: `The ${coordinate} segment is now yours`,
        text: "The owner of the ID token did not repel your attack and the segment is now yours! Congratulations! The next target is the entire planet.",
        country: country,
        buttonText: "Cheers!",
        image: `${process.env.SERVER_URL}/images/${country}.jpg`,
      };
      this.$nuxt.$emit("openGamePopup", notificationData);
    },
  },
};
</script>
<style lang="scss" scoped>
.game {
  position: relative;
  height: 100%;
}
.app {
  width: 100%;
  height: 100%;
  overflow: hidden;
}
.game-world-map {
  width: 100%;
}
.game-map-container {
  z-index: 20;
  width: 100%;
  height: 100%;
}
</style>
