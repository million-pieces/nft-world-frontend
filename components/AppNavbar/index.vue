<template>
  <header class="header mx-auto">
    <app-loader v-if="isLoading" class="loader"></app-loader>
    <div>
      <nav class="navbar flex-nowrap navbar-expand-lg" :class="{'navbar-opened': isNavbarOpen}">
        <!-- logo  -->
        <nuxt-link class="navbar-brand" to="/">
          <img v-if="account" src="~assets/images/icon/big-logo-dark.svg" class="w-100" alt="" />
          <img v-else src="~assets/images/icon/big-logo.svg" class="w-100" alt="" />
        </nuxt-link>

        <div
          id="collapsibleNavbar"
          v-click-outside="externalClick"
          class="collapse navbar-collapse justify-content-end text-center ml-lg-4"
          :class="{show: isNavbarOpen, 'bg-white': account}"
        >
          <!-- info block -->
          <div class="mr-auto">
            <div v-if="isGamePage" class="mb-4 mb-lg-0 mr-lg-2">
              <button class="clear-btn text-gradient-primary" @click="handleAboutGame">How to play?</button>
            </div>
            <div v-else class="d-flex flex-direction-column">
              <div class="mb-4 mb-lg-0 mr-lg-2">
                <button class="about-btn link text-white text-nowrap text-color navbar__link" @click="handleAbout">
                  About The Project
                </button>
              </div>
              <div v-if="isMapPage" class="mb-4 mb-lg-0">
                <Transition name="fadeFirst">
                  <UserActivitySidebar />
                </Transition>
              </div>
            </div>
          </div>

          <!-- Search -->
          <AppSearch v-if="isMapPage" ref="Search" @SearchFilter="blurMap" />

          <!-- Country mode -->
          <div v-if="isMapPage" class="d-flex custom-control countries-mode custom-switch mr-auto flex-nowrap mb-5 mb-lg-0 ml-3">
            <input
              id="customSwitch1"
              type="checkbox"
              class="custom-control-input mb-0"
              @change="isCountryModeActive = !isCountryModeActive"
            />
            <label class="custom-control-label" for="customSwitch1"></label>
            <label class="text-gradient-primary mb-0" for="customSwitch1"> Country mode </label>
          </div>

          <!-- Game link -->
          <div v-if="isMapPage" class="mb-5 mb-lg-0">
            <nuxt-link to="/nft-era">
              <button class="btn btn-border-primary-gradient btn-default text-white mr-lg-4 text-nowrap">Game</button>
            </nuxt-link>
          </div>

          <!-- Side card on nft-era game page -->
          <div v-if="isGamePage && address && isJoinedTheGame" :class="['mb-5', 'mb-lg-0', isGamePage ? 'game-item' : 'mr-lg-3 mr-xl-3']">
            <SideCardContainer :key="'gameSideCard'">
              <EraSideCard />
            </SideCardContainer>
          </div>

          <!-- Update game winner image  -->
          <div v-if="isWinnerWithImage && address && isGamePage" class="mb-5 mb-lg-0 game-item">
            <button class="btn btn-border-primary-gradient btn-default text-white text-nowrap" @click="showUpdateNftOnMapNotification">
              Update Map Image
            </button>
          </div>

          <!-- Get in the game -->
          <div v-if="isGamePage && address && !isJoinedTheGame && isSegmentsOwner" class="mb-5 mb-lg-0 game-item">
            <button class="btn btn-border-primary-gradient btn-default text-white text-nowrap" @click="handleGameJoin">
              Get in the game
            </button>
          </div>

          <!-- Connect wallet -->
          <div v-if="!address" class="mb-5 mb-lg-0">
            <button class="btn bg-primary-gradient btn-default mr-lg-4 border-0 text-white text-nowrap connect-btn" @click="handleUnlock">
              Connect
            </button>
          </div>

          <!-- Account user -->
          <div v-else :class="['mb-5', 'mb-lg-0', isGamePage ? 'game-item' : 'mr-lg-3 mr-xl-3']">
            <AccountDropdown :user-data="userData" />
          </div>

          <!-- User segments side card -->
          <button
            v-if="isMapPage"
            type="button"
            :class="`image-content-box merge-trigger mr-lg-3 p-0 mb-5 mb-lg-0 ${mergeMode ? 'active' : ''}`"
            @click="toggleMergeMode"
          >
            <img src="~assets/images/icon/merge-icon.svg" alt="" />
          </button>

          <!-- Controls -->
          <div class="navbar__actions-row">
            <!-- Filter drop down -->
            <AppDropdown v-if="isMapPage" ref="DropDown" :account="account" @DDFilter="filterByDD" />
            <!-- basket side card -->
            <Transition v-if="isMapPage" name="fadeFirst">
              <SideCardContainer :key="'sideCard'">
                <SideCard :user-segments="userSegmentsInfo" />
              </SideCardContainer>
            </Transition>
          </div>
          <!-- User game balance -->
          <div v-if="isGamePage && address && isJoinedTheGame" class="game-item mb-5 mb-lg-0 mr-3">
            <img class="point-icon" src="~assets/images/icon/point.svg" />
            <span class="text-gradient-primary">{{ userGameBalance }}</span>
          </div>
        </div>

        <!-- Mobile Button -->
        <button class="navbar-toggler d-lg-none" :class="{'navbar-toggler-active': isNavbarOpen}" type="button" @click="handleNavBar">
          <span class="navbar-toggler-icon" :class="{'bg-dark': account}"></span>
          <span class="navbar-toggler-icon" :class="{'bg-dark': account}"></span>
          <span class="navbar-toggler-icon" :class="{'bg-dark': account}"></span>
        </button>
      </nav>
    </div>
  </header>
