<template>
  <div class="ml-lg-3">
    <!-- User Segments button  -->
    <button class="btn btn-border-primary-gradient btn-default text-white text-nowrap" @click="toggleUserSegmentsVisible">
      My Segments
      <!-- User segments under attack value  -->
      <div v-show="attackedUserSegmentsData.length" class="badge bg-primary-gradient">
        {{ attackedUserSegmentsData.length }}
      </div>
    </button>
    <!-- Side card -->
    <div class="side-card-selection bg-dark p-4" :class="isPopupVisible ? 'visible' : ''">
      <div class="text-white d-flex justify-content-between">
        <span>
          Your segments <b>{{ userGameSegments.length }}</b>
        </span>
        <button class="p-0 border-0 bg-transparent" @click="toggleUserSegmentsVisible">
          <IconClose />
        </button>
      </div>
      <!-- User segment  -->
      <div v-for="segment in userGameSegments" :key="segment.id">
        <div class="d-flex flex-sm-row flex-column mt-4 mb-3">
          <!-- Segment image -->
          <div class="img-block">
            <div>
              <img :src="segment.countryImg" class="w-100" />
            </div>
          </div>
          <!-- Segment data -->
          <div class="description-block">
            <div class="w-100 mb-4 text-white text-uppercase text-left letter-spacing">
              <div class="mb-3 w-100">
                <p class="opacity-3 mb-0 text-small">Coordinate</p>
                <p class="mb-0">{{ segment.positionId }}</p>
              </div>
              <div class="mb-3 w-100">
                <p class="opacity-3 mb-0 text-small">Country</p>
                <p class="mb-0">{{ segment.country }}</p>
              </div>
            </div>
            <!-- Segment buttons -->
            <div v-if="segment.attackedBy" class="w-100 text-white state">
              <p class="text-left mb-2 state-message">Your segment is under attack!!</p>
              <div class="d-flex justify-content-between">
                <button
                  :class="[+fendPrice > +userGameBalance ? 'not-enough-point' : '']"
                  class="btn bg-secondary-gradient btn-default border-0 text-white text-nowrap connect-btn"
                  @click="() => handleFend(segment.positionId)"
                >
                  Fend for <b>{{ fendPrice }}</b>
                  <img class="point-icon" src="~assets/images/icon/white-point-icon.svg" />
                </button>
                <button
                  class="btn btn-border-primary-gradient btn-default text-white text-nowrap"
                  @click="() => handleSurrender(segment.positionId)"
                >
                  Give up
                </button>
              </div>
            </div>
            <div v-else class="w-100 text-white mt-5 text-left pt-2">
              <button
                class="btn bg-secondary-gradient btn-default border-0 text-white text-nowrap connect-btn"
                @click="() => handleCheckSegment(segment.id)"
              >
                Check segment
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import IconClose from "@/assets/images/icon/white-close.svg?inline";

import user from "@/mixins/user";
import sidebar from "@/mixins/sidebar.js";

import {mapGetters, mapActions} from "vuex";

export default {
  components: {
    IconClose,
  },
  mixins: [user, sidebar],
  data() {
    return {
      isDropdownActive: false,
      fendPrice: process.env.GAME_FEND_PRICE,
    };
  },
  computed: {
    ...mapGetters({
      address: "auth/address",
      isPopupBlock: "segmentPopupState/isPopupBlock",
      getOwner: "soldSegments/getOwner",
      userGameSegments: "game/getUserGameSegments",
      attackedUserSegmentsData: "game/getAttackedUserSegmentsData",
      userGameBalance: "game/getUserGameBalance",
    }),
  },
  beforeDestroy() {
    this.$nuxt.$off("segment-click");
  },
  methods: {
    ...mapActions({
      markUserGameSegment: "game/markUserGameSegment",
      setCheckId: "game/setCheckId",
    }),
    toggleUserSegmentsVisible() {
      this.isPopupVisible = !this.isPopupVisible;
      this.markUserGameSegment(this.isPopupVisible);
    },
    handleCheckSegment(id) {
      this.toggleUserSegmentsVisible();
      this.setCheckId(id);
    },
    handleFend(coordinates) {
      this.$nuxt.$emit("fend-segment", coordinates);
    },
    handleSurrender(coordinates) {
      this.$nuxt.$emit("surrender-segment", coordinates);
    },
  },
};
</script>
<style lang="scss" scoped>
.btn {
  .badge {
    position: absolute;
    top: -0.625rem;
    right: -0.625rem;
    width: 1.5625rem;
    height: 1.5625rem;
    padding: 0;
    color: #fff;
    line-height: 1.5625rem;
  }
}

.side-card-selection {
  font-weight: 600;
  font-size: 0.7619rem;
  line-height: 1.1429rem;
  .text-small {
    margin-bottom: 0.2858rem !important;
    color: white;
    font-weight: 300;
    font-size: 0.5714rem !important;
    line-height: 144%;
    opacity: 0.6;
  }
}

.state {
  z-index: -2;
  width: 100%;
  padding: 0.8571rem 1.0477rem;
  background: #561212;
  border: 1px solid #ed2857;
  border-radius: 0.3125rem;

  &-message {
    font-weight: 600;
    font-size: 0.7619rem;
    line-height: 1.1429rem;
  }
}
.description-block {
  width: 77%;
  padding-top: 0.9524rem;
  padding-left: 0.9524rem;
}
</style>
