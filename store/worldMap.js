export const state = () => ({
  data: {
    continents: [],
    countries: [],
    bigCities: [],
  },
  countryMode: false,
  isUserSegmentsVisible: false,
  isInitData: false,
  isBlurred: false,
  segmentsToMerge: null,
  isMergedSegmentsRefreshed: false,
  unmergeSegment: null,
  mergedImgRefreshData: null,
  segmentImgRefreshed: null,
  filterValue: null,
  mergedRefreshData: null,
  mapLoader: false,
  isMapLoaded: false,
});
export const actions = {
  worldMapLoaded({commit}, bool) {
    commit("SET_MAP_LOADED", bool);
  },
  setMapLoader({commit}, bool) {
    commit("SET_MAP_LOADER", bool);
  },
  changeUserSegmentsVisible({commit}, val) {
    commit("CHANGE_USER_SEGMENTS_VISIBLE", val);
  },
  changeCountryMode({commit}, val) {
    commit("CHANGE_COUNTRY_MODE", val);
  },
  setData({commit}, val) {
    commit("SET_DATA", val);
  },
  setSegmentsToMerge({commit}, val) {
    commit("SET_SEGMENTS_TO_MERGE", val);
  },
  mergedSegmentsRefresh({commit}) {
    commit("SET_IS_MERGED_SEGMENTS_REFRESHED");
  },
  setUnmergeSegmentRefresh({commit}, val) {
    commit("SET_IS_UNMERGE_SEGMENT", val);
  },
  setMergedImgData({commit}, val) {
    commit("SET_MERGED_IMG_DATA", val);
  },
  setSegmentImgRefresh({commit}, val) {
    commit("SET_SEGMENT_IMG_REFRESHED", val);
  },
  setMergedSegmentsData({commit}, data) {
    commit("MERGED_REFRESH_DATA", data);
  },
  setMapIsBlurred({commit}, val) {
    commit("SET_MAP_IS_BLURRED", val);
  },
  setIsInitData({commit}, val) {
    commit("SET_IS_INIT_DATA", val);
  },
  setFilterValue({commit}, val) {
    commit("SET_FILTER_VALUE", val);
  },
};
export const mutations = {
  SET_MAP_LOADED(state, bool) {
    state.isMapLoaded = bool;
  },
  SET_MAP_LOADER(state, bool) {
    state.mapLoader = bool;
  },
  MERGED_REFRESH_DATA(state, data) {
    state.mergedRefreshData = data;
  },
  CHANGE_USER_SEGMENTS_VISIBLE(state, val) {
    state.isUserSegmentsVisible = val;
  },
  CHANGE_COUNTRY_MODE(state, val) {
    state.countryMode = val;
  },
  SET_DATA(state, data) {
    state.data = data;
  },
  SET_IS_MERGED_SEGMENTS_REFRESHED(state) {
    state.isMergedSegmentsRefreshed = !state.isMergedSegmentsRefreshed;
  },
  SET_IS_UNMERGE_SEGMENT(state, val) {
    state.unmergeSegment = val;
  },
  SET_MERGED_IMG_DATA(state, data) {
    state.mergedImgRefreshData = data;
  },
  SET_SEGMENT_IMG_REFRESHED(state, data) {
    state.segmentImgRefreshed = data;
  },
  SET_SEGMENTS_TO_MERGE(state, val) {
    state.segmentsToMerge = val;
  },
  SET_MAP_IS_BLURRED(state, bool) {
    state.isBlurred = bool;
  },
  SET_IS_INIT_DATA(state, bool) {
    state.isInitData = bool;
  },
  SET_FILTER_VALUE(state, value) {
    state.filterValue = value;
  },
};

export const getters = {
  data: (state) => state.data,
  getValuesByString: (state) => (string) => {
    if (!string) {
      return "";
    }

    let result = [];

    for (const arr in state.data) {
      state.data[arr].forEach((element) => {
        element.toUpperCase().includes(string.toUpperCase()) && result.push(element);
      });
    }

    return result;
  },
  getIsMapLoaded: (state) => state.isMapLoaded,
  getMapLoader: (state) => state.mapLoader,
  getMergedRefreshData: (state) => state.mergedRefreshData,
  getMergedImgRefreshData: (state) => state.mergedImgRefreshData,
  getSegmentImgRefreshed: (state) => state.segmentImgRefreshed,
  getCountryMode: (state) => state.countryMode,
  getIsRefreshedMerge: (state) => state.isMergedSegmentsRefreshed,
  getUnmergeSegment: (state) => state.unmergeSegment,
  getSegmentsToMerge: (state) => state.segmentsToMerge,
  getIsUserSegmentsVisible: (state) => state.isUserSegmentsVisible,
  getIsCountryMode: (state) => state.countryMode,
  getIsInitData: (state) => state.isInitData,
  getIsFilter: (state) => state.isBlurred,
  getFilterValue: (state) => state.filterValue,
  getData: (state) => state.data,
};
