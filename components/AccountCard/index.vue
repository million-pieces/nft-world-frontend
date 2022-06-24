<template>
  <div class="padding-1 rounded-lg account-card" :class="theme">
    <div class="card-body flex-row rounded-lg letter-spacing">
      <div class="row m-0">
        <div class="col-lg-4 mx-auto pl-0 pr-0 pr-lg-3 mb-3 mb-lg-0">
          <!-- Image form -->
          <!-- TODO: think about allocation to a component -->
          <form ref="customImageForm" class="square-block rounded-lg img-form">
            <label class="cursor-pointer">
              <input
                type="file"
                class="d-none"
                accept="image/x-png,image/jpeg"
                name="image"
                :disabled="!imageIsEditable"
                @change="uploadCustomImage($event)"
              />
              <img v-if="segmentImage" :src="segmentImage" class="square-img" />
              <div
                v-else
                class="square-box img-placeholder text-center rounded-lg d-flex justify-content-center align-items-center flex-column"
              >
                <YourArtwork />
                <small v-if="imageIsEditable" class="d-block mt-3 text-capitalize"> + Upload Your Image for the Artwork </small>
              </div>
            </label>
          </form>
          <a
            v-if="isOwner && theme !== 'merge-item'"
            class="btn btn-outline-dark opacity-2 py-2 px-sm-2 px-3 text-nowrap text-small mx-auto mt-3 d-block"
            :href="`${apiLink + country}-high.jpg`"
            download="true"
          >
            Download Certificate
          </a>
        </div>
        <!-- Segment info -->
        <div class="col-lg-8 pr-0 pl-0 pl-lg-3 d-flex flex-column justify-content-between">
          <div>
            <p v-if="segmentType === 'merger'" class="text-center">Merged Segment</p>
            <div class="d-flex justify-content-between align-items-start">
              <div class="d-flex align-items-start mb-4">
                <div v-if="countryImage" class="rounded-lg mr-sm-4 mr-3 place-img">
                  <img :src="countryImage" />
                </div>
                <div class="text-left">
                  <p class="mb-0 country-value text-left">{{ country | removeDash }}</p>
                  <p class="text-gradient-primary text-left mb-0 text-bigger text-uppercase position-id">
                    {{ positionId | coordinatesPipe }}
                  </p>
                </div>
              </div>
              <button v-if="segmentType === 'merger'" class="unmerge-btn" @click="unmerge">
                <img src="~/assets/images/icon/unmerge.svg" alt="" />
              </button>
            </div>
            <div class="d-md-flex align-items-start">
              <div
                v-if="price"
                class="
                  d-flex
                  flex-md-column
                  mb-md-0 mb-2
                  align-items-center align-items-md-start
                  justify-content-md-start justify-content-between
                "
              >
                <p class="text-nowrap mr-5 mb-md-3 mb-0 text-uppercase text-middle opacity-2 price">Piece amount</p>
                <p class="text-big mb-0">{{ price }} PIECE</p>
              </div>
              <div class="d-flex flex-wrap align-items-center align-items-md-start w-100">
                <p class="text-nowrap text-uppercase text-middle mb-md-3 mb-0 opacity-2 website-link-title d-flex justify-content-between">
                  Website link
                  <button v-if="theme === 'merge-item' && imageIsEditable" class="edit-link-btn" @click="openEditInput">
                    <Pencil v-if="websiteLink"></Pencil> <Plus v-else></Plus>
                  </button>
                </p>
                <button
                  v-if="isOwner && theme !== 'merge-item'"
                  class="btn btn-outline-dark opacity-2 py-2 mt-md-n2 px-sm-4 px-3 text-nowrap text-small ml-auto"
                  @click="openEditInput"
                >
                  <span v-if="websiteLink">Edit</span>
                  <span v-else>Add</span> link
                </button>
                <div class="w-100 mt-md-0 mt-2 d-flex">
                  <input
                    v-if="editLink"
                    ref="linkInput"
                    v-model="websiteLink"
                    class="website-link-input"
                    type="url"
                    maxlength="120"
                    @blur="updateLink()"
                  />
                  <a v-else class="text-big website-link" :href="websiteLink" target="_blank">
                    {{ websiteLink || "N/A" }}
                  </a>
                </div>
              </div>
            </div>
          </div>
          <div v-if="theme !== 'merge-item'" class="d-flex justify-content-end mt-4">
            <button
              v-if="isOwner"
              :disabled="disabled"
              type="button"
              class="account-btn btn text-small text-nowrap text-white bg-primary-gradient font-weight-bold mr-sm-3 mr-2 border-0"
              @click="handleListUnlock"
            >
              List For Sale
            </button>
            <button
              v-if="isOwner"
              type="button"
              class="account-btn btn btn-outline-dark text-nowrap text-small"
              @click="handleTransferUnlock"
            >
              <Swap class="mr-2" />
              Transfer
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import user from "@/mixins/user";
import YourArtwork from "@/assets/images/icon/your-artwork.svg?inline";
import Swap from "@/assets/images/icon/swap.svg?inline";
import Pencil from "@/assets/images/icon/pencil.svg?inline";
import Plus from "@/assets/images/icon/plus.svg?inline";
import {mapActions, mapGetters} from "vuex";

