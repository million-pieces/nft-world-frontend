<template>
  <div class="swiper-section">
    <h2 class="category">Recently purchased land</h2>
    <div class="swiper-section__slider">
      <swiper :options="swiperOption">
        <swiper-slide v-for="(card, index) in cards" :key="index">
          <segment-card :mode="'new-purchase'" :card-data="card"></segment-card>
        </swiper-slide>
      </swiper>
      <button slot="button-prev" class="swiper-section__nav prev rpl-prev">
        <img src="~assets/images/angle_left.svg" alt="" />
      </button>
      <button slot="button-next" class="swiper-section__nav next rpl-next">
        <img src="~assets/images/angle.svg" alt="" />
      </button>
    </div>
  </div>
</template>

<script>
import {Swiper, SwiperSlide} from "vue-awesome-swiper";
import {mapGetters} from "vuex";

export default {
  components: {
    Swiper,
    SwiperSlide,
  },
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
          nextEl: ".rpl-next",
          prevEl: ".rpl-prev",
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
        this.cards = await this.$axios.$get(`${process.env.SERVER_URL}/stats/recently-purchased`).catch((err) => console.error(err));
      },
    },
  },
};
</script>

<style lang="scss" scoped></style>
