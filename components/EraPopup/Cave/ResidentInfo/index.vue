<template>
  <div class="resident-info">
    <div>
      <div v-if="cave.isResident" class="villager-cave">
        <p class="text-gradient-light">Available to claim</p>
        <EraPieceValue :value="cave.availableReward" />
      </div>
      <div v-else class="villager-cave">
        <p class="text-gradient-light">Daily residents income</p>
        <EraPieceValue :value="cave.dailyReward" />
      </div>

      <div v-if="cave.isResident" class="villager-cave">
        <EraRewardDanger v-if="cave.isRewardAvailable && cave.isMaxReward" />
        <div v-else-if="cave.isRewardAvailable">
          <p class="text-gradient-light">Daily residents income</p>
          <EraPieceValue :value="cave.availableReward" />
        </div>
        <div v-else>
          <p class="text-gradient-light">Your next reward</p>
          <p class="villager-cave__income-value d-flex">
            <EraPieceValue :value="cave.dailyReward" /> <b class="text-gradient-light mx-1"> in </b>
            {{ cave.nextRewardAt | normalizeDate }}
          </p>
        </div>
      </div>
    </div>
    <div v-if="isRoleLandOwner !== true">
      <button v-if="cave.totalCitizens >= 4" class="nft-era__button villager-view__income disabled nft-era__button_white text-white">
        cave is full
      </button>
      <button
        v-else-if="cave.isResident"
        class="nft-era__button villager-view__income nft-era__button text-white"
        :class="cave.availableReward > 0 ? '' : 'disabled'"
        @click="$nuxt.$emit('claimTokensByCoordinate', isRoleLandOwner, cave.caveId, true)"
      >
        claim rewards
      </button>
      <button
        v-else-if="!cave.isResident"
        class="nft-era__button villager-view__income nft-era__button_white text-white"
        @click="mintCitizen"
      >
        Settle here
      </button>
    </div>
  </div>
</template>
<script>
import {mapGetters} from "vuex";
import user from "@/mixins/user";
import helpers from "@/mixins/helpers";

export default {
  mixins: [user, helpers],
  props: {
    cave: {
      type: Object,
      default: () => {},
    },
    segmentId: {
      type: [String, Number],
      required: true,
    },
    coordinate: {
      type: String,
      required: true,
    },
  },
  computed: {
    ...mapGetters({
      userRole: "era/getUserRole",
    }),
    isRoleLandOwner() {
      return this.userRole === "OWNER";
    },
  },
  methods: {
    async mintCitizen() {
      if (this.address == null) {
        this.$nuxt.$emit("openUnlockPopup");
        return;
      }
      try {
        await this.$switchChainIdToPolygon();
        let gasAveragePrice = await this.$takeAveragePolygonGasPrice();
        let price = await this.$contracts.game().methods.tokenPrice().call();
        this.$nuxt.$emit("toggleTransactionPopup", "CONFIRMING");
        await this.$contracts
          .game()
          .methods.mintCitizen(this.segmentId, this.cave.caveId)
          .send({
            from: this.address,
            value: price,
            gasPrice: gasAveragePrice,
          })
          .on("transactionHash", () => {
            this.$nuxt.$emit("toggleTransactionPopup", "PENDING");
          });
        this.$nuxt.$emit("toggleTransactionPopup", "SUCCESS");
        this.settleInCave();
      } catch (err) {
        console.error(err);
        this.$nuxt.$emit("toggleTransactionPopup", "HIDDEN");
      }
    },
    async settleInCave() {
      try {
        await this.$axios.$post(`${process.env.SERVER_URL}/game/map`, null, this.requestConfig);
        this.showSettleNotification();
      } catch (error) {
        const notificationData = {
          header: error.message,
          buttonText: "Close",
        };
        if (error.response?.data?.error) {
          notificationData.header = error.response.data.error;
        }
        this.$nuxt.$emit("openGamePopup", notificationData);
      }
      return;
    },
    showSettleNotification() {
      const notificationData = {
        header: "You are placed in a cave.",
        text: " Please refresh the page in about a minute.",
        buttonText: "Close",
      };
      this.$nuxt.$emit("openGamePopup", notificationData);
    },
  },
};
</script>

<style lang="scss" src="~/components/EraPopup/Cave/index.scss" scoped></style>
