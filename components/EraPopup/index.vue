<template>
  <transition name="fade">
    <div v-if="isOwner != null" :class="[isOwner === true ? 'owner-view' : 'villager-view']" class="era-popup-container">
      <div class="era-popup">
        <button class="button-close" @click="closePopup">
          <div class="close-box">
            <span></span>
            <span></span>
          </div>
        </button>
        <figure v-if="!placeholder" class="era-popup__image-container">
          <img v-if="segmentImage" class="era-popup__image" :src="segmentImage" @error="placeholder = true" />
        </figure>
        <div v-if="placeholder" class="text-white era-popup__image-container era-popup__image-container-error">Not found</div>
        <div class="era-popup__content base-text__white">
          <div class="era-popup__content-header">
            <div class="content-header__info">
              <EraInfoBlock header="ID" :value="segmentData.coordinate" />
              <EraInfoBlock header="CounTRY" :value="segmentData.country | dashReplacer" class="text-uppercase" />
              <EraInfoBlock header="Yearly income" :value="segmentData.yearlyReward || 0" theme="point" />
            </div>
            <div v-if="isOwner && segmentData.isRewardAvailable" class="nft-era__button-container">
              <button
                class="nft-era__button text-white"
                @click="$nuxt.$emit('claimTokensByCoordinate', isOwner, segmentData.coordinate, true)"
              >
                Claim current({{ segmentData.currentRewardAmount }}<MiniPoint />)
              </button>
              <div v-if="segmentData.isMaxReward" class="nft-era__button_danger">
                <EraRewardDanger />
              </div>
            </div>
            <div v-else-if="isOwner">
              <EraInfoBlock header="claiming in cooldown" :value="segmentData.nextRewardAt" theme="gradient-value" :type="'time'" />
            </div>
          </div>
          <div v-if="ownerData" class="mb-3">
            <p class="base-text__white_muffled">OWNER</p>
            <OwnerShortInfo :theme="'segmentEraPopup'" :owner-data="ownerData" />
          </div>
          <div class="era-popup__caves">
            <EraPopupCave
              v-for="(cave, index) in normalizedCaves"
              :key="index"
              :segment-id="segmentData.id"
              :cave-num="index + 1"
              :cave="cave"
              :is-owner="isOwner"
              :coordinate="segmentData.coordinate"
            />
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>
<script>
import MiniPoint from "@/assets/images/icon/point-white-mini.svg?inline";

import user from "@/mixins/user";
import helpers from "@/mixins/helpers";

import {mapGetters} from "vuex";

export default {
  components: {MiniPoint},
  mixins: [user, helpers],
  props: {
    value: {
      type: Boolean,
      required: true,
    },
    positionId: {
      type: String,
      required: true,
    },
    isOwner: {
      type: Boolean,
      required: true,
    },
  },
  data() {
    return {
      isLoading: false,
      placeholder: false,
      country: null,
      owner: null,
      ownerData: null,
      segmentData: {},
      cavesMaximumValue: 3,
    };
  },
  computed: {
    ...mapGetters({
      isJoinedTheGame: "era/getIsJoinedTheGame",
    }),
    // return caves array sorted by his position
    normalizedCaves() {
      if (this.segmentData.caves == null) {
        return null;
      }
      let cavesArray = [];
      for (let i = 0; i < this.cavesMaximumValue; i++) {
        let isCaveOwned = this.segmentData.caves[i] ? this.segmentData.caves[i] : null;
        cavesArray.push(isCaveOwned);
      }
      for (let i = 0; i < cavesArray.length; i++) {
        if (cavesArray[i]?.position) {
          let cave = cavesArray[i];
          cavesArray[i] = null;
          cavesArray[cave.position - 1] = cave;
        }
      }
      return cavesArray;
    },
    segmentImage() {
      if (this.segmentData.country == null) {
        return false;
      }
      return `${process.env.SERVER_URL}/images/${this.segmentData.country}.jpg`;
    },
  },

  watch: {
    isOwner() {
      this.requestSegmentData(this.positionId);
    },
    positionId() {
      this.requestSegmentData(this.positionId);
    },
  },
  async mounted() {
    this.$nuxt.$on("update-era-popup-data", () => this.requestSegmentData(this.positionId));
    this.requestSegmentData(this.positionId);
  },
  destroyed() {
    this.$nuxt.$off("update-era-popup-data");
  },
  methods: {
    async requestSegmentData(positionId) {
      try {
        if (!this.address || !this.isJoinedTheGame) {
          this.segmentData = await this.$axios.$get(`${process.env.SERVER_URL}/game/segments/${positionId}/visitor`);
        } else {
          this.segmentData = await this.$axios.$get(`${process.env.SERVER_URL}/game/segments/${positionId}`, this.requestConfig);
        }
        this.ownerData = await this.$axios.$get(`${process.env.SERVER_URL}/user/${this.segmentData.owner}`);
      } catch (error) {
        console.error(error);
      }
    },
    closePopup() {
      this.$emit("input", false);
    },
  },
};
</script>
<style lang="scss" scoped src="./index.scss"></style>
