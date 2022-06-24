import SEGMENTS from "@/constants/segments";

export const state = () => ({
  isJoinedTheGame: false,
  gameMapLoading: false,
  userGameData: {
    balance: 0,
    color: "",
    segments: [],
  },
  isMarkedUserGameSegments: false,
  checkId: null,
});
export const actions = {
  setCheckId({commit}, val) {
    commit("SET_CHECK_ID", val);
  },
  addNewUserSegment({commit}, data) {
    commit("ADD_NEW_USER_SEGMENT", data);
  },
  removeUserSegment({commit}, coordinate) {
    commit("REMOVE_USER_SEGMENT", coordinate);
  },
  markUserGameSegment({commit}, data) {
    commit("MARK_USER_GAME_SEGMENT", data);
  },
  setNewUserAttackedSegment({commit}, data) {
    commit("SET_NEW_USER_ATTACKED_SEGMENT", data);
  },
  setNewUserFendedSegment({commit}, data) {
    commit("SET_NEW_USER_FENDED_SEGMENT", data);
  },
  setGameMapLoading({commit}, bool) {
    commit("SET_GAME_MAP_LOADING", bool);
  },
  setIsTheGame({commit}, bool) {
    commit("SET_IS_JOIN_THE_GAME", bool);
  },
  setUserGameData({commit}, data) {
    if (data) {
      commit("SET_USER_GAME_DATA", data);
    } else {
      commit("CLEAR_USER_GAME_DATA");
    }
  },
  updateUserGameBalance({commit}, val) {
    commit("UPDATE_USER_GAME_BALANCE", val);
  },
};
export const mutations = {
  SET_CHECK_ID(state, val) {
    state.checkId = val;
  },
  SET_GAME_MAP_LOADING(state, bool) {
    state.gameMapLoading = bool;
  },
  SET_IS_JOIN_THE_GAME(state, bool) {
    state.isJoinedTheGame = bool;
  },
  SET_USER_GAME_DATA(state, data) {
    state.userGameData = data;
  },
  CLEAR_USER_GAME_DATA(state) {
    //set default values
    state.userGameData = {
      balance: 0,
      color: "",
      segments: [],
    };
  },
  UPDATE_USER_GAME_BALANCE(state, val) {
    state.userGameData.balance = val;
  },
  ADD_NEW_USER_SEGMENT(state, data) {
    state.userGameData.segments.push({
      id: data.id,
      coordinate: data.coordinate,
      color: data.newColor,
      owner: data.newOwner,
    });
  },
  REMOVE_USER_SEGMENT(state, coordinate) {
    const userSegments = state.userGameData.segments.filter((segment) => segment.coordinate !== coordinate);
    state.userGameData.segments = [...userSegments];
  },
  MARK_USER_GAME_SEGMENT(state, bool) {
    state.isMarkedUserGameSegments = bool;
  },
  SET_NEW_USER_ATTACKED_SEGMENT(state, data) {
    let newUserGameSegments = state.userGameData.segments.map((segment) => {
      let newSegment = segment;
      if (newSegment.id === data.segmentId) {
        newSegment.attackedBy = data.initiator;
        newSegment.attackedTill = data.attackedTill;
      }
      return newSegment;
    });
    state.userGameData.segments = [...newUserGameSegments];
  },
  SET_NEW_USER_FENDED_SEGMENT(state, data) {
    let newUserGameSegments = state.userGameData.segments.map((segment) => {
      let newSegment = segment;
      if (newSegment.id === data.id) {
        newSegment.attackedBy = false;
        newSegment.attackedTill = false;
      }
      return newSegment;
    });
    state.userGameData.segments = [...newUserGameSegments];
  },
};

export const getters = {
  getIsMapLoading: (state) => state.gameMapLoading,
  getIsJoinedTheGame: (state) => state.isJoinedTheGame,
  getAttackedUserSegmentsData: (state) => state.userGameData.segments.filter((segment) => segment?.attackedBy),
  getIsMarkedUserGameSegments: (state) => state.isMarkedUserGameSegments,
  getCheckId: (state) => state.checkId,
  getUserGameSegments: (state) => {
    let normalizedSegments = [];
    state.userGameData.segments.forEach((segment) => {
      let constantSegment = SEGMENTS.find((baseSegment) => baseSegment.id === segment.id);
      let imgName = constantSegment.country;
      let imgUrl = `${process.env.SERVER_URL}/images/${imgName}.jpg`;
      let normalizedSegment = {...constantSegment, countryImg: imgUrl, attackedBy: segment.attackedBy, attackedTill: segment.attackedTill};
      normalizedSegments.push(normalizedSegment);
    });
    normalizedSegments.sort((item) => (item?.attackedBy ? -1 : 1));
    return normalizedSegments;
  },
  getUserGameBalance: (state) => {
    let balance = state.userGameData.balance;
    let normalizedBalance = "";
    if (balance < 1000) {
      //convert to "0000" format
      balance = `${balance}`;
      normalizedBalance = "0".repeat(4 - balance.length) + balance;
    } else {
      normalizedBalance = `${balance}`;
    }
    return normalizedBalance;
  },
};
