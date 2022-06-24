export const state = () => {
  return {
    blockPopup: false,
  };
};

export const actions = {
  blockPopup({commit}, bool) {
    commit("SET_DATA", bool);
  },
};

export const mutations = {
  SET_DATA(state, bool) {
    state.blockPopup = bool;
  },
  blockPopup(state, bool) {
    state.blockPopup = bool;
  },
};

export const getters = {
  isPopupBlock: (state) => state.blockPopup,
};
