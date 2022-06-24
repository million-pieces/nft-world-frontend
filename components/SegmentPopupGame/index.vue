<template>
  <div>
    <!-- Info -->
    <div v-if="gameSegmentDescription !== false" class="text-white text-center mb-2 mt-2">
      <p>{{ gameSegmentDescription }}</p>
    </div>
    <!-- Segment Image -->
    <div class="popup__image mb-3" :class="[segment.isSegmentWithCustomImage ? '' : 'popup__image_big']">
      <img v-if="segment.img" :src="segment.img" alt="" @error="imgPlaceholder = true" @load="movePopup(segment.positionId)" />
      <div v-else-if="!segment.img && !imgPlaceholder">Loading...</div>
      <div v-if="imgPlaceholder">Not found!</div>
    </div>
    <!-- Segment data  -->
    <div v-if="ownerData && !isAttacked" class="position-relative">
      <p class="owner game-segment-popup owner__label text-white">Owner</p>
      <OwnerShortInfo :owner-data="ownerData" :theme="'segmentPopup'" />
    </div>

    <div class="d-flex justify-content-between text-white w-100">
      <div class="w-50 country-name">
        <p class="country-name__label text-white opacity-3">Country</p>
        <p class="country-name__value text-dotted-overflow" :title="segment.country | dashReplacer">{{ segment.country | dashReplacer }}</p>
      </div>
      <div class="segment-id w-50">
        <p class="segment-id__label text-white opacity-3">ID</p>
        <p class="segment-id__value text-dotted-overflow" :title="segment.positionId | dashReplacer">
          {{ segment.positionId | dashReplacer }}
        </p>
      </div>
    </div>

    <div v-if="attackerData && isAttacked" class="position-relative mt-3">
      <p class="owner game-segment-popup owner__label text-white">Attacked by</p>
      <OwnerShortInfo :owner-data="attackerData" :theme="'segmentPopup'" />
    </div>

    <!-- Segment action buttons -->
    <div v-if="segment.type !== 'winner'">
      <!-- User segment buttons -->
      <div v-if="isUserGameSegment">
        <div v-if="isAttacked" class="position-relative">
          <div class="text-center mb-3 mt-4">
            <!-- Fend button -->
            <button
              :class="[+fendPrice > +userGameBalance ? 'not-enough-point' : '']"
              class="btn bg-secondary-gradient btn-default border-0 text-white text-nowrap connect-btn"
              @click="() => handleFend(segment.positionId)"
            >
              Fend for <b>{{ fendPrice }}</b>
              <img class="point-icon" src="~assets/images/icon/white-point-icon.svg" />
            </button>
          </div>
          <!--  Give up button -->
          <div class="text-center mb-2">
            <button
              class="btn btn-border-primary-gradient btn-default text-white text-nowrap"
              @click="() => handleSurrender(segment.positionId)"
            >
              Give up
            </button>
          </div>
        </div>
      </div>
      <!-- Other segment buttons -->
      <div v-else>
        <div v-if="isFreeGameSegment" class="text-center mb-3 mt-4">
          <button
            v-if="isFirstUserSegment && address"
            class="btn bg-danger-gradient btn-default border-0 text-white text-nowrap connect-btn"
            :class="{disabled: isDisabledButton}"
            @click="buyGameSegment"
          >
            Occupy for free
          </button>
          <button
            v-else
            class="btn bg-danger-gradient btn-default border-0 text-white text-nowrap connect-btn"
            :class="{disabled: isDisabledButton}"
            @click="buyGameSegment"
          >
            Occupy for <b>{{ buyPrice }}</b>
            <img class="point-icon" src="~assets/images/icon/white-point-icon.svg" />
          </button>
        </div>
        <div v-else class="text-center mb-3 mt-4">
          <button
            class="btn bg-danger-gradient btn-default border-0 text-white text-nowrap connect-btn"
            :class="{disabled: isDisabledButton}"
            @click="attackGameSegment"
          >
            Attack for <b>{{ attackPrice }}</b>
            <img class="point-icon" src="~assets/images/icon/white-point-icon.svg" />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import {mapGetters, mapActions} from "vuex";
import user from "@/mixins/user.js";

