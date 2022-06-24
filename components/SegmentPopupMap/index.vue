<template>
  <div>
    <!-- Segment Image -->
    <div class="popup__image mb-3" :class="{popup__image_big: !segment.isSegmentWithCustomImage}">
      <img v-if="segment.img" :src="segment.img" alt="" @error="imgPlaceholder = true" @load="movePopup(segment.positionId)" />
      <div v-else-if="!segment.img && !imgPlaceholder">Loading...</div>
      <div v-if="imgPlaceholder">Not found!</div>
    </div>

    <!-- Segment data  -->
    <div v-if="ownerData" class="position-relative">
      <p class="owner__label text-white m-0">Owner</p>
      <OwnerShortInfo :owner-data="ownerData" theme="segmentPopup" />
    </div>

    <div v-if="ownerData && !isBigCity && segment.type !== 'merger'" class="owner__opensea-link mb-3">
      <a :href="openseaLink" target="_blank" rel="noreferrer noopener" class="opensea-link__image text-white text-decoration-none">
        <img src="~assets/images/icon/opensea-logo.png" height="24" alt="" /> Opensea
      </a>
      <a :href="openseaLink" target="_blank" rel="noreferrer noopener" class="opensea-link__text text-white px-0">
        {{ openseaLinkShorten }}
      </a>
    </div>
    <div v-if="isSocialBlockActive" class="position-relative mt-3">
      <a v-if="segmentData.siteUrl" target="_blank" :href="segmentData.siteUrl" class="segment-url">{{ segmentData.siteUrl }}</a>
      <div v-if="ownerData" class="d-flex justify-content-around px-5 mb-3 pb-2">
        <a v-if="ownerData.socials['facebook']" class="soc-link" :href="ownerData.socials['facebook']" target="_blank">
          <Facebook />
        </a>
        <a v-if="ownerData.socials['instagram']" class="soc-link" :href="ownerData.socials['instagram']" target="_blank">
          <Instagram />
        </a>
        <a v-if="ownerData.socials['twitter']" class="soc-link" :href="ownerData.socials['twitter']" target="_blank">
          <Twitter />
        </a>
        <a v-if="ownerData.socials['discord']" class="soc-link" :href="ownerData.socials['discord']" target="_blank">
          <Discord />
        </a>
        <a v-if="ownerData.socials['telegram']" class="soc-link" :href="ownerData.socials['telegram']" target="_blank">
          <Telegram />
        </a>
      </div>
    </div>
    <div v-if="segment.type === 'merger'" class="text-center text-white">Merged Segment</div>
    <div v-else class="d-flex justify-content-between text-white w-100">
      <div class="w-50 country-name">
        <p class="country-name__label text-white opacity-3">Country</p>
        <p class="country-name__value text-dotted-overflow" :title="country | dashReplacer">
          {{ country | dashReplacer }}
        </p>
      </div>
      <div class="segment-id w-50">
        <p class="segment-id__label text-white opacity-3">ID</p>
        <p class="segment-id__value text-dotted-overflow" :title="segment.positionId | dashReplacer">
          {{ segment.positionId | dashReplacer }}
        </p>
      </div>
    </div>
    <div v-if="isBigCity" data-v-1f83b5e2="" class="bg-primary-gradient mb-3 rounded padding-1 m-2 mt-4">
      <a :href="openseaLink" target="_blank" rel="noreferrer noopener" class="btn border-0 text-white text-middle w-100 px-0">
        <img src="~assets/images/icon/opensea-logo.png" height="24" alt="" /> Opensea
      </a>
    </div>

    <div v-if="!ownerData && !isBigCity" class="position-relative">
      <p class="text-white opacity-3 text-small mb-1 segment-prompt">*Click on the Segment to put it into your basket</p>
    </div>
  </div>
</template>
<script>
import Facebook from "@/assets/images/icon/facebook-dark.svg?inline";
import Instagram from "@/assets/images/icon/instagram-dark.svg?inline";
import Twitter from "@/assets/images/icon/twitter-logo.svg?inline";
import Discord from "@/assets/images/icon/discord-logo.svg?inline";
import Telegram from "@/assets/images/icon/telegram.svg?inline";

export default {
  components: {
    Facebook,
    Instagram,
    Twitter,
    Discord,
    Telegram,
  },
  filters: {
    dashReplacer(string) {
      return string?.replace(/_/g, " ");
    },
  },
  props: {
    segment: {
      type: Object,
      required: true,
    },
    ownerData: {
      type: Object,
      default: null,
      required: false,
    },
    segmentData: {
      type: [Object, String],
      required: true,
    },
    movePopup: {
      type: Function,
      required: true,
    },
  },
  data() {
    return {
      imgPlaceholder: true,
    };
  },
  computed: {
    isBigCity() {
      return Boolean(this.segment.city);
    },
    openseaLink() {
      return `https://opensea.io/assets/${process.env.MILLION_PIECES_ADDRESS}/${this.segment.positionId}`;
    },
    openseaLinkShorten() {
      return this.openseaLink.slice(0, 21) + "...";
    },
    ownerAvatar() {
      if (this.ownerData.avatar == null) return null;
      return process.env.SERVER_URL + this.ownerData.avatar;
    },
    isSocialBlockActive() {
      return Boolean(this.segmentData?.siteUrl) || this.ownerData?.socials?.length > 0;
    },
    country() {
      let country;

      if (this.segment.country) {
        country = this.segment.country;
      } else {
        this.segmentType === "merger" ? (country = "Merged Segment") : (country = "Not Found");
      }

      return country;
    },
  },
};
</script>
<style lang="scss" src="../SegmentPopup/index.scss" scoped></style>
