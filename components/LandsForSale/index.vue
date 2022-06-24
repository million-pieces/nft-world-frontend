<template>
  <div class="swiper-section">
    <h2 class="category">Lands for sale</h2>
    <div class="swiper-section__slider">
      <swiper :options="swiperOption">
        <swiper-slide v-for="(card, index) in cards" :key="index">
          <lands-for-sale-card :card-data="card" />
        </swiper-slide>
      </swiper>
      <button slot="button-prev" class="swiper-section__nav prev lfs-prev">
        <img src="~assets/images/angle_left.svg" alt="" />
      </button>
      <button slot="button-next" class="swiper-section__nav next lfs-next">
        <img src="~assets/images/angle.svg" alt="" />
      </button>
    </div>
  </div>
</template>

<script>
import {mapGetters} from "vuex";

export default {
  data() {
    return {
      cards: [null, null, null, null],
      swiperOption: {
        slidesPerView: "auto",
        spaceBetween: 24,
        slidesOffsetBefore: 28,
        slidesOffsetAfter: 28,
        freeMode: {
          enabled: true,
          sticky: true,
        },
        mousewheel: {
          forceToAxis: true,
          invert: true,
        },
        navigation: {
          nextEl: ".lfs-next",
          prevEl: ".lfs-prev",
        },
        breakpoints: {
          // when window width is >= 1000px
          1000: {
            slidesPerView: 4,
            spaceBetween: 24,
            slidesOffsetBefore: 0,
            slidesOffsetAfter: 0,
          },
        },
      },
    };
  },
  computed: {
    ...mapGetters({
      getIsMapLoaded: "worldMap/getIsMapLoaded",
    }),
  },
  watch: {
    getIsMapLoaded: {
      async handler(newValue) {
        if (newValue === false) {
          return;
        }
        this.cards = await this.$axios.$get(`${process.env.SERVER_URL}/stats/lands-for-sale`).catch((err) => console.error(err));
      },
    },
  },
};
</script>

<style lang="scss" scoped></style>
