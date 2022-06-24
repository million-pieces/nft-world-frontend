<template>
  <div class="stats">
    <div class="stats__row">
      <!-- NFTWorld statistics -->
      <div class="stats__col stats__nftworld-statistics">
        <h2 class="category">NFTWorld statistics</h2>
        <ul v-if="nftStatistics" class="stats__list">
          <li v-if="nftStatistics.currentPrice" class="stats__item">
            <b>{{ nftStatistics.currentPrice }} ETH</b>
            <br />
            <span class="stats__desc">Current Value</span>
          </li>
          <!-- DAY VALUE  -->
          <!-- if val go up  -->
          <li v-if="nftStatistics.dailyChanges > 0" class="stats__item stats__item_up">
            <b> +{{ nftStatistics.dailyChanges }}% </b>
            <br />
            <span class="stats__desc">Day</span>
          </li>
          <!-- if val go down  -->
          <li v-else-if="nftStatistics.dailyChanges < 0" class="stats__item stats__item_down">
            <b> {{ nftStatistics.dailyChanges }}% </b>
            <br />
            <span class="stats__desc">Day</span>
          </li>
          <!-- if the value hasn't changed -->
          <li v-else class="stats__item">
            <b> {{ nftStatistics.dailyChanges }}% </b>
            <br />
            <span class="stats__desc">Day</span>
          </li>
          <!-- WEEK VALUE  -->
          <!-- if val go up  -->
          <li v-if="nftStatistics.weeklyChanges > 0" class="stats__item stats__item_up">
            <b> +{{ nftStatistics.weeklyChanges }}% </b>
            <br />
            <span class="stats__desc">Week</span>
          </li>
          <!-- if val go down  -->
          <li v-else-if="nftStatistics.weeklyChanges < 0" class="stats__item stats__item_down">
            <b> {{ nftStatistics.weeklyChanges }}% </b>
            <br />
            <span class="stats__desc">Week</span>
          </li>
          <!-- if the value hasn't changed -->
          <li v-else class="stats__item">
            <b> {{ nftStatistics.weeklyChanges }}% </b>
            <br />
            <span class="stats__desc">Week</span>
          </li>
        </ul>
      </div>
      <!-- Featured segment -->
      <div class="stats__col stats__featured-segment featured-segment">
        <h3 class="stats__small-header">Featured segment</h3>
        <transition mode="out-in" name="fade">
          <div v-if="featuredSegment && ownerData" class="stats__card featured-segment__card">
            <div class="featured-segment__image">
              <img :src="segmentImage" alt="" />
            </div>
            <!-- Owner -->
            <div class="featured-segment__owner">
              <div class="featured-segment__row">
                <div v-if="ownerData" class="featured-segment__owner-main-info">
                  <!-- Segment owner -->
                  <img v-if="ownerAvatar" :src="ownerAvatar" class="owner__avatar" />
                  <img v-else :src="$identicon(ownerData.address || '123456789012345')" class="owner__avatar" />
                  <div class="owner__main-info">
                    <p class="owner__label">{{ owner.length > 1 ? "Owners" : "Owner" }}</p>
                    <span class="font-mont-bold text-white">{{ ownerName }}</span>
                  </div>
                </div>
                <!-- Segment country -->
                <div v-if="featuredSegment.country" class="country-name">
                  <p class="country-name__label">Country</p>
                  <p class="country-name__value">{{ featuredSegment.country | dashReplacer }}</p>
                </div>
                <!-- Segment ID -->
                <div v-if="featuredSegment.coordinates" class="w-50 segment-id">
                  <p class="segment-id__label">ID</p>
                  <p class="segment-id__value">{{ featuredSegment.coordinates | dashReplacer }}</p>
                </div>
              </div>
              <div v-if="owner" class="text-white text-left opacity-3 text-small address-container">
                <copy-link v-for="wallet in owner" :key="wallet" :address="wallet" :color="'white'" />
              </div>
              <!-- OpenSea -->
              <div class="owner__opensea-link">
                <a :href="openseaLink" target="_blank" rel="noreferrer noopener" class="text-white text-decoration-none">
                  <img src="~assets/images/icon/opensea-logo.png" height="32" alt="" /> {{ openseaLinkShorten }}
                </a>
              </div>
              <!-- Social links -->
              <div v-if="ownerData.socials" class="d-flex justify-content-end">
                <a v-if="ownerData.socials['facebook']" class="soc-link" :href="ownerData.socials['facebook']" target="_blank">
                  <Facebook></Facebook>
                </a>
                <a v-if="ownerData.socials['instagram']" class="soc-link" :href="ownerData.socials['instagram']" target="_blank">
                  <Instagram></Instagram>
                </a>
                <a v-if="ownerData.socials['twitter']" class="soc-link" :href="ownerData.socials['twitter']" target="_blank">
                  <Twitter></Twitter>
                </a>
                <a v-if="ownerData.socials['discord']" class="soc-link" :href="ownerData.socials['discord']" target="_blank">
                  <Discord></Discord>
                </a>
                <a v-if="ownerData.socials['telegram']" class="soc-link" :href="ownerData.socials['telegram']" target="_blank">
                  <Telegram></Telegram>
                </a>
              </div>
              <!-- /Social links -->
            </div>
            <!-- /Owner -->
          </div>
          <div v-else class="stats__card"></div>
        </transition>
      </div>
    </div>
  </div>
