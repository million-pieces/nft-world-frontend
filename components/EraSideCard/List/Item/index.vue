<template>
  <div class="segment">
    <div class="segment__info">
      <figure class="info__image-block cursor-pointer" @click="showSegmentPopup">
        <img class="info__image" :src="segmentImage" />
      </figure>
      <div class="info__content-block cursor-pointer" @click="showSegmentPopup">
        <div class="d-flex">
          <EraInfoBlock header="ID" :value="segment.coordinates" />
          <EraInfoBlock
            v-if="isOwner"
            header="CounTRY"
            :value="segment.country | dashReplacer"
            class="content-block__country text-uppercase"
          />
          <EraInfoBlock v-else header="reWARD" :value="segment.totalReward" :theme="'point'" />
        </div>
        <div v-if="isOwner" class="content-block__caves">
          <span class="caves__icons">
            <Cave v-for="(cave, index) in caves" :key="index" class="icons__item" :class="cave === true ? '' : 'disabled'" />
          </span>
          <EraVillagersAmount :value="segment.citizensAmount" :max-value="citizensMaximumValue" />
        </div>
        <button v-else class="content-block__check-segment text-gradient-primary">Check segment of residence</button>
      </div>
    </div>
    <div class="segment__reward">
      <EraRewardDanger v-if="segment.isMaxReward" />
      <EraInfoBlock v-else header="Time before next reward" :value="segment.nextRewardAt | normalizeDate" :theme="'gradient-value'" />

      <button v-if="segment.currentReward > 0 || segment.unclaimedReward > 0" class="nft-era__button" @click="claimTokensByCoordinate">
        Claim current({{ segment.currentReward || segment.unclaimedReward }}<MiniPoint />)
      </button>
    </div>
  </div>
</template>
<script>
import helpers from "@/mixins/helpers";

import Cave from "@/assets/images/icon/cave.svg?inline";
import MiniPoint from "@/assets/images/icon/point-white-mini.svg?inline";

import {mapActions} from "vuex";
export default {
  components: {
    Cave,
    MiniPoint,
  },
  mixins: [helpers],
  props: {
    isOwner: {
      type: Boolean,
      required: true,
    },
    segment: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      cavesMaximumValue: 3,
      citizensInCaveMaximumValue: 4,
    };
  },
  computed: {
    citizensMaximumValue() {
      return this.segment.cavesAmount * this.citizensInCaveMaximumValue;
    },
    caves() {
      let cavesArray = [];
      for (let i = 0; i < this.cavesMaximumValue; i++) {
        let isCaveOwned = i < this.segment.cavesAmount ? true : false;
        cavesArray.push(isCaveOwned);
      }
      return cavesArray;
    },
    segmentImage() {
      return `${process.env.SERVER_URL}/images/${this.segment.country}.jpg`;
    },
  },
  methods: {
    ...mapActions({
      markUserGameSegment: "era/markUserGameSegment",
    }),
    claimTokensByCoordinate() {
      const claimId = this.isOwner ? this.segment.coordinates : this.segment.caveId;
      this.$nuxt.$emit("claimTokensByCoordinate", this.isOwner, claimId);
    },
    showSegmentPopup() {
      this.markUserGameSegment(false);
      this.$nuxt.$emit("close-other-sidebars");
      this.$nuxt.$emit("show-era-user-segment", this.isOwner, this.segment.coordinates);
    },
  },
};
</script>
<style lang="scss" scoped>
.segment {
  display: flex;
  justify-content: space-between;
  margin-bottom: 1.3333rem;
  &__reward {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    width: 10.7143rem;
  }
  &__info {
    display: flex;
    .info__image-block {
      margin: 0 1.1429rem 0 0;
    }
    .info__image {
      width: 3.6667rem;
      height: 5.2381rem;
    }
    .info__content-block {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      .content-block__country {
        max-width: 6.1905rem;
      }

      .content-block__check-segment {
        margin: 0;
        padding: 0 0 0.381rem;
        font-weight: 700;
        font-size: 0.5714rem;
        line-height: 144%;
        text-transform: uppercase;
        border: none;
        outline: none;
      }
      .content-block__caves {
        display: flex;
        padding-bottom: 5px;
        .caves__icons {
          margin-right: 1.0476rem;
          margin-bottom: 3px;
          .icons__item {
            width: 1.5238rem;
            height: 1.5238rem;
            margin-right: 0.1905rem;
          }
        }
      }
    }
  }
}
</style>
