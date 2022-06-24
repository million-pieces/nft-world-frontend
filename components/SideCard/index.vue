<template>
  <div class="ml-lg-3">
    <!-- Toggle side card button -->
    <button class="image-content-box cart-trigger" @click="isPopupVisible = !isPopupVisible">
      <img :src="isPopupVisible ? cartDarkIcon : cartIcon" alt="" />
      <!-- items in basket -->
      <div v-show="items.length" class="badge bg-primary-gradient">
        {{ items.length }}
      </div>
    </button>
    <!-- Sidecard -->
    <div class="side-card-selection bg-dark p-4" :class="isPopupVisible ? 'visible' : ''">
      <div class="text-white d-flex justify-content-between">
        {{ mergeMode ? "Manage your segments" : "Your Selections" }}
        <button class="p-0 border-0 bg-transparent" @click="sideCardClose">
          <IconClose />
        </button>
      </div>
      <p v-if="!mergeMode" class="text-white opacity-3 text-small text-left">
        *You can purchase up to 25 available Segments in one transaction
      </p>
      <div v-if="items.length > 1 && !mergeMode" class="mx-auto w-50">
        <div class="bg-primary-gradient mb-3 rounded padding-1 m-2 mt-4">
          <button
            type="button"
            class="btn border-0 text-white text-middle w-100 px-0"
            @click="buy(segmentIds)"
            v-text="!address ? 'Connect' : `Buy All for ${(items.length * segmentPrice).toFixed(2)} Ξ`"
          />
        </div>
      </div>
      <!-- User segment -->
      <div v-if="mergeMode">
        <AccountCard
          v-for="item in mergeItems"
          :key="item.nft_id"
          :merged-segment-id="item.mergedSegmentId"
          :image-name="item.imageName"
          :theme="'merge-item'"
          :country="item.country"
          :country-image="item.countryImage"
          :position-id="item.positionId"
          :price="item.price"
          :segment-type="item.type"
          :is-owner="true"
          :disabled="true"
          @unmerge-segment="requestUnmerge"
        />
      </div>
      <!-- Basket segment -->
      <div v-for="segment in items" v-else :key="segment.id">
        <div class="d-flex flex-sm-row flex-column mt-4 mb-3">
          <div class="img-block">
            <div>
              <img :src="segment.img" class="w-100" />
            </div>
            <div v-if="segment.owner" class="d-flex justify-content-center my-3">
              <a href="#" class="mr-3" target="_blank">
                <FacebookIcon />
              </a>
              <a href="#" class="mr-3" target="_blank">
                <InstagramIcon />
              </a>
              <a href="#" class="mr-3" target="_blank">
                <GoogleIcon />
              </a>
              <a href="#" class="" target="_blank">
                <TwitterIcon />
              </a>
            </div>
          </div>
          <div class="pl-sm-3 pt-3 description-block">
            <div v-if="segment.owner" class="w-100 position-relative letter-spacing">
              <p class="text-white opacity-3 text-middle text-uppercase m-0">Owner</p>
              <p class="font-mont-bold text-white text-middle">{{ segment.owner }}</p>
              <p class="text-white opacity-3 text-small">
                {{ address }}
                <button class="border-0 bg-transparent p-0 ml-3">
                  <CopyIcon />
                </button>
              </p>
              <img :src="require(`~/assets/images/${img}.png`)" class="selection-img" />
            </div>
            <div class="w-100 text-white text-uppercase letter-spacing">
              <div class="d-flex justify-content-between pr-sm-4">
                <p class="opacity-3 text-middle">Available</p>
                <p>{{ segment.owner ? "NO" : "YES" }}</p>
              </div>
              <div class="d-flex justify-content-between pr-sm-4">
                <p class="opacity-3 text-middle">Pay WITH</p>
                <p>ETH</p>
              </div>
              <div class="d-flex justify-content-between pr-sm-4">
                <p class="opacity-3 text-middle">Price</p>
                <p>{{ segmentPrice }} Ξ</p>
              </div>
              <div class="ml-sm-2 mb-3 w-100 d-flex justify-content-between align-items-center text-small">
                <p class="opacity-3 mb-0">Coordinate</p>
                <p class="mb-0 ml-auto mr-3">{{ segment.positionId }}</p>
                <button class="border-0 bg-transparent p-0 delete-btn" @click="removeFromCart(segment.id, 'buy')">
                  <DeleteIcon />
                </button>
              </div>
              <div class="text-center">
                <div v-if="items.length === 1" class="bg-primary-gradient mb-3 rounded padding-1 m-2 mt-4">
                  <button v-if="segment.owner" class="btn border-0 text-white text-middle bg-dark w-100 px-0">Make Offer</button>
                  <button
                    v-else
                    class="btn border-0 text-white text-middle w-100 px-0"
                    @click="buy(segment.nft_id)"
                    v-text="!address ? 'Connect' : `Buy for ${segmentPrice} Ξ`"
                  ></button>
                </div>
                <p v-if="segment.owner" class="text-small m-0 opacity-2">
                  <span class="opacity-3">Service fee </span>2 % <span class="opacity-3"> ≈ 0.0001</span>Ξ
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div v-if="mergeMode && mergeItems.length > 1" class="merge-actions">
        <p class="merge-actions__msg" :class="{invalid: !isMergeValid}">{{ mergeMessage }}</p>
        <app-loader v-if="mergeLoading"></app-loader>
        <button v-else class="merge-actions__btn" :disabled="!isMergeValid" @click="mergeSegments">Merge</button>
      </div>
    </div>
    <transition name="fade">
      <unmerge-popup v-if="showUnmergePopup" :segment-id="segmentToUnmerge" @popup-closed="unmergePopupClosed"></unmerge-popup>
    </transition>
  </div>
