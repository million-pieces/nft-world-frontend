<template>
  <article v-if="topHolderData" class="top-holder">
    <img :src="avatar" alt="avatar" class="top-holder__avatar" />
    <strong class="top-holder__username">{{ topHolderData.name ? topHolderData.name : topHolderData.walletAddress }}</strong>
    <div class="top-holder__rang text-gradient-primary">{{ rang }}</div>
    <div class="top-holder__address">
      <copy-link :address="topHolderData.walletAddress" :color="'white'" />
    </div>
    <div class="top-holder__delimiter"></div>
    <div class="top-holder__segments-count">
      <span>SEGMENTS OWNED</span>
      <b>{{ topHolderData.segmentsAmount }}</b>
    </div>
  </article>
  <article v-else class="top-holder skeleton"></article>
</template>

<script>
export default {
  props: {
    topHolderData: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      userPopulationStatus: {
        0: "Emperor", // Owns country
        1: "Imperialist", // 100 >= segments
        2: "Conquerer", // 30 => segments
        3: "Lord", // 10=> segments
        4: "Settler", // >= 5 segments
        5: "Landowner", // < 5 segments
      },
    };
  },
  computed: {
    avatar() {
      return this.topHolderData.avatar
        ? `${process.env.SERVER_URL}/files/users/avatars/${this.topHolderData.avatar}`
        : this.$identicon(this.topHolderData.walletAddress);
    },
    rang() {
      if (this.topHolderData.status == null) {
        return "";
      }
      return this.userPopulationStatus[this.topHolderData.status];
    },
  },
};
</script>

<style lang="scss" scoped>
.top-holder {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2rem 0.625rem;
  text-align: center;
  background: $slide-bg-color;
  border: 0.0625rem solid rgba(255, 255, 255, 0.16);
  border-radius: 0.5rem;

  &.skeleton {
    width: 100%;
    padding-bottom: 150%;
  }

  &__avatar {
    width: 5.5rem;
    height: 5.5rem;
    object-fit: cover;
    object-position: center;
    border-radius: 50%;
  }

  &__username {
    max-width: 100%;
    margin-top: 1.5rem;
    overflow: hidden;
    color: #fff;
    font-weight: 600;
    font-size: 1rem;
    line-height: 1rem;
    white-space: nowrap;
    text-overflow: ellipsis;
  }

  &__rang {
    margin-top: 0.5rem;
    font-weight: 500;
    font-size: 1rem;
    line-height: 1rem;
    letter-spacing: 0.04rem;
    text-transform: capitalize;
  }

  &__address {
    margin-top: 0.5rem;
  }

  &__delimiter {
    width: 8.3125rem;
    height: 1px;
    margin: 1rem 0;
    background: rgba(255, 255, 255, 0.6);
  }

  &__segments-count {
    color: rgba(255, 255, 255, 0.6);
    font-weight: 500;
    font-size: 0.875rem;
    line-height: 1.5rem;

    b {
      display: block;
      margin-top: 0.25rem;
      color: #ffffff;
      font-weight: inherit;
      font-size: 2.5rem;
      line-height: 1;
      letter-spacing: 0.25rem;
    }
  }
}
</style>
