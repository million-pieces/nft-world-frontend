<template>
  <section class="main mx-auto">
    <div class="container-fluid">
      <div class="row justify-content-xl-between justify-content-center flex-xl-nowrap">
        <div class="col-xl-2 col-lg-12 col-md-9 col-sm-9 order-1 position-static">
          <button
            class="title-link-content w-100 border-0 d-xl-none"
            :class="{show: isDashboardMenuOpen}"
            @click="isDashboardMenuOpen = false"
          ></button>
          <div class="title-link" :class="{show: isDashboardMenuOpen}">
            <ul class="pl-0 mt-5">
              <li class="title-link-style">
                <nuxt-link to="#" class="text-nowrap text-gradient-primary mr-5">
                  <img :src="accountSetting" class="mr-4" />
                  Account
                </nuxt-link>
              </li>
              <!-- unimplemented functionality -->
              <!-- <li class="title-link-style">
                <nuxt-link to="#" class="title-link-color text-nowrap mr-5 disabled">
                  <DashboardIcon class="mr-4" />
                  Dashboard
                </nuxt-link>
              </li>
              <li class="title-link-style">
                <nuxt-link to="#" class="title-link-color text-nowrap mr-5 disabled">
                  <WalletIcon class="mr-4" />
                  Wallet
                </nuxt-link>
              </li>
              <li class="title-link-style">
                <nuxt-link to="#" class="title-link-color text-nowrap mr-5 disabled">
                  <TradeIcon class="mr-4" />
                  Trade
                </nuxt-link>
              </li>
              <li class="title-link-style">
                <nuxt-link to="#" class="title-link-color text-nowrap mr-5 disabled">
                  <SettingIcon class="mr-4" />
                  Settings
                </nuxt-link>
              </li> -->
            </ul>
          </div>
          <div class="mb-4 d-xl-none">
            <button
              class="border-0 bg-transparent d-flex align-items-center h-auto"
              type="button"
              @click="isDashboardMenuOpen = !isDashboardMenuOpen"
            >
              <div class="navbar-toggler mr-4" :class="{'navbar-toggler-active': isDashboardMenuOpen}">
                <span class="navbar-toggler-icon"></span>
                <span class="navbar-toggler-icon"></span>
                <span class="navbar-toggler-icon"></span>
              </div>
              <p class="mb-0">Account</p>
            </button>
          </div>
        </div>
        <div class="col-xl-6 col-lg-8 col-md-7 col-sm-9 order-lg-2 order-3 mt-5 mt-lg-0 ml-xl-auto">
          <div>
            <div class="card-header p-0">
              <ul class="nav nav-tabs">
                <li class="nav-item">
                  <nuxt-link
                    class="nav-link border-0 text-dark mr-2"
                    :class="{
                      'bg-dark-secondary': isForSaleVisible,
                      shadow: !isForSaleVisible,
                      'bg-white': !isForSaleVisible,
                    }"
                    data-toggle="tab"
                    to="/account"
                    @click.native="handleTab"
                  >
                    All
                  </nuxt-link>
                </li>
                <!-- unimplemented functionality -->
                <!-- <li class="nav-item">
                  <nuxt-link
                    class="nav-link border-0 text-dark disabled"
                    :class="{
                      'bg-dark-secondary': !isForSaleVisible,
                      shadow: isForSaleVisible,
                      'bg-white': isForSaleVisible,
                    }"
                    data-toggle="tab"
                    to="/account/forsale"
                    @click.native="handleTab"
                  >
                    For Sale
                  </nuxt-link>
                </li> -->
              </ul>
            </div>

            <div class="card-body top-block shadow border-top-0">
              <div class="text-right">
                <FilterIcon v-if="isFilterEnabled" class="mb-3 mr-4" />
              </div>
              <transition name="fade">
                <div v-if="isForSaleVisible" class="text-center padding-1 bg-primary-gradient rounded-lg">
                  <div class="bg-white p-5 rounded-lg">For Sale</div>
                </div>
                <div v-else-if="accounts.length" class="accounts-container">
                  <!-- Segment cards -->
                  <AccountCard
                    v-for="(account, index) in accounts"
                    :key="index"
                    :theme="'account-item'"
                    :country="account.country"
                    :country-image="account.countryImage"
                    :position-id="account.coordinate"
                    :price="account.price"
                    :disabled="true"
                    :is-owner="isEditable"
                  />
                  <button v-if="isAccountsMore" class="load-more-btn" @click="loadAccounts">Load more</button>
                </div>
                <p v-if="!accounts.length && !loading" class="disabled text-center">No tokens yet</p>
              </transition>
              <app-loader v-if="loading" class="d-flex align-items-center justify-content-center m-auto"></app-loader>
            </div>
          </div>
        </div>
        <!-- User info card -->
        <div class="col-xl-auto col-lg-4 col-md-7 col-sm-9 order-lg-3 order-2 pl-xl-4">
          <AppCard
            v-if="userDataToShow"
            :user="userDataToShow.user"
            :address="userDataToShow.address"
            :is-edit-available="isEditable"
            :socials="socials"
            class="bg-white"
          />
          <div v-else class="bg-white fake-card"></div>
        </div>
      </div>
    </div>
  </section>
