<template>
  <main class="main mx-auto">
    <section class="mx-auto map-wrap">
      <div id="map-container" class="map-container">
        <transition name="fade">
          <segment-popup />
        </transition>
        <transition name="fade">
          <div v-show="isPopupBlock" class="faded-bg" @click="unblockPopup"></div>
        </transition>
        <div :class="['map', isSideCardOpen ? 'map_s' : '']">
          <app-loader v-if="isMapLoader" class="app-loader" />
          <world-map :formatted-merged-segments="formattedMergedSegments" :is-map-data-ready="isMapDataReady" :world-map="worldMap" />
          <button class="reset-btn" @click="resetMap()">RESET</button>
        </div>
      </div>
    </section>
    <section class="stats-container">
      <statistics-section />
    </section>
    <section>
      <population-section />
    </section>
    <section>
      <recently-uploaded-images />
    </section>
    <!-- not implemented on the backend -->
    <!-- <section>
      <largest-areas />
    </section>
    <section>
      <lands-for-sale />
    </section> -->
    <section>
      <top-holders />
    </section>
    <section>
      <recently-purchased-lands />
    </section>
    <section>
      <about-us />
    </section>
    <the-footer />
  </main>
</template>

<script>
import user from "@/mixins/user";
import normalizeMergedSegments from "@/mixins/normalizeMergedSegments.js";
import calculateMergedSegmentSides from "@/mixins/calculateMergedSegmentSides.js";
import {mapActions, mapGetters} from "vuex";
import SEGMENTS from "@/constants/segments";

import {cloneDeep} from "lodash";

