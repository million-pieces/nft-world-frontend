export const state = () => {
  return {
    address: null,
    signature: "",
    isLoggedIn: false,
    isConnected: false,
    addressChangeSubscribe: false,
    user: {
      signature: null,
      balance: 0,
      claimableTokens: 0,
      totalSegments: 0,
      segmentsForSale: 0,
    },
  };
};

export const actions = {
  async login({commit, state}) {
    let addresses = [];
    let address = null;
    let balance = null;

    // clear old data
    this.$localForage.setItem("eth_signature", null);
    this.$localForage.setItem("eth_address", null);
    this.$localForage.setItem("provider", null);
    commit("LOGIN", {address: null, balance: null, signature: null});

    const auth = async () => {
      if (this.$ethereum()) {
        // switch network to env
        await this.$switchChainId();
        if (this.$ethereum().enable) {
          addresses = await this.$ethereum().enable();
        } else if (this.$ethereum().request) {
          addresses = await this.$ethereum().request({
            method: "eth_requestAccounts",
          });
        } else if (this.$web3().requestAccounts) {
          addresses = await this.$web3().requestAccounts();
        }
      }
      if (this.$web3()) {
        if (!addresses.length) {
          addresses = await this.$web3().eth.getAccounts();
        }

        address = (this.$ethereum()?.selectedAddress || addresses[0]).toLowerCase();

        if (!address) {
          throw new Error("NO_WEB3");
        }

        balance = this.$web3().utils.fromWei(await this.$web3().eth.getBalance(address), "ether");

        let signature = await this.$web3().eth.personal.sign(this.$web3().utils.fromUtf8("Million Pieces"), address, "");

        this.$localForage.setItem("eth_signature", signature);
        this.$localForage.setItem("eth_address", address);

        let networkId = await this.$web3().eth.net.getId();
        try {
          await this.$alertIfIncorrectNetwork(networkId);
          await this.$axios.$post(`${process.env.SERVER_URL}/auth/eth`, {address, signature});
        } catch (error) {
          console.error(error);
        }
        commit("LOGIN", {address, balance, signature});
      }
    };

    const accountSwitchSubscribe = () => {
      if (this.$ethereum() && !state.addressChangeSubscribe) {
        this.$ethereum().on("accountsChanged", auth);
        commit("SET_CHAIN_CHANGE_SUBSCRIBE");
      }
    };

    await auth();

    accountSwitchSubscribe();

    return {address, balance};
  },

  async metamaskAutoLogin({commit, state, dispatch}) {
    const provider = await this.$localForage.getItem("provider");
    if (provider) await this.$setWeb3Provider(provider);
    if (provider === "injected") {
      if (!this.$ethereum().isConnected()) return;
    }

    const address = await this.$localForage.getItem("eth_address");
    const signature = await this.$localForage.getItem("eth_signature");
    const balance = this.$web3().utils.fromWei(await this.$web3().eth.getBalance(address), "ether");

    // if (!address || !signature) {
    //   return false;
    // }

    if (!state.addressChangeSubscribe) {
      this.$ethereum()?.on("accountsChanged", () => dispatch("login"));
      commit("SET_CHAIN_CHANGE_SUBSCRIBE");
    }

    await this.$switchChainId();

    commit("LOGIN", {address, balance, signature});
  },

  async logOut({commit}) {
    this.$localForage.setItem("eth_signature", null);
    this.$localForage.setItem("eth_address", null);
    this.$localForage.setItem("provider", null);
    commit("LOGIN", {address: null, balance: null, signature: null});
  },
};

export const mutations = {
  LOGIN(state, {address, signature}) {
    if (address === state.address) {
      return;
    }

    state.signature = signature || "";
    state.address = address || "";
    state.isLoggedIn = true;
  },

  SET_CONNECTED(state, isConnected = true) {
    state.isConnected = isConnected;
  },

  SET_CHAIN_CHANGE_SUBSCRIBE(state) {
    state.addressChangeSubscribe = true;
  },
};

export const getters = {
  address: ({address}) => address,
  signature: ({signature}) => signature,
  user: ({user}) => user,
  isLoggedIn: ({isLoggedIn}) => isLoggedIn,
  isConnected: ({isConnected}) => isConnected,
};
