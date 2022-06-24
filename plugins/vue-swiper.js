import Vue from "vue";
import getAwesomeSwiper from "vue-awesome-swiper/dist/exporter";

// Swiper 5.2.2x
import {Swiper as SwiperClass, Navigation} from "swiper/js/swiper.esm.js";

// Swiper modules
SwiperClass.use([Navigation]);

Vue.use(getAwesomeSwiper(SwiperClass));