export default {
  filters: {
    dashReplacer(string) {
      return string?.replace(/_/g, " ");
    },
  },
  mixins: [user],
  props: {
    segment: {
      type: Object,
      required: true,
    },
    ownerData: {
      type: Object,
      default: null,
      required: false,
    },
    attackerData: {
      type: Object,
      default: null,
      required: false,
    },
    movePopup: {
      type: Function,
      required: true,
    },
  },
  data() {
    return {
      attackPrice: process.env.GAME_ATTACK_PRICE,
      buyPrice: process.env.GAME_BUY_PRICE,
      fendPrice: process.env.GAME_FEND_PRICE,
      isDisabledButton: false,
      imgPlaceholder: true,
    };
  },

  computed: {
    ...mapGetters({
      userGameBalance: "game/getUserGameBalance",
      isJoinedTheGame: "game/getIsJoinedTheGame",
      userGameSegments: "game/getUserGameSegments",
    }),
    isAttacked() {
      return Boolean(this.segment.attackedBy);
    },
    isFirstUserSegment() {
      return this.userGameSegments.length === 0 ? true : false;
    },
    isFreeGameSegment() {
      return this.ownerData?.address == null;
    },
    isUserGameSegment() {
      return this.address === this.ownerData?.address;
    },
    attackerAvatar() {
      if (this.attackerData.avatar == null) return null;
      return process.env.SERVER_URL + this.attackerData.avatar;
    },
    gameSegmentDescription() {
      if (this.isFirstUserSegment && this.isFreeGameSegment && this.address && this.segment.type !== "winner") {
        return "Occupy your first segment for free";
      } else if (this.isAttacked && this.isUserGameSegment && this.segment.type !== "winner") {
        return "This segment is under attack!";
      } else if (this.segment.type === "winner") {
        return "Game winner";
      } else {
        return false;
      }
    },
  },
  methods: {
    ...mapActions({
      setGameMapLoading: "game/setGameMapLoading",
      blockPopup: "segmentPopupState/blockPopup",
    }),
    setRequestLoading(bool) {
      this.setGameMapLoading(bool);
      if (bool === false) this.blockPopup(false);
      this.isDisabledButton = bool;
    },

    configureBuyNotification() {
      if (this.isFirstUserSegment) {
        let notificationData = {
          text: "You occupied your first piece. Expand your territory by seizing unoccupied lands and attacking other peoples Next goal - whole planet.",
          header: "Congratulations!",
          buttonText: "On to the victories ",
        };
        return notificationData;
      } else {
        let notificationData = {
          header: `You occupied ${this.segment.positionId}`,
          text: "Expand your territory by seizing unoccupied lands and attacking other people's. Next goal - whole planet.",
          buttonText: "On to the victories ",
        };
        return notificationData;
      }
    },

    async buyGameSegmentRequest() {
      let notificationData;
      try {
        await this.$axios.$post(
          `${process.env.SERVER_GAME_URL}/api/game/action/buy`,
          {coordinate: this.segment.positionId},
          this.requestConfig
        );
        notificationData = this.configureBuyNotification(notificationData);
      } catch (error) {
        let errorHeader = error?.response?.data?.error ? error.response.data.error : error;
        notificationData = {
          header: errorHeader,
          buttonText: "Close",
        };
      } finally {
        this.$nuxt.$emit("openGamePopup", notificationData);
      }
    },

    async buyGameSegment() {
      if (this.address == null || this.isJoinedTheGame === false) {
        this.$nuxt.$emit("not-join");
        return;
      }
      this.setRequestLoading(true);
      await this.buyGameSegmentRequest();
      this.setRequestLoading(false);
    },

    async attackGameSegmentRequest(notificationData) {
      try {
        const attackResponse = await this.$axios.$post(
          `${process.env.SERVER_GAME_URL}/api/game/action/attack`,
          {coordinate: this.segment.positionId},
          this.requestConfig
        );
        if (attackResponse.data === 0) {
          this.showSuccessAttackNotification(notificationData);
        } else {
          this.showFiledAttackNotification(notificationData);
        }
      } catch (error) {
        this.showErrorAttackNotification(notificationData, error);
      }
    },

    async attackGameSegment() {
      if (this.address == null || this.isJoinedTheGame === false) {
        this.$nuxt.$emit("not-join");
        return;
      }
      let notificationData = {
        buttonText: "Back to conquest",
      };
      if (this.isFirstUserSegment) {
        this.showAttackWithoutSegmentsNotification(notificationData);
        return false;
      }
      if (+this.userGameBalance < +this.attackPrice) {
        notificationData.header = "Sorry, you have not enough coins for that action";
        this.$nuxt.$emit("openGamePopup", notificationData);
        return false;
      }
      this.setRequestLoading(true);
      await this.attackGameSegmentRequest(notificationData);
      this.setRequestLoading(false);
    },

    handleFend(coordinates) {
      this.$nuxt.$emit("fend-segment", coordinates);
    },
    handleSurrender(coordinates) {
      this.$nuxt.$emit("surrender-segment", coordinates);
    },

    showSuccessAttackNotification(notificationData) {
      notificationData.header = `Success! Your attack on segment ${this.segment.positionId} has started!`;
      notificationData.text = "The owner of the land has 2 hours to repel your attack. If he doesn't then you get land";
      this.$nuxt.$emit("openGamePopup", notificationData);
    },
    showFiledAttackNotification(notificationData) {
      notificationData.header = `Your attack on segment ${this.segment.positionId} failed`;
      notificationData.text = "Try again";
      this.$nuxt.$emit("openGamePopup", notificationData);
    },
    showErrorAttackNotification(notificationData, error) {
      console.log(error.response);
      notificationData.header = error.response.data.error;
      this.$nuxt.$emit("openGamePopup", notificationData);
    },
    showAttackWithoutSegmentsNotification(notificationData) {
      notificationData.header = "Take at least 1 free segment first.";
      this.$nuxt.$emit("openGamePopup", notificationData);
    },
  },
};
</script>
<style lang="scss" src="../SegmentPopup/index.scss" scoped></style>
