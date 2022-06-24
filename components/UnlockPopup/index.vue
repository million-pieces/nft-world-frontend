<template>
  <transition name="fade">
    <div v-if="isOpenUnlockPopup">
      <div class="modal fade unlock-modal" :class="{show: isOpenUnlockPopup}" @click.self="closeUnlockPopup">
        <div class="modal-dialog px-2">
          <div class="modal-content modal-unlock">
            <div class="modal-header modal-header text-center">
              <h4 class="modal-title mx-auto pt-2">Connect Wallet</h4>
              <button type="button" class="close" @click="closeUnlockPopup">
                <CloseIcon />
              </button>
            </div>
            <div class="modal-body table-responsive ever-mask h-auto">
              <div class="table">
                <button
                  :class="[isLoading ? 'disabled' : '']"
                  class="btn d-flex align-items-center flex-row unlock-wallet"
                  type="button"
                  @click="handleSelect('walletconnect')"
                >
                  <img src="~assets/images/twt.svg" width="33" class="mr-3 mr-sm-4" />
                  <span> Trust Wallet </span>
                </button>
              </div>
              <div class="table">
                <button
                  :class="[isLoading ? 'disabled' : '']"
                  class="btn d-flex align-items-center flex-row unlock-wallet"
                  type="button"
                  @click="handleSelect('injected')"
                >
                  <img src="~assets/images/metamask.svg" width="33" class="mr-3 mr-sm-4" />
                  <span> MetaMask </span>
                </button>
              </div>
              <div class="table">
                <button
                  :class="[isLoading ? 'disabled' : '']"
                  class="btn d-flex align-items-center flex-row unlock-wallet"
                  type="button"
                  @click="handleSelect('walletconnect')"
                >
                  <img src="~assets/images/connect.svg" width="33" class="mr-3 mr-sm-4" />
                  <span> WalletConnect </span>
                </button>
              </div>
              <div class="table">
                <button
                  :class="[isLoading ? 'disabled' : '']"
                  class="btn d-flex align-items-center flex-row unlock-wallet"
                  type="button"
                  @click="handleSelect('walletlink')"
                >
                  <img src="~assets/images/coinbase.png" width="33" class="mr-3 mr-sm-4" />
                  <span> Coinbase Wallet </span>
                </button>
              </div>
              <div class="table">
                <button
                  :class="[isLoading ? 'disabled' : '']"
                  class="btn d-flex align-items-center flex-row unlock-wallet"
                  type="button"
                  @click="handleSelect('fortmatic')"
                >
                  <img src="~assets/images/formatic.svg" width="33" class="mr-3 mr-sm-4" />
                  <span> Formatic </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import CloseIcon from "@/assets/images/icon/close.svg?inline";
import {mapActions} from "vuex";

export default {
  components: {
    CloseIcon,
  },

  data() {
    return {
      isLoading: false,
      isOpenUnlockPopup: false,
    };
  },
  mounted() {
    this.$nuxt.$on("openUnlockPopup", () => this.openUnlockPopup());
  },
  destroyed() {
    this.$nuxt.$off("openUnlockPopup");
  },
  methods: {
    ...mapActions({
      login: "auth/login",
      blockPopup: "segmentPopupState/blockPopup",
    }),
    openUnlockPopup() {
      this.isOpenUnlockPopup = true;
    },
    closeUnlockPopup() {
      this.isOpenUnlockPopup = false;
    },

    async handleSelect(provider) {
      this.isLoading = true;
      try {
        await this.$localForage.setItem("provider", provider);
        await this.$setWeb3Provider(provider);
        await this.login();
      } catch (err) {
        console.error(err);
      } finally {
        this.isLoading = false;
        this.blockPopup(false);
        this.closeUnlockPopup();
      }
    },
  },
};
</script>

<style src="./index.scss" lang="scss" scoped></style>
