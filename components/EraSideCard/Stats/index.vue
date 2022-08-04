<template>
  <div class="stats">
    <h6 class="stats__header text-white">Personal stats</h6>
    <div class="stats__content">
      <div class="d-flex">
        <!-- CITIZEN / OWNER ui -->
        <EraInfoBlock
          v-if="isOwner"
          header="Amount segments"
          :value="`${userGameData.segments.length}(${userGameData.cavesAmount} Caves)`"
        />
        <EraInfoBlock
          v-else
          header="Residents amount"
          :value="`${userGameData.citizensAmount}(in ${userGameData.segments.length} segments)`"
        />

        <EraInfoBlock header="yearly reward" :value="userGameData.yearlyReward" theme="point" />
      </div>
      <div class="content__claim">
        <EraInfoBlock header="Unclaimed reward" :value="userGameData.unclaimedReward" theme="point" />
        <button class="nft-era__button" @click="claimTotalTokens">Claim all income</button>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    isOwner: {
      type: Boolean,
      required: true,
    },
    userGameData: {
      type: Object,
      default: () => {},
    },
  },
  methods: {
    claimTotalTokens() {
      this.$nuxt.$emit("claimTotalTokens", this.isOwner);
    },
  },
};
</script>
<style lang="scss" scoped>
.stats {
  padding: 0;
  &__header {
    margin-bottom: 1.1429rem;
  }
  &__content {
    display: flex;
    justify-content: space-between;
    .content__claim {
      width: 10.7143rem;
    }
  }
}
.nft-era__button {
  margin-top: 0.8571rem;
}
</style>
