export default {
  data: () => ({
    isPopupVisible: false,
  }),

  watch: {
    isPopupVisible(isOpening) {
      this.$nuxt.$emit("call-side-card", isOpening);
      if (isOpening) this.$nuxt.$emit("close-other-sidebars", this.$vnode.tag);
    },
  },

  methods: {
    close() {
      this.isPopupVisible = false;
    },
  },

  mounted() {
    this.$nuxt.$on("close-other-sidebars", (emitter) => {
      const isSameComponent = this.$vnode.tag === emitter;
      if (!isSameComponent) this.isPopupVisible = false;
    });
  },

  beforeDestroy() {
    this.$nuxt.$off("close-other-sidebars");
  },
};
