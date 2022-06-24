<template>
  <div class="population">
    <h2 class="category">Population</h2>
    <ul class="population__grid">
      <li class="population__item population__item_big">
        <span>Total owners</span>
        <div class="population__arrow arrow">
          <div class="arrow__body"></div>
          <img class="arrow__head" src="~assets/images/arrow-head.png" alt="" />
        </div>
        <b>{{ populationData.totalOwners }}</b>
      </li>
      <li class="population__item">
        <span>Emperors</span>
        <div class="population__arrow arrow">
          <div class="arrow__body"></div>
          <img class="arrow__head" src="~assets/images/arrow-head.png" alt="" />
        </div>
        <b>{{ populationData.emperors }}</b>
      </li>
      <li class="population__item">
        <span>Imperialists</span>
        <div class="population__arrow arrow">
          <div class="arrow__body"></div>
          <img class="arrow__head" src="~assets/images/arrow-head.png" alt="" />
        </div>
        <b>{{ populationData.imperialists }}</b>
      </li>
      <li class="population__item">
        <span>Conquerors</span>
        <div class="population__arrow arrow">
          <div class="arrow__body"></div>
          <img class="arrow__head" src="~assets/images/arrow-head.png" alt="" />
        </div>
        <b>{{ populationData.conquerors }}</b>
      </li>
      <li class="population__item">
        <span>Lords</span>
        <div class="population__arrow arrow">
          <div class="arrow__body"></div>
          <img class="arrow__head" src="~assets/images/arrow-head.png" alt="" />
        </div>
        <b>{{ populationData.lords }}</b>
      </li>
      <li class="population__item">
        <span>Settlers</span>
        <div class="population__arrow arrow">
          <div class="arrow__body"></div>
          <img class="arrow__head" src="~assets/images/arrow-head.png" alt="" />
        </div>
        <b>{{ populationData.settlers }}</b>
      </li>
      <li class="population__item">
        <span>Landowners</span>
        <div class="population__arrow arrow">
          <div class="arrow__body"></div>
          <img class="arrow__head" src="~assets/images/arrow-head.png" alt="" />
        </div>
        <b>{{ populationData.landowners }}</b>
      </li>
    </ul>
  </div>
</template>

<script>
import {mapGetters} from "vuex";

export default {
  data() {
    return {
      populationData: {},
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
        if (newValue === true) this.populationData = await this.$axios.$get(`${process.env.SERVER_URL}/stats/population`);
      },
    },
  },
};
</script>

<style src="./index.scss" lang="scss"></style>
