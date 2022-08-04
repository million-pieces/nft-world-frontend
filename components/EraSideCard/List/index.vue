<template>
  <div class="side-list">
    <h6 class="side-list__header text-white">{{ isOwner ? "Segment" : "Resident" }} list</h6>
    <div v-for="segment in segments" :key="segment.id">
      <EraSideCardListItem :is-owner="isOwner" :segment="segment" />
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
    segments: {
      type: Array,
      default: () => [],
    },
  },
};
</script>
<style lang="scss" scoped>
.side-list {
  &__header {
    margin-bottom: 1.1429rem;
  }
}
</style>
