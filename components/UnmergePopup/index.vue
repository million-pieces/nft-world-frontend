<template>
  <div class="unmerge-popup">
    <div class="unmerge-popup__bg" @click="closePopup()"></div>
    <div class="unmerge-popup__content">
      Do you really want to split this segment ?
      <div class="unmerge-popup__actions">
        <app-loader v-if="unmergeLoading"></app-loader>
        <button v-else class="btn bg-primary-gradient border-0 text-white" @click="unmerge()">Split</button>
        <button class="btn text-white unmerge-popup__cancel-btn" @click="closePopup()">Cancel</button>
      </div>
    </div>
  </div>
</template>

<script>
import user from "@/mixins/user";

export default {
  mixins: [user],
  props: {
    segmentId: {
      type: Number,
      default: null,
      required: false,
    },
  },
  data() {
    return {
      unmergeLoading: false,
    };
  },
  methods: {
    closePopup() {
      this.$emit("popup-closed", false);
    },

    async unmerge() {
      this.unmergeLoading = true;
      await this.$axios.$delete(`${process.env.SERVER_URL}/segments-merged/${this.segmentId}`, this.requestConfig);
      this.unmergeLoading = false;
      this.$emit("popup-closed", true);
    },
  },
};
</script>

<style lang="scss" scoped>
.unmerge-popup {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100vh;

  &__bg {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.356);
  }

  &__content {
    position: relative;
    z-index: 1;
    box-sizing: border-box;
    padding: 1.5rem;
    padding-top: 2.5625rem;
    color: #fff;
    background: #040a33;
    border: 1px solid #5a5f74;
    border-radius: 0.625rem;
  }

  &__actions {
    display: flex;
    justify-content: space-between;
    margin-top: 1.9375rem;

    button {
      width: calc(50% - 0.5rem);
      border-radius: 0.625rem;
    }
  }

  &__cancel-btn {
    border: 1px solid #ffffff;

    &:hover {
      background-color: rgba(236, 37, 37, 0.637);
    }
  }
}
</style>