</template>

<script>
import Facebook from "@/assets/images/icon/facebook-dark.svg?inline";
import Instagram from "@/assets/images/icon/instagram-dark.svg?inline";
import Twitter from "@/assets/images/icon/twitter-logo.svg?inline";
import Discord from "@/assets/images/icon/discord-logo.svg?inline";
import Telegram from "@/assets/images/icon/telegram.svg?inline";

import {mapGetters} from "vuex";

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
      return string.replace(/_/g, " ");
    },
  },

  data: () => ({
    featuredSegment: false,
    nftStatistics: null,
    ownerData: false,
  }),

  computed: {
    ...mapGetters({
      getOwner: "soldSegments/getOwner",
      getIsMapLoaded: "worldMap/getIsMapLoaded",
    }),
    owner() {
      const id = this.featuredSegment.coordinates;
      if (id) {
        return this.getOwner(id, this.segmentType);
      } else {
        return false;
      }
    },
    ownerName() {
      if (this.featuredSegment.name.length > 0) {
        return this.featuredSegment.name;
      }
      let address = this.featuredSegment.walletAddress;
      return `${address.slice(0, 5)}....${address.slice(-3, address.length)}`;
    },
    ownerAvatar() {
      if (this.featuredSegment.avatar == null) {
        return null;
      }
      return `${process.env.SERVER_URL}/files/users/avatars/${this.featuredSegment.avatar}`;
    },
    segmentType() {
      if (Array.isArray(this.featuredSegment.coordinates)) {
        return "merger";
      } else {
        return "simple";
      }
    },
    segmentImage() {
      if (this.featuredSegment.image == null) {
        return null;
      }
      if (this.segmentType === "merger") {
        return `${process.env.SERVER_URL}/files/merged-segments/images/${this.featuredSegment.image}`;
      }
      return `${process.env.SERVER_URL}/files/segments/images/${this.featuredSegment.image}`;
    },
    openseaLink() {
      return `https://opensea.io/assets/${process.env.MILLION_PIECES_ADDRESS}/${this.featuredSegment.id}`;
    },
    openseaLinkShorten() {
      return this.openseaLink.slice(0, 22) + "...";
    },
  },
  watch: {
    getIsMapLoaded: {
      async handler(newValue) {
        if (newValue === false) {
          return;
        }

        const featuredSegmentEndpoint = `${process.env.SERVER_URL}/stats/featured-segment`;
        this.featuredSegment = await this.$axios.$get(featuredSegmentEndpoint).catch((err) => console.error(err));
        this.nftStatistics = await this.$axios.$get(`${process.env.SERVER_URL}/stats/price-changes`).catch((err) => console.error(err));
      },
    },

    async owner(owners) {
      if (!owners.length) {
        return false;
      }
      if (owners.length > 1) {
        this.ownerData = null;
      } else {
        const ownerWallet = owners[0].toLowerCase();
        this.ownerData = await this.$axios.$get(`${process.env.SERVER_URL}/user/${ownerWallet}`).catch((err) => console.error(err));
      }
    },
  },
};
</script>

<style src="./index.scss" lang="scss"></style>