</template>

<script>
import tokens from "@/mixins/tokens";
import user from "@/mixins/user";
import paintIcon from "@/assets/images/icon/painting.svg";
import paintColorIcon from "@/assets/images/icon/painting-gradient.svg";

import {mapActions, mapGetters} from "vuex";

export default {
  mixins: [user, tokens],
  props: {
    account: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      isNavbarOpen: false,
      paintIcon,
      paintColorIcon,
      isCountryModeActive: false,
      userData: {},
      userSegmentsInfo: [],
      userSegmentsIsHighlighted: false,
      mergeMode: false,
      isLoading: false,
      isWinnerWithImage: false,
    };
  },
  computed: {
    ...mapGetters({
      userSegments: "soldSegments/getUserSegments",
      isJoinedTheGame: "era/getIsJoinedTheGame",
      userGameBalance: "era/getUserGameBalance",
      user: "auth/user",
      isUserSegmentsVisible: "worldMap/getIsUserSegmentsVisible",
      // userGameData: "era/getUserGameData",
    }),

    path() {
      return this.$route.path;
    },
    isMapPage() {
      return this.$route.path === "/";
    },
    isGamePage() {
      return this.$route.path.includes("/nft-era");
    },
    isSegmentsOwner() {
      return this.userSegmentsInfo?.length > 0;
    },
  },
  watch: {
    $route() {
      this.isNavbarOpen = false;
    },

    isUserSegmentsVisible(val) {
      this.mergeMode = val;
    },

    isCountryModeActive(val) {
      this.changeCM(val);
    },
    async address(val, oldVal) {
      if (val === oldVal) return false;

      try {
        this.userData = await this.$axios.$get(`${process.env.SERVER_URL}/user/${val.toString().toLowerCase()}`);
        await this.getUserSegmentsInfo();
        if (this.userSegmentsIsHighlighted) {
          this.highlightUserSegments();
        }
      } catch (error) {
        console.error(error);
      }
    },

    async mergeMode(val) {
      this.userSegmentsIsHighlighted = val;
      this.highlightUserSegments();
      this.$nuxt.$emit("mergeModeChange", val);
    },
  },
  async mounted() {
    this.$nuxt.$on("setLoading", (val) => {
      this.isLoading = val;
    });
    this.$nuxt.$on("segment-click", this.checkUserJoin);
    this.$nuxt.$on("not-join", this.checkUserJoin);
    if (this.address != null) {
      this.userData = await this.$axios.$get(`${process.env.SERVER_URL}/user/${this.address.toString().toLowerCase()}`);
    }
    this.$nuxt.$on("show-winner-interface", (bool) => {
      this.isWinnerWithImage = bool;
    });
    this.$nuxt.$on("close-merge-mode", this.closeMergeMode);
  },
  beforeDestroy() {
    this.$nuxt.$off("setLoading");
    this.$nuxt.$off("segment-click");
    this.$nuxt.$off("show-winner-interface");
    this.$nuxt.$off("not-join");
  },
  methods: {
    ...mapActions({
      changeUserSegmentsVisible: "worldMap/changeUserSegmentsVisible",
      changeCountryMode: "worldMap/changeCountryMode",
      setMapIsBlurred: "worldMap/setMapIsBlurred",
      setFilterValue: "worldMap/setFilterValue",
      setIsTheGame: "era/setIsTheGame",
      blockPopup: "segmentPopupState/blockPopup",
    }),

    checkUserJoin() {
      if (this.isGamePage === false) {
        return;
      }
      if (this.address == null) {
        this.handleUnlock();
      } else if (this.isJoinedTheGame == null) {
        this.handleGameJoin();
      }
    },

    showEnteredTheGameNotification() {
      const notificationData = {
        header: "You have entered the game",
        buttonText: "On to the victories ",
      };
      this.$nuxt.$emit("openGamePopup", notificationData);
    },
    showErrorNotification(error) {
      const notificationData = {
        header: error.message,
        buttonText: "Close",
      };
      if (error.response?.data?.error) {
        notificationData.header = error.response.data.error;
      }
      this.$nuxt.$emit("openGamePopup", notificationData);
    },

    async joinTheGame() {
      try {
        await this.$axios.$post(`${process.env.SERVER_URL}/game/user/join`, {}, this.requestConfig);
        this.showEnteredTheGameNotification();
        this.setIsTheGame(true);
      } catch (error) {
        this.showErrorNotification(error);
        console.log(error.message);
      } finally {
        this.blockPopup(false);
      }
    },

    handleGameJoin() {
      let joinData = {
        header: "Get in the game",
        buttonText: "Get in the game",
      };

      this.$nuxt.$emit("openJoinGamePopup", joinData, this.joinTheGame);
    },

    showUpdateNftOnMapNotification() {
      const notificationData = {
        isWinnerPopup: true,
        header: "Congratulations you won the game!",
        text: "Load your NFT onto the map before the next battle begins!",
        buttonText: "Upload a photo",
      };
      this.$nuxt.$emit("openGamePopup", notificationData);
    },

    changeCM(val) {
      this.changeCountryMode(val);
    },
    blurMap() {
      this.closeMergeMode();
      this.setMapIsBlurred(true);
    },
    handleUnlock() {
      this.$nuxt.$emit("openUnlockPopup");
    },

    handleAbout() {
      this.$nuxt.$emit("openAboutPopup");
    },
    handleAboutGame() {
      this.$nuxt.$emit("openAboutPopup", true);
    },

    handleGame() {
      this.$nuxt.$emit("openGamePopup");
    },
    async highlightUserSegments() {
      if (this.userSegmentsInfo.length) {
        return;
      }
      this.getUserSegmentsInfo();
    },

    //get info from the graph
    async getUserSegmentsInfo() {
      const graphResponse = await this.$axios.$post(process.env.GRAPH, {
        query: `
         query ($lastId: String) {
          users(where: {id: "${this.address}"}) {
            id
            claimablePiece
            tokens(first: 1000) {
              id
              claimablePiece
            }
          }
        }
      `,
      });
      try {
        this.userGraph = graphResponse.users[0];
        await this.updateInfoFromGraph(this.userGraph);
      } catch (e) {
        console.error("Error during transferring user data", e);
      }
    },

    returnSegmentData(id) {
      return this.tokens.find((el) => el.id == id);
    },

    async updateInfoFromGraph(user) {
      let output = [];

      for (let i = 0; i < user?.tokens.length; i++) {
        const segmentData = this.returnSegmentData(user.tokens[i].id);
        const img = `${process.env.SERVER_URL}/images/${segmentData.country}.jpg`;
        const claimablePiece = user.tokens[i].claimablePiece;

        output.push({
          country: segmentData.country,
          coordinates: segmentData.coordinates,
          countryImage: img,
          price: claimablePiece,
        });
      }

      this.userSegmentsInfo = output;
    },

    handleNavBar() {
      this.isNavbarOpen = !this.isNavbarOpen;

      if (this.isNavbarOpen) {
        document.getElementById("__nuxt").style.overflow = "hidden";
        document.getElementById("__nuxt").style.touchAction = "none";
      } else {
        document.getElementById("__nuxt").style.overflow = "auto";
        document.getElementById("__nuxt").style.touchAction = "auto";
      }
    },
    externalClick(e) {
      let classList = e.target.classList;

      if (!classList.contains("navbar-toggler-icon") && !classList.contains("navbar-toggler")) {
        this.isNavbarOpen = false;
        document.getElementById("__nuxt").style.overflow = "auto";
      }
    },

    filterByDD(val) {
      this.blurMap();
      this.setFilterValue(val);
      this.$refs.Search.clearVal();
    },

    toggleMergeMode() {
      this.mergeMode = !this.mergeMode;
      this.changeUserSegmentsVisible(this.mergeMode);
    },
    closeMergeMode() {
      this.mergeMode = false;
      this.changeUserSegmentsVisible(this.mergeMode);
    },
  },
};
</script>

<style src="./index.scss" lang="scss" scoped></style>
