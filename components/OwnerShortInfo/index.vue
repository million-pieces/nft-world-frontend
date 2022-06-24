<template>
  <div v-if="theme === 'segmentPopup'" class="owner">
    <img :src="avatar" class="owner__avatar" />
    <div class="owner__main-info text-dotted-overflow">
      <span class="font-mont-bold text-white" :title="ownerData.name">{{ ownerData.name || "No nickname" }}</span>
      <div v-if="ownerData.address" class="text-white text-left opacity-3 text-small address-container">
        <CopyLink :address="ownerData.address" :color="'white'" />
      </div>
    </div>
  </div>
  <div v-else class="owner">
    <img :src="avatar" alt="avatar" class="owner__avatar" />
    <div class="owner__title">Owner</div>
    <div class="owner__name">{{ ownerData.name || ownerData.address }}</div>
  </div>
</template>

<script>
export default {
  props: {
    ownerData: {type: Object, default: null},
    theme: {type: String, default: "default"},
  },
  computed: {
    avatar() {
      return this.ownerData.avatar
        ? `${process.env.SERVER_URL}/files/users/avatars/${this.ownerData.avatar}`
        : this.$identicon(this.ownerData.address || "123456789012345");
    },
  },
};
</script>

<style lang="scss" scoped>
.owner {
  display: grid;
  grid-gap: 0.375rem 0.5rem;
  grid-template-rows: repeat(2, auto);
  grid-template-columns: 2.375rem auto;

  &__avatar {
    grid-row: 1/3;
    width: 2.375rem;
    height: 2.375rem;
    object-fit: cover;
    object-position: center;
    border-radius: 50%;
  }

  &__title {
    font-weight: 600;
    font-size: 0.8125rem;
    line-height: 1rem;
  }

  &__name {
    position: relative;
    z-index: 2;
    max-width: 100%;
    overflow: hidden;
    color: #ffffff;
    font-size: 1rem;
    line-height: 1rem;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
}
</style>
