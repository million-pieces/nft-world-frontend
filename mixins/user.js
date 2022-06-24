import {mapGetters, mapActions} from "vuex";

export default {
  computed: {
    ...mapGetters({
      address: "auth/address",
      signature: "auth/signature",
      user: "auth/user",
      isLoggedIn: "auth/isLoggedIn",
    }),
  },

  data() {
    return {
      subscription: null,
      requestConfig: null,
    };
  },

  methods: {
    ...mapActions({
      login: "auth/login",
      autoLogin: "auth/metamaskAutoLogin",
      logOut: "auth/logOut",
    }),

    subscribeToBlock() {
      if (this.subscription) {
        this.subscription.unsubscribe();
      }

      this.subscription = this.$web3()
        .eth.subscribe("newBlockHeaders", () => {
          if (this.address) {
            this.loadPlayer(this.address);
          }
        })
        .on("error", (e) => {
          this.subscribeToBlock();
          console.error(e);
        });
    },

    initGameRequesConfig() {
      this.requestConfig = {
        headers: {
          "Wallet-Address": this.address,
          Signature: this.signature,
        },
      };
    },
  },

  watch: {
    address(address) {
      if (address == null) {
        return;
      }
      this.initGameRequesConfig();
    },
  },

  async mounted() {
    this.initGameRequesConfig();
  },
  destroyed() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  },
};
