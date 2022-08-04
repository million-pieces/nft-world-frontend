<template>
  <div class="cave__villagers-amount"><Villager /> {{ value }}/{{ maxValue }}</div>
</template>
<script>
import Villager from "@/assets/images/icon/villager.svg?inline";
export default {
  components: {
    Villager,
  },
  props: {
    value: {
      type: [Number, String],
      default: 0,
    },
    maxValue: {
      type: [Number, String],
      default: 0,
    },
  },
};
</script>
<style lang="scss" scoped>
.cave__villagers-amount {
  display: flex;
  align-items: flex-end;
  color: white;
  font-size: 0.7619rem;
  svg {
    width: auto;
    height: 0.875rem;
    margin-right: 0.4376rem;
    margin-bottom: 0.2857rem;
    vertical-align: bottom;
  }
}
</style>
