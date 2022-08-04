<template>
  <div v-if="cave.totalCitizens > 0">
    <div v-for="citizen in cave.citizens" :key="citizen.id" class="cave__villager">
      <p class="base-text__white_muffled">0xfa3b...A8K9</p>

      <p v-if="citizen.rewardAmount > 0" class="text-dotted-overflow d-flex">
        <b class="text-gradient-light mr-1">Available reward: </b> <EraPieceValue :value="citizen.rewardAmount" />
      </p>
      <p v-else class="text-dotted-overflow"><b class="text-gradient-light">Reward in:</b> {{ citizen.nextRewardAt | normalizeDate }}</p>
    </div>
  </div>
  <div v-else class="without-residents">
    <p class="without-residents__text">Invite friends to the game and earn tokens together! 200 tokens per each friend every 24 hours</p>
    <button class="nft-era__button villager-view__income nft-era__button_white disabled text-white">Share in socials</button>
  </div>
</template>
<script>
import helpers from "@/mixins/helpers";
export default {
  mixins: [helpers],
  props: {
    cave: {
      type: Object,
      default: null,
    },

    maxCitizens: {
      type: Number,
      default: 4,
    },
  },
  data() {
    return {};
  },
};
</script>
<style lang="scss" src="~/components/EraPopup/Cave/index.scss" scoped></style>
