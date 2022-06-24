export const state = () => {
  return {
    userSegments: [],
    refreshedSegments: [],
    simpleSegments: {},
    mergedSegments: {},
  };
};

export const actions = {
  addRefreshedSegment({commit}, segment) {
    commit("ADD_REFRESHED_SEGMENT", segment);
  },
  setUserSegments({commit}, val) {
    commit("SET_USER_SEGMENTS", val);
  },
  setSimpleSegmentsOwners({commit}, val) {
    const simpleSegments = new Object();

    val.forEach((segment) => {
      simpleSegments[segment.coordinates] = segment.owner.id;
    });

    commit("SET_SIMPLE_SEGMENTS_OWNERS", simpleSegments);
  },
  async setMergedSegmentsOwners(ctx, segments) {
    const mergedSegments = {};
    let values = segments;

    if (!Array.isArray(segments)) values = [segments];

    await values.forEach((segment) => {
      const owners = new Set();

      segment.coordinates.forEach((coordinates) => {
        owners.add(ctx.state.simpleSegments[coordinates]);
      });

      mergedSegments[segment.id] = {...segment, owners: Array.from(owners)};
    });

    ctx.commit("SET_MERGED_SEGMENTS_OWNERS", mergedSegments);
  },
  updateMergerInfo(ctx, merger) {
    const mergerData = {...ctx.state.mergedSegments[merger.id], ...merger};
    ctx.commit("UPDATE_MERGER_DATA", mergerData);
  },
};

export const mutations = {
  ADD_REFRESHED_SEGMENT(state, segment) {
    state.refreshedSegments.push(segment);
  },
  SET_USER_SEGMENTS(state, val) {
    state.userSegments = val;
  },
  SET_SIMPLE_SEGMENTS_OWNERS(state, val) {
    state.simpleSegments = {...state.simpleSegments, ...val};
  },
  SET_MERGED_SEGMENTS_OWNERS(state, val) {
    state.mergedSegments = {...state.mergedSegments, ...val};
  },
  UPDATE_MERGER_DATA(state, val) {
    state.mergedSegments[val.id] = val;
  },
};

export const getters = {
  getOwner: (state) => {
    return (id, type = "simple") => {
      let owners = new Array();
      if (type === "merger") {
        owners = state.mergedSegments[id].owners;
      } else {
        owners.push(state.simpleSegments[id]);
      }
      if ((owners.length && owners[0]) || !owners) return owners;
      return false;
    };
  },
  getRefreshedSegments: (state) => state.refreshedSegments,
  getUserSegments: (state) => state.userSegments,
  getMergedSegment: (state) => (id) => state.mergedSegments[id],
};