</template>
<script>
// import DashboardIcon from "@/assets/images/icon/dashboard.svg?inline";
// import WalletIcon from "@/assets/images/icon/wallet.svg?inline";
// import TradeIcon from "@/assets/images/icon/trade.svg?inline";
import AccountSettingIcon from "@/assets/images/icon/account-setting.svg";
// import SettingIcon from "@/assets/images/icon/setting.svg?inline";
import FilterIcon from "@/assets/images/icon/filter-1.svg?inline";

import Facebook from "@/assets/images/icon/facebook-dark.svg";
import Instagram from "@/assets/images/icon/instagram-dark.svg";
import Twitter from "@/assets/images/icon/twitter-logo.svg";
import Discord from "@/assets/images/icon/discord-logo.svg";
import Telegram from "@/assets/images/icon/telegram.svg";

import user from "@/mixins/user";
import tokens from "@/mixins/tokens";

export default {
  components: {
    // DashboardIcon,
    // WalletIcon,
    // TradeIcon,
    // AccountSettingIcon,
    // SettingIcon,
    FilterIcon,
  },
  mixins: [user, tokens],
  layout: "pages",
  data() {
    return {
      isDashboardMenuOpen: false,
      accountSetting: AccountSettingIcon,
      userDataToShow: null,
      accounts: [],
      accountCardsLimit: 20,
      loading: true,
      userTokens: [],
      socials: [
        {
          link: "",
          icon: Facebook,
          title: "facebook",
        },
        {
          link: "",
          icon: Twitter,
          title: "twitter",
        },
        {
          link: "",
          icon: Instagram,
          title: "instagram",
        },
        {
          link: "",
          icon: Discord,
          title: "discord",
        },
        {
          link: "",
          icon: Telegram,
          title: "telegram",
        },
      ],
    };
  },
  computed: {
    isForSaleVisible() {
      return this.$route.path == "/account/forsale";
    },
    isFilterEnabled() {
      return false;
    },
    walletFromURL() {
      return this.$route.params.tab ? this.$route.params.tab.toString().toLowerCase() : null;
    },
    isEditable() {
      return this.walletFromURL === this.address?.toString().toLowerCase();
    },
    isAccountsMore() {
      return this.userTokens.length - this.accounts.length;
    },
  },
  watch: {
    signature(val) {
      if (this.userDataToShow) this.userDataToShow.signature = val;
    },
  },
  async mounted() {
    if (!this.walletFromURL) {
      if (this.address && this.user) {
        this.$router.push("/account/" + this.address);
        this.userDataToShow = await this.getUserData(this.address.toString().toLowerCase());
      } else {
        this.$router.push("/");
      }
    } else {
      this.userDataToShow = await this.getUserData(this.walletFromURL);
    }

    const graphResponse = await this.$axios.$post(process.env.GRAPH, {
      query: `
        {
          users(where: {id: "${this.walletFromURL}"}) {
            id
            claimablePiece
            tokens(first: 1000) {
              id
              claimablePiece
            }
          }
        }
      `,
    });

    try {
      this.userGraph = graphResponse.users[0];
      this.userTokens = this.userGraph.tokens;
      await this.loadAccounts();
      this.userDataToShow.user.totalSegments = this.userGraph.tokens.length;
      this.userDataToShow.user.claimablePiece = await this.getClaimablePieces();
      this.loading = false;
    } catch (e) {
      this.loading = false;
      console.log("Error during transferring user data", e);
    }
  },
  methods: {
    handleTab(e) {
      return e.target.getAttribute("href");
    },
    async getUserData(address) {
      let serverData;
      try {
        serverData = await this.$axios.$get(`${process.env.SERVER_URL}/user/${address}`);
      } catch (error) {
        try {
          await this.$axios.$post(`${process.env.SERVER_URL}/auth/eth`, {address: this.address, signature: this.signature});
          serverData = await this.$axios.$get(`${process.env.SERVER_URL}/user/${address}`);
        } catch (error) {
          console.error(error);
        }
      }
      return {
        address: address,
        user: {
          balance: await this.$web3()
            .eth.getBalance(address)
            .then((r) => this.$web3().utils.fromWei(r)),
          signature: this.signature,
          tokenBalance: 0,
          totalSegments: 0,
          claimablePiece: 0,
          segmentsForSale: 0,
          ...serverData,
        },
      };
    },
    returnSegmentData(id) {
      return this.tokens.find((el) => el.id == id);
    },
    async getImg(id) {
      let imgName = id;
      return `${process.env.SERVER_URL}/images/${imgName}.jpg`;
    },
    async loadAccounts() {
      const startIdx = this.accounts.length;
      let arrLength;

      if (this.accounts.length + this.accountCardsLimit <= this.userTokens.length) {
        arrLength = this.accountCardsLimit;
      } else {
        arrLength = this.userTokens.length - this.accounts.length;
      }

      const tokensSlice = this.userTokens.slice(startIdx, startIdx + arrLength);
      for (const el of tokensSlice) {
        const segmentData = this.returnSegmentData(el.id);
        const img = await this.getImg(segmentData.country);
        const claimablePiece = el.claimablePiece;
        this.accounts.push({
          country: segmentData.country,
          coordinate: segmentData.coordinates,
          countryImage: img,
          price: claimablePiece,
        });
      }
    },
    getClaimablePieces() {
      return this.$contracts
        .pieceBalance()
        .methods.balanceOf(this.walletFromURL)
        .call()
        .then((r) => Number(this.$web3().utils.fromWei(r)))
        .catch((err) => console.error(err));
    },
  },
};
</script>
<style src="./index.scss" lang="scss" scoped></style>
