<template>
  <div class="ml-lg-3">
    <!-- User Segments button  -->
    <button class="btn btn-border-primary-gradient btn-default text-white text-nowrap" @click="toggleUserSegmentsVisible">
      My Segments
    </button>
    <!-- Side card -->
    <div class="side-card-selection" :class="isPopupVisible ? 'visible' : ''">
      <button class="button-close p-0 border-0 bg-transparent" @click="toggleUserSegmentsVisible">
        <IconClose />
      </button>

      <div class="side-card-selection__header text-white d-flex justify-content-between">
        <h4 class="mb-0">Your {{ isOwner ? "segments" : "residents" }}</h4>
      </div>
      <!-- Personal stats section -->
      <EraSideCardStats :is-owner="isOwner" :user-game-data="userGameData" class="side-card-selection__stats" />
      <EraSideCardList :is-owner="isOwner" :segments="userGameData.segments" />
    </div>
  </div>
</template>
<script>
import IconClose from "@/assets/images/icon/white-close.svg?inline";

import user from "@/mixins/user";
import sidebar from "@/mixins/sidebar.js";

import {mapActions, mapGetters} from "vuex";

export default {
  components: {
    IconClose,
  },
  mixins: [user, sidebar],
  data() {
    return {
      isPopupVisible: false,
      isDropdownActive: false,
    };
  },
  computed: {
    ...mapGetters({
      address: "auth/address",
      userGameData: "era/getUserGameData",
    }),
    isOwner() {
      return this.userGameData.role === "OWNER";
    },
  },
  beforeDestroy() {
    this.$nuxt.$off("segment-click");
  },
  methods: {
    ...mapActions({
      markUserGameSegment: "era/markUserGameSegment",
    }),
    toggleUserSegmentsVisible() {
      this.isPopupVisible = !this.isPopupVisible;
      this.markUserGameSegment(this.isPopupVisible);
    },
  },
};
</script>
<style lang="scss" scoped>
.side-card-selection {
  padding: 1.9048rem 5.2381rem 1.9048rem 1.9048rem;
  font-weight: 600;
  font-size: 0.7619rem;
  line-height: 1.1429rem;
  text-align: left;
  background-color: $game-bg_color;
  border-top-left-radius: 0;
  &__header {
    margin-bottom: 1.7143rem;
  }
  &__stats {
    margin-bottom: 2.2857rem;
  }
}
.button-close {
  position: absolute;
  top: 2.2381rem;
  right: 4.0476rem;
}
</style>
