<template>
  <div class="reward-danger">
    <Danger /><strong class="reward-danger__value">
      Max Reward<br />
      Claim to keep earning</strong
    >
  </div>
</template>
<script>
import Danger from "@/assets/images/icon/danger.svg?inline";

export default {
  components: {
    Danger,
  },
};
</script>
<style lang="scss" scoped>
.reward-danger {
  &__value {
    color: $danger;
    font-weight: normal;
    font-size: 0.6667rem;
    line-height: 0.8571rem;
    letter-spacing: 0.01em;
  }
}
</style>
