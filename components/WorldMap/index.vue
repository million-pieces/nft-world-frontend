<template>
  <div id="main-map-container" ref="mapContainer" class="connections main-map-container" @wheel.prevent="scaleMap">
    <canvas id="main-world-map"></canvas>
  </div>
</template>

<script>
import drawWoldMap from "@/mixins/drawWoldMap.js";
import normalizeMergedSegments from "@/mixins/normalizeMergedSegments.js";
import mapDefaultValues from "@/mixins/mapDefaultValues.js";
import calculateMergedSegmentSides from "@/mixins/calculateMergedSegmentSides.js";

import {mapGetters, mapActions} from "vuex";

export default {
  mixins: [drawWoldMap, normalizeMergedSegments, mapDefaultValues, calculateMergedSegmentSides],
  props: {
    worldMap: {
      type: Array,
      default: () => [],
    },
    formattedMergedSegments: {
      type: Array,
      default: () => [],
    },
    isMapDataReady: {
      type: Boolean,
      require: true,
    },
  },

  data() {
    return {
      viewContainer: {},
      isPopupActive: true,
      isToggledCountryMode: false,
      isToggledUserSegments: false,
      isToggledValidMerge: false,
      isToggledMergedRefresh: false,
      isToggledUnMergedRefresh: false,
      isToggledMergedImgRefresh: false,
      isToggledSegmentImgRefresh: false,
      rerenderMap: false,
      isShowUserSegments: false,
      worldEvents: null,
      isValidMerge: false,
    };
  },
  computed: {
    ...mapGetters({
      userSegments: "soldSegments/getUserSegments",
      getMergedSegment: "soldSegments/getMergedSegment",
      segmentsToMerge: "worldMap/getSegmentsToMerge",
      isUserSegmentsVisible: "worldMap/getIsUserSegmentsVisible",
      isCountryMode: "worldMap/getIsCountryMode",
      isInitData: "worldMap/getIsInitData",
      isFilter: "worldMap/getIsFilter",
      filterValue: "worldMap/getFilterValue",
      isRefreshedMerge: "worldMap/getIsRefreshedMerge",
      unmergeSegment: "worldMap/getUnmergeSegment",
      getMergedImgRefreshData: "worldMap/getMergedImgRefreshData",
      getSegmentImgRefreshed: "worldMap/getSegmentImgRefreshed",
      getMergedRefreshData: "worldMap/getMergedRefreshData",
    }),
  },
  watch: {
    isUserSegmentsVisible(newValue, oldValue) {
      if (newValue === oldValue) {
        return;
      }
      this.isToggledUserSegments = true;
    },
    isCountryMode(newValue, oldValue) {
      if (newValue === oldValue) {
        return;
      }
      this.rerenderMap = true;
      this.isToggledCountryMode = !this.isToggledCountryMode;
    },
    isRefreshedMerge(newValue, oldValue) {
      if (newValue === oldValue) {
        return;
      }
      this.isToggledMergedRefresh = true;
    },
    unmergeSegment() {
      this.isToggledUnMergedRefresh = true;
    },
    getMergedImgRefreshData() {
      this.isToggledMergedImgRefresh = true;
    },

    getSegmentImgRefreshed() {
      this.isToggledSegmentImgRefresh = true;
    },
    //Main map render while data ready
    worldMap() {
      if (this.isMapDataReady === false) {
        return;
      }
      this.drawWorldMapOnReady();
    },
  },

  async mounted() {
    this.setMapLoader(true);
    this.worldMapLoaded(false);
    this.addEventListeners();
    this.$nuxt.$on("map-reset", this.resetMap);
    this.$nuxt.$on("merge-validate", (bool) => {
      this.isValidMerge = bool;
      this.isToggledValidMerge = true;
    });
  },
  destroyed() {
    this.isDestroyMap = true;
    this.removeEventListeners();
    this.$nuxt.$off("map-reset");
    this.$nuxt.$off("merge-validate");
  },
  methods: {
    ...mapActions({
      changeUserSegmentsVisible: "worldMap/changeUserSegmentsVisible",
      changeCountryMode: "worldMap/changeCountryMode",
      setData: "worldMap/setData",
      setMapIsBlurred: "worldMap/setMapIsBlurred",
      setIsInitData: "worldMap/setIsInitData",
      mergedSegmentsRefresh: "worldMap/mergedSegmentsRefresh",
      setMapLoader: "worldMap/setMapLoader",
      worldMapLoaded: "worldMap/worldMapLoaded",
      blockPopup: "segmentPopupState/blockPopup",
    }),

    drawWorldMapOnReady() {
      this.drawWoldMap();
      this.setMapLoader(false);
      this.worldMapLoaded(true);
    },

    disableBlurMap() {
      this.setMapIsBlurred(false);
    },
  },
};
</script>

<style>
.main-map-container {
  width: 100%;
  height: 100%;
  overflow: hidden;
}
</style>
