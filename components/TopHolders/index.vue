<template>
  <div class="swiper-section">
    <h2 class="category">Top holders</h2>
    <div class="swiper-section__slider">
      <swiper :options="swiperOption">
        <swiper-slide v-for="(holder, index) in topHolders" :key="index">
          <top-holders-card :top-holder-data="holder"></top-holders-card>
        </swiper-slide>
      </swiper>
      <button slot="button-prev" class="swiper-section__nav prev th-prev">
        <img src="~assets/images/angle_left.svg" alt="" />
      </button>
      <button slot="button-next" class="swiper-section__nav next th-next">
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
      topHolders: [null, null, null, null, null, null],
      swiperOption: {
        slidesPerView: "auto",
        spaceBetween: 22,
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
          nextEl: ".th-next",
          prevEl: ".th-prev",
        },
        breakpoints: {
          // when window width is >= 1000px
          1000: {
            slidesPerView: 6,
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
        if (newValue === true) this.topHolders = await this.$axios.$get(process.env.SERVER_URL + "/stats/top-holders");
      },
    },
  },
};
</script>

<style lang="scss" scoped>
.swiper-slide {
  @include media-breakpoint-down(md) {
    max-width: 200px;
  }
}
</style>