export default {
  mixins: [user, normalizeMergedSegments, calculateMergedSegmentSides],

  async asyncData({app}) {
    const userGraphQuery = await app.$axios.$post(process.env.GRAPH, {
      query: `
        query ($lastId: String) {
          artworks(first: 5) {
            soldSimpleSegmentsCount
            soldSpecialSegmentsCount
            claimablePiece
          }
          countries(first: 999) {
            id
            name
            totalSegments
            availableSegments
          }
        }
      `,
    });

    let curVal = "30"; // Fxed amount for new version of auction contract
    let availableSegmentsCount =
      9980 - userGraphQuery.artworks[0].soldSimpleSegmentsCount - userGraphQuery.artworks[0].soldSpecialSegmentsCount;
    let availableSegmentsByCountry = userGraphQuery.countries;
    const soldSimpleSegmentsCount = userGraphQuery.artworks[0].soldSimpleSegmentsCount;

    return {soldSimpleSegmentsCount, availableSegmentsByCountry, availableSegmentsCount, curVal};
  },

  data() {
    return {
      isLoading: false,
      isMapDataReady: false,
      isSideCardOpen: false,

      worldMap: [],
      mergedSegments: [],
      formattedMergedSegments: [],
      segmentsWithCustomImage: [],
      soldSegments: [],

      spriteWidth: innerWidth * 0.0026,
      spriteHeight: innerWidth * 0.0026,

      selectionIds: [],
      url: window.location.origin,

      availableSegmentsCount: 0,
      availableSegmentsByCountry: [],
      curVal: 0,
      lastId: "",
    };
  },

  computed: {
    ...mapGetters({
      isPopupBlock: "segmentPopupState/isPopupBlock",
      refreshedSegments: "soldSegments/getRefreshedSegments",
      isMapLoader: "worldMap/getMapLoader",
    }),
    userSegments() {
      return this.soldSegments.filter((segment) => segment.owner.id === this.address);
    },
  },
  watch: {
    soldSegments() {
      this.markSoldSegments();
      this.manageSegments();
    },
    userSegments(arr) {
      this.setUserSegments(arr);
    },
    isMapDataReady() {
      this.addOwnedSegmentsToMap();
    },
  },
  async created() {
    try {
      await Promise.all([this.loadSoldSegments(), this.requestImagesSegments(), this.requestMergedSegments()]);
    } catch (error) {
      console.error(error);
    } finally {
      this.isMapDataReady = true;
    }
  },

  async mounted() {
    this.autoLogin();
    this.manageSegments();
    const urlParams = new URLSearchParams(window.location.search);

    if (urlParams.get("r")) {
      await this.$localForage.setItem("ref", urlParams.get("r"));
    }

    this.$nuxt.$on("segment-click", (id) => {
      this.selectionIds.push(id);
    });

    this.$nuxt.$on("buy-segment", (ids) => {
      this.buy(ids);
    });
    this.$nuxt.$on("call-side-card", (val) => {
      this.isSideCardOpen = val;
    });

    this.$router.afterEach(() => {
      this.blockPopup(false);
    });
  },
  methods: {
    ...mapActions({
      blockPopup: "segmentPopupState/blockPopup",
      setSoldSegments: "soldSegments/setSoldSegments",
      setUserSegments: "soldSegments/setUserSegments",
      setSimpleSegmentsOwners: "soldSegments/setSimpleSegmentsOwners",
    }),
    async requestImagesSegments() {
      try {
        this.segmentsWithCustomImage = await this.$axios.$get(process.env.SERVER_URL + "/segments/images");
      } catch (error) {
        console.error(error);
      }
    },

    async requestMergedSegments() {
      try {
        this.mergedSegments = await this.$axios.$get(`${process.env.SERVER_URL}/segments-merged`);
        this.calculateMergedSegmentSides(this.mergedSegments);
        this.formattedMergedSegments = this.normalizeMergedSegments(this.mergedSegments);
      } catch (error) {
        console.error(error);
      }
    },

    soldSegmentsQuery(page) {
      return this.$axios.$post(process.env.GRAPH, {
        query: `
          query ($lastId: String) {
            artworks(first: 1) {
              tokens(first: 1000, skip:  ${page * 1000}) {
                id
                owner {
                  id
                }
              }
            }
          }
        `,
      });
    },
    async loadSoldSegments() {
      // take sold segments from the graph by soldSimpleSegmentsCount
      let soldSegmentsPromises = [];
      for (let i = 0; i < this.soldSimpleSegmentsCount / 1000; i++) {
        soldSegmentsPromises.push(this.soldSegmentsQuery(i));
      }
      try {
        let soldSegmentsRequests = await Promise.all(soldSegmentsPromises);
        let soldSegments = [];
        soldSegmentsRequests.forEach((responseItem) => {
          soldSegments.push(...responseItem.artworks[0].tokens);
        });
        this.soldSegments = soldSegments;
      } catch (error) {
        console.error(error);
      }
    },

    async manageSegments() {
      await this.setSimpleSegmentsOwners(this.soldSegments);
    },

    markSoldSegments() {
      this.soldSegments.forEach((el, idx) => {
        const node = SEGMENTS.find(({id}) => id == el.id);
        this.soldSegments[idx].coordinates = node.positionId;
      });
    },

    addOwnedSegmentsToMap() {
      //collect all data into an array to draw segments
      let mergedSegments = cloneDeep(this.mergedSegments);
      let segmentsWithCustomImage = cloneDeep(this.segmentsWithCustomImage);
      let soldSegments = cloneDeep(this.soldSegments);
      this.worldMap = SEGMENTS.map((item) => {
        let mapSegment = {...item};
        let isMergedSegment = mergedSegments.find((mergedSegment) => {
          mergedSegment.positionId.find((positionIdItem) => positionIdItem === item.positionId);
        });
        if (isMergedSegment) {
          mapSegment.isHiddenSegment = true;
        }

        let img = segmentsWithCustomImage.find((customImageItem) => item.id === customImageItem.id);
        if (img) {
          mapSegment.img = img.imageMini;
          mapSegment.imageName = img.image;
        }

        let soldSegment = soldSegments.find((customImageItem) => item.id == customImageItem.id);
        if (soldSegment) {
          mapSegment.owner = soldSegment.owner;
        }

        return mapSegment;
      });
    },

    unblockPopup() {
      this.blockPopup(false);
    },
    resetMap() {
      this.$nuxt.$emit("map-reset");
    },
    async buy(ids) {
      if (!this.address) {
        this.$nuxt.$emit("openUnlockPopup");
      }
      try {
        if (!Array.isArray(ids)) {
          ids = [ids];
        }

        // Minter allowed to mint tokens, without buying
        // Tokens should be sent to VAULT wallet address
        if (this.address === process.env.OWNER_ADDRESS) {
          this.$nuxt.$emit("toggleTransactionPopup", "CONFIRMING");
          await this.$contracts
            .multiSend()
            .methods.mintMany(ids, process.env.VAULT_ADDRESS)
            .send({
              from: this.address,
              value: "0x0",
            })
            .on("transactionHash", () => {
              this.$nuxt.$emit("toggleTransactionPopup", "PENDING");
            });
          this.$nuxt.$emit("toggleTransactionPopup", "SUCCESS");
        } else {
          if (ids.length === 1) {
            this.$nuxt.$emit("toggleTransactionPopup", "CONFIRMING");
            await this.$contracts
              .auction()
              .methods.buySingle(this.address, ids[0])
              .send({
                from: this.address,
                value: this.$web3().utils.toWei(process.env.SEGMENT_PRICE),
              })
              .on("transactionHash", () => {
                this.$nuxt.$emit("toggleTransactionPopup", "PENDING");
              });
            this.$nuxt.$emit("toggleTransactionPopup", "SUCCESS");
          } else {
            this.$nuxt.$emit("toggleTransactionPopup", "CONFIRMING");
            await this.$contracts
              .auction()
              .methods.buyMany(
                ids.map(() => this.address),
                ids
              )
              .send({
                from: this.address,
                value: this.$web3().utils.toWei((ids.length * process.env.SEGMENT_PRICE).toString()),
              })
              .on("transactionHash", () => {
                this.$nuxt.$emit("toggleTransactionPopup", "PENDING");
              });
            this.$nuxt.$emit("toggleTransactionPopup", "SUCCESS");
          }
        }
      } catch (err) {
        console.error(err);
        this.$nuxt.$emit("toggleTransactionPopup", "HIDDEN");
      }
    },
  },
};
</script>

<style src="./index.scss" lang="scss">
@import "@/assets/scss/index.scss";
</style>