</template>
<script>
import CartIcon from "@/assets/images/icon/shopping-cart.svg";
import CartDarkIcon from "@/assets/images/icon/shopping-cart_dark.svg";
import IconClose from "@/assets/images/icon/white-close.svg?inline";
import FacebookIcon from "@/assets/images/icon/facebook.svg?inline";
import InstagramIcon from "@/assets/images/icon/instagram.svg?inline";
import GoogleIcon from "@/assets/images/icon/google.svg?inline";
import TwitterIcon from "@/assets/images/icon/twitter.svg?inline";
import CopyIcon from "@/assets/images/icon/copy.svg?inline";
import DeleteIcon from "@/assets/images/icon/delete.svg?inline";

import user from "@/mixins/user";
import sidebar from "@/mixins/sidebar.js";

import {mapGetters, mapActions} from "vuex";

import SEGMENTS from "@/constants/segments";

export default {
  components: {
    IconClose,
    FacebookIcon,
    InstagramIcon,
    GoogleIcon,
    TwitterIcon,
    CopyIcon,
    DeleteIcon,
  },
  mixins: [user, sidebar],
  props: {
    userSegments: {
      type: Array,
      required: false,
      default() {
        return [];
      },
    },
  },
  data() {
    return {
      segmentPrice: process.env.SEGMENT_PRICE,
      cartIcon: CartIcon,
      cartDarkIcon: CartDarkIcon,
      isDropdownActive: false,
      test: [],
      items: [],
      mergeItems: [],
      mergeMessage: "",
      mergeLoading: false,
      mergeMode: false,
      isMergeValid: false,
      showUnmergePopup: false,
      segmentToUnmerge: null,
    };
  },
  computed: {
    ...mapGetters({
      address: "auth/address",
      isPopupBlock: "segmentPopupState/isPopupBlock",
      getOwner: "soldSegments/getOwner",
    }),
    segmentIds() {
      return this.items.map(({nft_id}) => nft_id);
    },
    isMapPage() {
      return this.$route.path === "/";
    },
  },
  watch: {
    mergeItems(arr) {
      this.validateMerge(arr);
    },
    mergeMode(val) {
      this.clearAll();
      this.isPopupVisible = val;
    },
  },
  async mounted() {
    this.$nuxt.$on("mergeModeChange", (val) => (this.mergeMode = val));
    this.$nuxt.$on("segment-click", async (item) => {
      if (this.mergeItems.find(({id}) => id === item.id)) {
        this.removeFromCart(item.id, "merge");
        return false;
      } else if (this.mergeMode) {
        this.addToCart(item, "merge");
        return false;
      }
      if (this.items.find(({id}) => id === item.positionId)) {
        this.removeFromCart(item.id, "buy");
      } else {
        this.addToCart(item, "buy");
      }
    });
  },
  beforeDestroy() {
    this.$nuxt.$off("mergeModeChange");
    this.$nuxt.$off("segment-click");
  },
  methods: {
    ...mapActions({
      blockPopup: "segmentPopupState/blockPopup",
      mergedSegmentsRefresh: "worldMap/mergedSegmentsRefresh",
      setMergedSegmentsData: "worldMap/setMergedSegmentsData",
      setUnmergeSegmentRefresh: "worldMap/setUnmergeSegmentRefresh",
      setSegmentsToMerge: "worldMap/setSegmentsToMerge",
      changeUserSegmentsVisible: "worldMap/changeUserSegmentsVisible",
    }),
    sideCardClose() {
      if (this.isMapPage) {
        this.changeUserSegmentsVisible(false);
        this.close();
      } else {
        this.close();
      }
    },
    async getImg(item) {
      let constantSegment = SEGMENTS.find((segment) => segment.id === item.id);
      let imgName = constantSegment.country;
      return `${process.env.SERVER_URL}/images/${imgName}.jpg`;
    },

    addMergeItem(item) {
      let segmentData;
      if (item.type === "merger") {
        segmentData = item;
      } else {
        const segment = this.userSegments.find((segment) => segment.coordinates === item.positionId);
        segmentData = {...item, price: segment.price, countryImage: segment.countryImage};
      }
      this.mergeItems.push(segmentData);
    },

    async addToCart(item, purpose) {
      const img = await this.getImg(item);
      if (purpose === "buy") {
        this.items.push({
          ...item,
          nft_id: item.id,
          id: item.positionId,
          img,
        });
      } else {
        this.addMergeItem(item);
      }
    },

    removeFromCart(segmentId, purpose) {
      if (purpose === "buy") {
        const idx = this.items.findIndex(({nft_id}) => nft_id === segmentId);
        this.items.splice(idx, 1);
      } else {
        const idx = this.mergeItems.findIndex(({id}) => id === segmentId);
        this.mergeItems.splice(idx, 1);
      }
    },
    async validateMerge(segments) {
      if (segments.length > 1) {
        try {
          const positionId = this.mergeItems.map((segment) => "coordinates=" + segment.positionId).join("&");
          const isMergable = await this.$axios.get(`${process.env.SERVER_URL}/segments-merged/is-mergable?${positionId}`);
          isMergable.data === true
            ? this.markSegmentsAfterValidate("success", "You can merge these segments")
            : this.markSegmentsAfterValidate("error", "You can't merge these segments because they don't form a rectangle");
        } catch (error) {
          const message = error.response.data.error ? error.response.data.error : error;
          console.error(message);
          this.markSegmentsAfterValidate("error", message);
        }
      } else {
        this.markSegmentsAfterValidate(null, "");
        this.$nuxt.$emit("merge-validate", false);
      }
    },
    markSegmentsAfterValidate(status, message) {
      this.mergeMessage = message;

      switch (status) {
        case "success":
          this.isMergeValid = true;
          this.setSegmentsToMerge([...this.mergeItems]);
          this.$nuxt.$emit("merge-validate", true);
          break;
        case "error":
          this.isMergeValid = false;
          this.$nuxt.$emit("merge-validate", false);
          break;
        default:
          break;
      }
    },

    async mergeSegments() {
      const positionId = this.mergeItems.map((segment) => segment.positionId);
      this.mergeLoading = true;
      try {
        const mergeResp = await this.$axios.$post(
          `${process.env.SERVER_URL}/segments-merged`,
          {coordinates: positionId},
          this.requestConfig
        );
        this.mergeLoading = false;

        this.setMergedSegmentsData(mergeResp);
        this.clearAll();

        this.mergedSegmentsRefresh();
      } catch (error) {
        console.log(error);
        this.mergeMessage = error;
        this.mergeLoading = false;
        this.isMergeValid = false;
      }
    },
    requestUnmerge(id) {
      this.segmentToUnmerge = id;

      this.showUnmergePopup = true;
    },
    unmergePopupClosed(val) {
      if (val) {
        this.removeFromCart(this.segmentToUnmerge);
        this.setUnmergeSegmentRefresh(this.segmentToUnmerge);
        this.clearAll();
        this.segmentToUnmerge = null;
      }
      this.showUnmergePopup = false;
    },
    clearAll() {
      this.mergeItems = [];
    },
    buy(ids) {
      this.$nuxt.$emit("buy-segment", ids);
    },
  },
};
</script>
<style lang="scss" scoped>
.merge-actions {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 3.5625rem;
  color: #ffffff;
  font-weight: 600;
  font-size: 1rem;
  font-family: Mont;
  line-height: 1.25rem;

  &__msg {
    margin: 0;
    margin-right: 2.3125rem;
    line-height: 1.125rem;
    text-align: left;
    opacity: 0.6;
    &.invalid {
      color: #ea9413;
      opacity: 1;
    }
  }

  &__btn {
    box-sizing: border-box;
    padding: 1.0625rem 2.25rem;
    color: #ffffff;
    background: transparent;
    border: 1px solid #ffffff;
    border-radius: 0.625rem;

    &:disabled {
      opacity: 0.5;
    }
  }
}

::v-deep {
  .lds-ellipsis {
    margin: auto;
  }
}
</style>
