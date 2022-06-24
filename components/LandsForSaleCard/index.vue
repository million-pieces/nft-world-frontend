<template>
  <article v-if="cardData" class="card">
    <div class="card__img">
      <img v-if="cardData.country" :src="segmentImg" alt="" />
      <img v-else src="@/assets/images/segment-image-placeholder.jpg" alt="segment placeholder" />
    </div>
    <table class="card__bottom">
      <thead>
        <tr>
          <th>Country</th>
          <th>ID</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>{{ cardData.country }}</td>
          <td>{{ cardData.coordinates }}</td>
        </tr>
      </tbody>
    </table>
    <a :href="cardData.link" target="_blank" class="btn bg-primary-gradient border-0 text-white card__buy-btn">
      Buy for {{ cardData.price }} ETH
    </a>
  </article>
  <article v-else class="card skeleton"></article>
</template>

<script>
import user from "@/mixins/user";

export default {
  mixins: [user],
  props: {
    cardData: {
      type: Object,
      required: false,
      default: null,
    },
  },
  data() {
    return {
      avatar: null,
    };
  },

  computed: {
    segmentImg() {
      const country = this.cardData.country.replace(" ", "_");
      return `${process.env.SERVER_URL}/images/${country}.jpg`;
    },
  },
  methods: {
    connectWallet() {
      this.$nuxt.$emit("openUnlockPopup");
    },
  },
};
</script>

<style lang="scss" scoped>
.card {
  box-sizing: border-box;
  padding: 0.75rem;
  background: transparent;
  border: 0.0625rem solid rgba(255, 255, 255, 0.16);
  border-radius: 0.5rem;

  &.skeleton {
    width: 100%;
    padding-bottom: 150%;
  }

  &__img {
    position: relative;
    width: 100%;
    padding-bottom: 150%;
    overflow: hidden;
    border-radius: 0.5rem;

    img {
      position: absolute;
      top: -2%;
      left: -2%;
      width: 104%;
      height: 104%;
      object-fit: cover;
      object-position: center;
    }
  }

  &__bottom {
    margin-top: 1rem;

    th {
      color: #ffffff88;
      font-weight: 600;
      font-size: 0.8125rem;
      line-height: 1rem;
      letter-spacing: -0.0313rem;
    }

    td {
      padding-top: 0.375rem;
      color: #ffffff;
      font-weight: 600;
      font-size: 1rem;
      line-height: 1rem;
    }
  }

  &__buy-btn {
    margin-top: 1rem;
    padding: 0.75rem;
    font-weight: 500;
    font-size: 1.0625rem;
    line-height: 144%;
    letter-spacing: 0.04em;
    border-radius: 0.5rem;
  }
}
</style>
