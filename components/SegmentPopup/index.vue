<template>
  <div id="popup" :class="{active: isPopupVisible}" class="popup selection game-segment-popup">
    <div ref="triangle" class="triangle"></div>

    <button v-if="isPopupBlock" class="popup__close" @click="unblockPopup">
      <Close />
    </button>

    <SegmentPopupGame v-if="isGamePage" :segment="segment" :owner-data="ownerData" :attacker-data="attackerData" :move-popup="movePopup" />

    <SegmentPopupMap v-else :segment="segment" :owner-data="ownerData" :segment-data="segmentData" :move-popup="movePopup" />
  </div>
</template>
<script>
import Close from "@/assets/images/icon/close.svg?inline";
import SEGMENTS from "@/constants/segments";

import {mapGetters, mapActions} from "vuex";

import segmentPopup from "@/mixins/segmentPopup.js";
import user from "@/mixins/user.js";

export default {
  components: {
    Close,
  },

  mixins: [segmentPopup, user],

  data() {
    return {
      id: null,
      cancelRequest: null,
      img: null,
      popupTimeout: null,
      ownerData: null,
      segmentData: "",
      segmentType: "simple",
      isSegmentWithCustomImage: false,
      owner: null,
      isWinnerSegment: false,
      attackedBy: null,
      attackerData: null,
    };
  },
  computed: {
    ...mapGetters({
      isPopupBlock: "segmentPopupState/isPopupBlock",
      countryMode: "worldMap/getCountryMode",
      refreshedSegments: "soldSegments/getRefreshedSegments",
    }),
    segment() {
      let segment = SEGMENTS.filter(({positionId}) => positionId === this.id)[0] || {};
      return {
        ...segment,
        img: this.img,
        type: this.segmentType,
        isSegmentWithCustomImage: this.isSegmentWithCustomImage,
        attackedBy: this.attackedBy,
      };
    },
    isGamePage() {
      return this.$route.path === "/game";
    },
  },

  watch: {
    isPopupBlock(val) {
      if (val === false) this.isPopupVisible = false;
    },

    // get owner segment data
    async owner(data) {
      if (data == null) {
        return false;
      }
      if (!data) {
        return false;
      }

      try {
        this.ownerData = await this.$axios.$get(`${process.env.SERVER_URL}/user/${data.id ? data.id : data}`);
      } catch (error) {
        console.error(error);
      }
    },
    // get attacker data on game segment
    async attackedBy(data) {
      if (data == null || !data) {
        return false;
      }
      try {
        this.attackerData = await this.$axios.$get(`${process.env.SERVER_URL}/user/${data}`);
      } catch (error) {
        console.error(error);
      }
    },
    address() {
      clearTimeout(this.popupTimeout);
      this.clearPopupData();
    },
  },

  mounted() {
    this.$nuxt.$on("segment-unhover", () => {
      if (!this.isPopupBlock) {
        clearTimeout(this.popupTimeout);
        this.clearPopupData();
      }
    });
    this.$nuxt.$on("segment-hover", async (data, container) => {
      if (container.segment.id == null || this.isPopupBlock) return false;

      clearTimeout(this.popupTimeout);
      this.showPopup(data, container);
    });
  },
  destroyed() {
    this.$nuxt.$off("segment-unhover");
    this.$nuxt.$off("segment-hover");
  },
  updated() {
    if (this.id) this.movePopup(this.id);
  },
  methods: {
    ...mapActions({
      blockPopup: "segmentPopupState/blockPopup",
    }),
    clearPopupData() {
      this.owner = null;
      this.img = null;
      this.ownerData = null;
      this.segmentData = "";
      this.id = null;
      this.attackedBy = null;
      this.isPopupVisible = false;
      this.segmentType = "simple";
    },
    unblockPopup() {
      this.blockPopup(false);
    },
  },
};
</script>

<style src="./index.scss" lang="scss" scoped></style>
