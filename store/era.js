export const state = () => ({
  isJoinedTheGame: false,
  gameMapLoading: false,
  userGameData: {
    // game/user end point
    id: null,
    balance: 0,
    color: null,
    role: null,
    // game/segments end point
    segments: [],
    citizensAmount: null,
    uniqueSegmentsAmount: null,
    unclaimedReward: null,
    yearlyReward: null,
  },
  isMarkedUserGameSegments: false,
  checkId: null,
  roles: [
    "CITIZEN", //0
    "OWNER", //1
  ],
});
export const actions = {
  setGameMapLoading({commit}, bool) {
    commit("SET_GAME_MAP_LOADING", bool);
  },
  setIsTheGame({commit}, bool) {
    commit("SET_IS_JOIN_THE_GAME", bool);
  },
  markUserGameSegment({commit}, data) {
    commit("MARK_USER_GAME_SEGMENT", data);
  },
  setUserGameData({commit}, data) {
    if (data) {
      commit("SET_USER_GAME_DATA", data);
    } else {
      commit("CLEAR_USER_GAME_DATA");
    }
  },
};
export const mutations = {
  SET_GAME_MAP_LOADING(state, bool) {
    state.gameMapLoading = bool;
  },
  SET_IS_JOIN_THE_GAME(state, bool) {
    state.isJoinedTheGame = bool;
  },
  MARK_USER_GAME_SEGMENT(state, bool) {
    state.isMarkedUserGameSegments = bool;
  },
  SET_USER_GAME_DATA(state, data) {
    let normalizedRole = state.roles[data.role];
    state.userGameData = {...data, role: normalizedRole};
  },
  CLEAR_USER_GAME_DATA(state) {
    //set default values
    state.userGameData = {
      id: null,
      balance: 0,
      color: null,
      role: null,
      // game/segments end point
      segments: [],
      citizensAmount: null,
      uniqueSegmentsAmount: null,
      unclaimedReward: null,
      yearlyReward: null,
    };
  },
};

export const getters = {
  getUserRole: (state) => state.userGameData.role,
  getIsMapLoading: (state) => state.gameMapLoading,
  getIsJoinedTheGame: (state) => state.isJoinedTheGame,
  getIsMarkedUserGameSegments: (state) => state.isMarkedUserGameSegments,
  getUserGameData: (state) => state.userGameData,
  getUserGameSegments: (state) => state.userGameData.segments,
  getUserGameBalance: (state) => {
    let balance = state.userGameData.balance;
    let normalizedBalance = "";
    if (balance < 1000) {
      //convert to "0000" format
      balance = `${balance}`;
      normalizedBalance = "0".repeat(4 - balance?.length) + balance;
    } else {
      normalizedBalance = `${balance}`;
    }
    return normalizedBalance;
  },
};
