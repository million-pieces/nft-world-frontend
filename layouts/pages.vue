<template>
  <div id="app-secondary" class="app-secondary">
    <app-navbar :account="true" />

    <nuxt />

    <unlock-popup />

    <list-popup />

    <transfer-popup />

    <profile-popup />

    <about-popup />
  </div>
</template>
<script>
import {mapGetters, mapActions} from "vuex";
import user from "@/mixins/user";

export default {
  mixins: [user],
  data() {
    return {
      isOpenSocialPopup: false,
    };
  },

  computed: {
    ...mapGetters({
      claims: "auth/claims",
      refClaims: "auth/refClaims",
    }),
  },

  created() {
    this.$nuxt.$on("openSocialPopup", () => {
      this.isOpenSocialPopup = true;
    });
  },
  mounted() {
    this.autoLogin();
  },

  beforeDestroy() {
    this.$nuxt.$off("openSocialPopup");
  },

  methods: {
    ...mapActions({
      login: "auth/login",
    }),

    openSocialPopup() {
      this.isOpenSocialPopup = true;
    },
  },
};
</script>
