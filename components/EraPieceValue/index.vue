<template>
  <p class="points-container">{{ value }}<MiniPoint class="mini-point" /></p>
</template>
<script>
import MiniPoint from "@/assets/images/icon/point-white-mini.svg?inline";
export default {
  components: {
    MiniPoint,
  },
  props: {
    value: {
      type: [String, Number],
      default: "000",
    },
  },
};
</script>
<style lang="scss" scoped>
.points-container {
  display: flex;
  align-items: center;
}
.mini-point {
  width: 0.619rem;
  height: 0.619rem;
  margin-bottom: 2.0005px;
  margin-left: 0.1905rem;
  vertical-align: bottom;
  &__small {
    width: 0.5238rem;
    height: 0.5238rem;
    margin-left: 0.0952rem;
  }
}
</style>
