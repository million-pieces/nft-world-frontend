<template>
  <div id="app" class="background app">
    <picture class="app-bg">
      <source srcset="@/assets/images/main-page-bg.webp" type="image/webp" />
      <img src="@/assets/images/main-page-bg.png" alt="app background" />
    </picture>
    <div class="app-wrap">
      <app-navbar />
      <nuxt />

      <app-toast />

      <notification-popup v-model="isOpenNotificationPopup" :data="notificationPopupData" :on-notification-accept="onNotificationAccept" />

      <notification-popup v-model="isOpenJoinGamePopup" :data="joinGamePopupData" :on-notification-accept="handleGamejoin" />

      <unlock-popup />

      <list-popup />

      <transaction-popup />

      <about-popup />
    </div>
  </div>
</template>

<script>
import {mapActions} from "vuex";
import user from "@/mixins/user";

export default {
  mixins: [user],
  data() {
    return {
      isOpenJoinGamePopup: false,
      isOpenNotificationPopup: false,
      notificationPopupData: {},
      joinGamePopupData: {},
      handleGamejoin: null,
      onNotificationAccept: null,
    };
  },
  created() {
    if (this.$device.isMobile === true) {
      this.openMobilePopup();
    }
    this.$nuxt.$on("openGamePopup", (data, onNotificationAccept) => {
      this.isOpenNotificationPopup = true;
      this.notificationPopupData = data;
      this.onNotificationAccept = onNotificationAccept;
    });
    this.$nuxt.$on("openJoinGamePopup", (data, handleGamejoin) => {
      this.joinGamePopupData = data;
      this.handleGamejoin = handleGamejoin;
      this.isOpenJoinGamePopup = true;
    });
  },
  mounted() {
    this.autoLogin();
  },
  beforeDestroy() {
    this.$nuxt.$off("openGamePopup");
    this.$nuxt.$off("openJoinGamePopup");
  },
  methods: {
    ...mapActions({
      login: "auth/login",
    }),
    openMobilePopup() {
      this.isOpenNotificationPopup = true;
      this.notificationPopupData = {
        header: "Mobile version is in progress",
        text: "Please use the desktop version in Chrome (or Firefox) browser. Mobile adaptation is under development",
        buttonText: "Got it",
      };
    },
  },
};
</script>