export default {
  components: {
    YourArtwork,
    Swap,
    Pencil,
    Plus,
  },
  filters: {
    coordinatesPipe(val) {
      if (Array.isArray(val)) {
        if (val.length > 6) {
          return val.slice(0, 6).join(", ") + "...";
        } else {
          return val.join(", ");
        }
      } else {
        return val;
      }
    },
    removeDash(str) {
      return str ? str.replaceAll("_", " ") : "";
    },
  },
  mixins: [user],
  props: {
    mergedSegmentId: {
      type: Number,
      default: null,
      required: false,
    },

    country: {
      type: String,
      default: null,
      required: false,
    },
    countryImage: {
      type: String,
      default: null,
      required: false,
    },

    positionId: {
      type: [String, Array],
      required: true,
    },

    imageName: {
      type: String,
      default: null,
      required: false,
    },
    theme: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      default: "segments",
      required: false,
    },

    price: {
      type: String,
      default: null,
      required: false,
    },
    disabled: {
      type: Boolean,
      default: false,
      required: false,
    },

    isOwner: {
      type: Boolean,
      default: null,
      required: false,
    },
  },
  data() {
    return {
      apiLink: process.env.LARGE_IMG,
      editLink: false,
      websiteLink: null,
      segmentData: {},
    };
  },
  computed: {
    ...mapGetters({
      refreshedSegments: "soldSegments/getRefreshedSegments",
    }),
    segmentType() {
      if (Array.isArray(this.positionId)) {
        return "merger";
      } else {
        return "simple";
      }
    },
    owners() {
      if (this.segmentType === "merger") {
        return this.positionId;
      }
      return [];
    },
    imageIsEditable() {
      return true;
    },
    segmentImage() {
      if (this.segmentData.image == null) {
        return null;
      }
      if (this.segmentType === "merger") {
        return `${process.env.SERVER_URL}/files/merged-segments/images/${this.segmentData.image}`;
      }
      return `${process.env.SERVER_URL}/files/segments/images/${this.segmentData.image}`;
    },
  },
  watch: {
    positionId() {
      this.requestSegmentData();
    },
  },
  async mounted() {
    this.requestSegmentData();
  },
  methods: {
    ...mapActions({
      addRefreshedSegment: "soldSegments/addRefreshedSegment",
      setMergedImgData: "worldMap/setMergedImgData",
      setSegmentImgRefresh: "worldMap/setSegmentImgRefresh",
    }),

    handleListUnlock() {
      this.$nuxt.$emit("openListPopup");
    },
    handleTransferUnlock() {
      this.$nuxt.$emit("openTransferPopup");
    },
    handleSocialPopup() {
      this.$nuxt.$emit("openSocialPopup");
    },
    openEditInput() {
      this.editLink = true;
      setTimeout(() => {
        this.$refs.linkInput.focus();
      }, 1);
    },
    unmerge() {
      this.$emit("unmerge-segment", this.mergedSegmentId);
    },

    updateSegmentData() {
      if (this.segmentData.siteUrl == null) {
        return;
      }
      this.websiteLink = this.segmentData.siteUrl;
    },

    async requestSegmentData() {
      const url = `${process.env.SERVER_URL}/segments${
        this.segmentType === "merger" ? "-merged/" + this.mergedSegmentId : "/" + this.positionId
      }`;
      try {
        this.segmentData = await this.$axios.$get(url);
      } catch (error) {
        console.error(error);
      }
      this.updateSegmentData();
    },

    async refreshCustomImage() {
      await this.requestSegmentData();
      this.addRefreshedSegment(this.positionId);
      // image to refresh segment on map
      let imageMini;
      if (this.segmentType === "merger") {
        this.segmentImage = `${process.env.SERVER_URL}/files/merged-segments/images/${this.segmentData.image}`;
        imageMini = `${process.env.SERVER_URL}/files/merged-segments/images-mini/${this.segmentData.imageMini}`;
        this.setMergedImgData({image: imageMini, mergedSegmentId: this.segmentData.id});
      } else {
        this.segmentImage = `${process.env.SERVER_URL}/files/segments/images/${this.segmentData.image}`;
        imageMini = `${process.env.SERVER_URL}/files/segments/images-mini/${this.segmentData.imageMini}`;
        this.setSegmentImgRefresh({image: imageMini, positionId: this.positionId});
      }
    },

    async uploadCustomImage() {
      const formData = new FormData(this.$refs.customImageForm);

      let url;
      if (this.segmentType === "merger") {
        url = `${process.env.SERVER_URL}/segments-merged/${this.segmentData.id}/image`;
      } else {
        url = `${process.env.SERVER_URL}/segments/${this.segmentData.coordinates}/image`;
      }
      try {
        await this.$axios.$post(url, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
            "Wallet-Address": this.address,
            Signature: this.signature,
          },
        });
        this.refreshCustomImage();
      } catch (error) {
        console.error(error);
      }
    },
    async updateLink() {
      this.editLink = false;
      const segmentId = this.segmentType === "merger" ? this.segmentData.id : this.segmentData.coordinates;
      try {
        await this.$axios.$put(
          `${process.env.SERVER_URL}/segments${this.segmentType === "merger" ? "-merged/" + segmentId : "/" + segmentId}`,
          {siteUrl: this.websiteLink},
          this.requestConfig
        );
      } catch (error) {
        console.error(error);
      }
    },
  },
};
</script>
<style src="./index.scss" lang="scss" scoped></style>
