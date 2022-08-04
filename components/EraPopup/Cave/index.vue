<template>
  <div v-if="cave != null" class="era-popup__cave">
    <figure class="cave__logo-container" :class="isOwner ? '' : 'mb-0'">
      <Cave />
      <figcaption class="cave__logo-description">Cave {{ caveNum }}</figcaption>
    </figure>
    <div class="era-popup__cave-container">
      <div v-if="isOwner" class="cave__income-container">
        <p class="base-text__white_muffled">Daily income</p>
        <EraPieceValue :value="cave.totalReward" />
      </div>
      <EraVillagersAmount :value="cave.totalCitizens" :max-value="maxCitizens" />

      <EraPopupCaveOwnerInfo v-if="isOwner" :cave="cave" :max-citizens="maxCitizens" />
      <EraPopupCaveResidentInfo v-else :segment-id="segmentId" :coordinate="coordinate" :cave="cave" :max-citizens="maxCitizens" />
    </div>
  </div>
  <div v-else-if="isOwner" class="era-popup__create-cave-container">
    <div class="era-popup__create-cave" @click="() => buildCave(caveNum)">
      <AppLoader v-if="isLoading" class="app-loader" />
      <div class="create-cave__header-box">
        <h6 class="text-gradient-primary create-cave__header">Create cave</h6>
        <p><span class="text-gradient-primary">1800</span><MiniPointGradient class="mini-point" /></p>
      </div>
      <p>Income: 200 tokens per each resident every 24 hours</p>
      <CreateCaveBg class="create-cave__bg" />
    </div>
  </div>
</template>
<script>
import Cave from "@/assets/images/icon/cave.svg?inline";
import MiniPointGradient from "@/assets/images/icon/mini-point-gradient.svg?inline";
import CreateCaveBg from "@/assets/images/create-cave-bg.svg?inline";
import user from "@/mixins/user";

export default {
  components: {
    Cave,
    MiniPointGradient,
    CreateCaveBg,
  },
  mixins: [user],
  props: {
    segmentId: {
      type: [String, Number],
      required: true,
    },
    cave: {
      type: [Object, Boolean],
      default: null,
    },
    caveNum: {
      type: [String, Number],
      required: true,
    },
    isOwner: {
      type: Boolean,
      default: false,
    },
    coordinate: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      maxCitizens: 4,
      isLoading: false,
    };
  },
  methods: {
    async buildCave(caveNum) {
      try {
        this.isLoading = true;
        await this.$axios.$post(`${process.env.SERVER_URL}/game/cave/${this.coordinate}/build?position=${caveNum}`, {}, this.requestConfig);
        this.$nuxt.$emit("update-era-popup-data");
        this.$nuxt.$emit("update-era-user-data");
      } catch (error) {
        const notificationData = {
          header: error.message,
          buttonText: "Close",
        };
        if (error.response?.data?.error) {
          notificationData.header = error.response.data.error;
        }
        this.$nuxt.$emit("openGamePopup", notificationData);
      } finally {
        this.isLoading = false;
      }
    },
  },
};
</script>
<style lang="scss" scoped src="./index.scss"></style>
