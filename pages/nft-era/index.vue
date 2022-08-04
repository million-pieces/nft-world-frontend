<template>
  <section id="era" class="era">
    <EraPopup v-if="isPopupActive" v-model="isPopupActive" :position-id="selectedSegment.positionId" :is-owner="isSegmentOwner" />
    <AppLoader v-if="isEraLoading" class="app-loader" />
    <div id="era-map-container" ref="mapContainer" class="era-map-container map-container connections" @wheel.prevent="scaleMap">
      <canvas id="era-map" class="era-map"></canvas>
    </div>
  </section>
</template>
<script>
import "@pixi/events";
import {cloneDeep} from "lodash";

import mapDefaultValues from "@/mixins/mapDefaultValues.js";
import drawEraMap from "@/mixins/drawEraMap.js";
import user from "@/mixins/user";
import SEGMENTS from "@/constants/segments";
import helpers from "@/mixins/helpers";

import {mapActions, mapGetters} from "vuex";

export default {
  mixins: [mapDefaultValues, drawEraMap, user, helpers],
  data() {
    return {
      isEraLoading: false,
      isLoadMapState: false,
      map: [],
      gameMapOwnersState: [],
      //popup data
      isPopupActive: false,
      isSegmentOwner: false,
      selectedSegment: null,
      positionId: null,
      isUserGameSegmentsVisibleUpdated: false,
    };
  },

  computed: {
    ...mapGetters({
      isMapLoading: "era/getIsMapLoading",
      userGameSegments: "era/getUserGameSegments",
      isMarkedUserGameSegments: "era/getIsMarkedUserGameSegments",
    }),
  },
  watch: {
    isMarkedUserGameSegments() {
      this.isUserGameSegmentsVisibleUpdated = true;
    },
    address(address) {
      this.updateMapState();
      if (address != null) {
        this.requestUserData();
      } else {
        this.setUserGameData(null);
      }
      if (this.isPopupActive === true) {
        this.isSegmentOwner = this.address === this.selectedSegment.walletAddress;
      }
    },
  },
  async mounted() {
    this.autoLogin();
    this.isEraLoading = true;
    if (this.address != null) {
      this.requestUserData();
    }
    this.normalizeScreen();
    this.addEventListeners();
    await this.requestMapState();
    this.drawEraMap();
    this.addNuxtListeners();
    this.isEraLoading = false;
  },
  destroyed() {
    document.getElementById("app").classList.remove("screen-full-height");
    document.getElementById("__nuxt").style.height = "100%";
    document.getElementById("__nuxt").style.overflow = "auto";

    this.$nuxt.$off("update-era-user-data");
    this.$nuxt.$off("claimTotalTokens");
    this.$nuxt.$off("claimTokensByCoordinate");
    this.$nuxt.$off("show-era-user-segment");
    this.isDestroyMap = true;
  },
  methods: {
    ...mapActions({
      setGameMapLoading: "era/setGameMapLoading",
      setIsTheGame: "era/setIsTheGame",
      setUserGameData: "era/setUserGameData",
    }),
    showSegmentPopup() {
      this.isSegmentOwner = this.address === this.selectedSegment.walletAddress;
      this.isPopupActive = true;
    },
    addNuxtListeners() {
      this.$nuxt.$on("update-era-user-data", this.requestUserData);
      this.$nuxt.$on("claimTotalTokens", (isOwner) => this.claimTotalTokens(isOwner));
      this.$nuxt.$on("claimTokensByCoordinate", (isOwner, coordinate, isPopup = false) =>
        this.claimTokensByCoordinate(isOwner, coordinate, isPopup)
      );
      this.$nuxt.$on("show-era-user-segment", (isOwner, positionId) => {
        this.selectedSegment = {positionId};
        this.isSegmentOwner = isOwner;
        this.isPopupActive = true;
      });
    },
    async updateMapState() {
      if (this.address == null) {
        return;
      }
      try {
        this.$axios.$post(`${process.env.SERVER_URL}/game/map`, null, this.requestConfig);
      } catch (error) {
        console.error(error);
      }
    },
    async requestMapState() {
      this.updateMapState();
      try {
        const mapState = await this.$axios.$get(`${process.env.SERVER_URL}/game/map`, this.requestConfig);
        this.addMapState(mapState);
      } catch (error) {
        console.error(error);
      }
    },
    async claimTotalTokens(isOwner) {
      try {
        this.isEraLoading = true;
        await this.$axios.$get(`${process.env.SERVER_URL}/game/claim/${isOwner ? "owner" : "citizen"}/total`, this.requestConfig);
        this.requestUserData();
      } catch (error) {
        this.showErrorNotification(error);
      } finally {
        this.isEraLoading = false;
      }
    },
    async claimTokensByCoordinate(isOwner, coordinate, isPopup) {
      try {
        this.isEraLoading = true;
        await this.$axios.$get(`${process.env.SERVER_URL}/game/claim/${isOwner ? "owner" : "citizen"}/${coordinate}`, this.requestConfig);
        this.requestUserData();
        if (isPopup === true) {
          this.$nuxt.$emit("update-era-popup-data");
        }
      } catch (error) {
        this.showErrorNotification(error);
      } finally {
        this.isEraLoading = false;
      }
    },
    addMapState(mapState) {
      let mapStateCopy = cloneDeep(mapState);
      this.map = SEGMENTS.map((segment) => {
        let mapSegment = {...segment};
        let segmentState = mapStateCopy.find((segmentStateItem) => {
          return segmentStateItem.segments.find((positionIdItem) => positionIdItem == segment.positionId);
        });
        if (segmentState != null) {
          mapSegment.walletAddress = segmentState.walletAddress;
          //convert to valid color format
          mapSegment.color = "0x" + segmentState.color.slice(1);
        }
        return mapSegment;
      });
    },
    normalizeScreen() {
      document.getElementById("app").classList.add("screen-full-height");
      document.getElementById("__nuxt").style.height = 100 + "vh";
      document.getElementById("__nuxt").style.overflow = "hidden";
    },
    async requestUserData() {
      let userData = {};
      let userInfo = {};
      let userSegmentsData = {};
      let isTheGame;
      try {
        userInfo = await this.$axios.$get(`${process.env.SERVER_URL}/game/user`, this.requestConfig);
        userSegmentsData = await this.$axios.$get(`${process.env.SERVER_URL}/game/segments`, this.requestConfig);
        isTheGame = true;
      } catch (error) {
        isTheGame = false;
        console.error(error);
      }
      this.setIsTheGame(isTheGame);
      if (isTheGame === true) {
        userData = Object.assign(userInfo, userSegmentsData);
        this.setUserGameData(userData);
      }
    },
    showFreeSegmentNotification() {
      this.$nuxt.$emit(
        "openGamePopup",
        {
          header: "Buy this segment on the main map.",
          buttonText: "Main map",
        },
        () => this.$router.push("/")
      );
    },
  },
};
</script>
<style lang="scss" scoped>
.era {
  width: 100%;
  height: 100%;
}
.era-map-container {
  width: 100%;
  height: 100%;
}
</style>
