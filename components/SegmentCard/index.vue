<template>
  <article v-if="cardData" class="card" :class="mode">
    <div class="card__img">
      <img v-if="hasImage && !isPlaceholderActive" :src="segmentImg" alt="segment image" @error="activatePlaceholder" />
      <img v-else src="@/assets/images/segment-image-placeholder.jpg" alt="segment placeholder" />
    </div>
    <div class="card__bottom">
      <div v-if="cardData.walletAddress" class="card__owner">
        <owner-short-info :owner-data="owner"></owner-short-info>
        <div class="card__owner-address">
          <copy-link :key="cardData.walletAddress" :address="cardData.walletAddress" :color="'white'" />
        </div>
      </div>
      <div v-if="mode === 'largest-area'" class="card__segments-count-wrap bg-primary-gradient">
        <div class="card__segments-count">
          SEGMENTS <br />
          <b>{{ cardData.segmentsAmount }}</b>
        </div>
      </div>
      <div v-if="mode === 'new-purchase'" class="card__column">
        <div class="card__column-head">ID</div>
        <div class="card__column-cell">{{ cardData.coordinate }}</div>
      </div>
    </div>
  </article>
  <article v-else class="card skeleton"></article>
</template>

<script>
export default {
  props: {
    cardData: {
      type: Object,
      default: () => {},
      required: false,
    },
    mode: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      isPlaceholderActive: false,
      avatar: null,
      useImgPlaceholder: false,
    };
  },
  computed: {
    owner() {
      return {
        name: this.cardData.owner,
        address: this.cardData.walletAddress,
        avatar: this.cardData.avatar,
      };
    },
    hasImage() {
      if (this.mode === "new-image" || this.mode === "new-purchase") {
        return true;
      }

      return this.cardData.hasImage;
    },
    segmentImg() {
      if (this.mode === "largest-area") {
        return `${process.env.SERVER_URL}/files/merged-segments/images/${this.cardData.id}.jpeg`;
      }

      if (this.mode === "new-image") {
        return `${process.env.SERVER_URL}/files/log-images/${this.cardData.image}`;
      }

      if (this.mode === "new-purchase") {
        const country = this.cardData.country.replace(" ", "_");
        return `${process.env.SERVER_URL}/images/${country}.jpg`;
      }

      return null;
    },
  },
  methods: {
    activatePlaceholder() {
      this.isPlaceholderActive = true;
    },
  },
};
</script>

<style lang="scss" scoped>
.card {
  box-sizing: border-box;
  padding: 0.75rem;
  background: #2b2b2b;
  border: 0.0625rem solid rgba(255, 255, 255, 0.16);
  border-radius: 0.5rem;

  &.skeleton {
    width: 100%;
    padding-bottom: 130%;
  }

  &.new-image {
    .card {
      &__bottom {
        display: block;
      }
    }
  }

  &.new-purchase {
    .card {
      &__img {
        padding-bottom: 140%;

        img {
          top: -2%;
          left: -2%;
          width: 104%;
          height: 104%;
        }
      }

      &__bottom {
        grid-template-columns: 3fr 1fr;

        .card__column {
          justify-self: end;
          padding-right: 1rem;
        }
      }
    }
  }

  &__img {
    position: relative;
    width: 100%;
    padding-bottom: 100%;
    overflow: hidden;
    border-radius: 0.5rem;

    img {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      object-fit: cover;
      object-position: center;
    }
  }

  &__bottom {
    display: grid;
    grid-column-gap: 1.5rem;
    grid-template-columns: 3fr 2fr;
    justify-content: space-between;
    margin-top: 1rem;
  }

  &__owner-address {
    position: relative;
    z-index: 1;
    margin-top: 1rem;
    font-size: 0.875rem;
    line-height: 1.5rem;
    opacity: 0.45;

    &:hover {
      z-index: 3;
      opacity: 1;
    }
  }

  &__segments-count-wrap {
    padding: 0.125rem;
    border-radius: 0.5rem;
  }

  &__segments-count {
    width: 100%;
    height: 100%;
    padding-top: 0.25rem;
    color: rgba(255, 255, 255, 0.6);
    font-weight: 500;
    font-size: 0.875rem;
    line-height: 1.5rem;
    text-align: center;
    background: $slide-bg-color;
    border-radius: 0.375rem;

    b {
      color: #ffffff;
      font-weight: 500;
      font-size: 2.25rem;
      line-height: 2.5rem;
      letter-spacing: 0.0625rem;
    }
  }

  &__column {
    font-weight: 600;
  }

  &__column-head {
    color: #ffffff7e;
    font-size: 0.8125rem;
    line-height: 1rem;
    letter-spacing: -0.0313rem;
  }

  &__column-cell {
    margin-top: 0.375rem;
    color: #ffffff;
    font-size: 1rem;
    line-height: 1rem;
  }
}
</style>
