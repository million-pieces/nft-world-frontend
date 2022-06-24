<template>
  <div class="base-toast text-white" :class="[isToastOpen ? 'active' : '']" @click="handleToast">{{ toastData.text }}</div>
</template>

<script>
export default {
  data() {
    return {
      isToastOpen: false,
      toastData: {
        text: "Game message for user",
      },
      toastClickHandler: null,
    };
  },
  created() {
    this.$nuxt.$on("openToast", (data, toastClickHandler) => {
      this.toastData = data;
      this.toastClickHandler = toastClickHandler;
      this.isToastOpen = true;
    });
  },
  updated() {
    setTimeout(() => (this.isToastOpen = false), 7000);
  },
  destroyed() {
    this.$nuxt.$off("openToast");
  },
  methods: {
    handleToast() {
      this.isToastOpen = false;
      this.toastClickHandler();
    },
  },
};
</script>
<style lang="scss" scoped>
.base-toast {
  position: fixed;
  top: 5.4762rem;
  right: 0;
  z-index: 1;
  display: block;
  min-width: 1.4286rem;
  padding: 0.3952rem 1rem 0.3904rem;
  font-weight: 400;
  font-size: 1rem;
  background: $popup_color;
  border-radius: 0.2381rem;
  transform: translateX(100%);
  cursor: pointer;
  transition: 0.3s;

  &.active {
    right: 1.1905rem;
    transform: translateX(0%);
    transition: 0.3s;
  }
}
</style>
