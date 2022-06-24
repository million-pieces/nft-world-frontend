export default {
  methods: {
    //------WEB-SOCKET-LISTENERS------

    addGameWebSocketEvents() {
      if (this.address == null) {
        return;
      }
      this.gameSocketsConnect();
      this.mapStateListener();
      this.addAttackListener();
      this.addDefendListener();
      this.addBalanceListener();
      this.addSystemListener();
    },

    gameSocketsConnect() {
      if (this.socket !== null) {
        this.socket.disconnect();
      }
      this.socket = this.$nuxtSocket({
        name: "connect",
      });
      this.socket.emit("connect-game", {
        walletAddress: this.address,
        signature: this.signature,
      });
    },
    userSegmentIsTaken(data) {
      const lostSegment = this.userGameSegments.find((segment) => data.coordinate === segment.coordinates);
      if (lostSegment) {
        this.showUserLostSegmentAlert(lostSegment.coordinates);
        this.removeUserSegment(lostSegment.coordinates);
      }
    },
    mapStateListener() {
      this.socket.on("map_state", (newSegmentOwnerState) => {
        if (newSegmentOwnerState.newOwner === this.address) {
          this.addNewUserSegment(newSegmentOwnerState);
        } else {
          this.userSegmentIsTaken(newSegmentOwnerState);
        }
        this.newSegmentOwner = newSegmentOwnerState;
        this.isNewGameOwnerAdded = true;
      });
    },
    addAttackListener() {
      this.socket.on("attacks", (newSegmentAttackState) => {
        if (newSegmentAttackState.defender === this.address) {
          this.setNewUserAttackedSegment(newSegmentAttackState);
          this.showUserSegmentAttackAlert(newSegmentAttackState);
        }
        this.newAttackedSegment = newSegmentAttackState;
        this.isNewSegmentAttacked = true;
      });
    },
    addDefendListener() {
      this.socket.on("defend", (defendedSegmentData) => {
        if (defendedSegmentData.owner === this.address) {
          this.setNewUserFendedSegment(defendedSegmentData);
        } else if (defendedSegmentData.attacker === this.address) {
          this.showUserAttackDefendedAlert(defendedSegmentData);
        }
        this.newFendedSegment = defendedSegmentData;
        this.isNewSegmentFended = true;
      });
    },
    addBalanceListener() {
      this.socket.on("income", (newBalanceData) => {
        this.updateUserGameBalance(newBalanceData.balance);
      });
    },
    addSystemListener() {
      this.socket.on("system_messages", (message) => {
        console.log(message);
      });
    },
  },
};
