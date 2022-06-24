<template>
  <div v-show="transactionPopupStatus !== 'HIDDEN'">
    <div class="modal show">
      <div class="modal-dialog px-2">
        <div class="modal-content">
          <div class="modal-header justify-content-end">
            <button type="button" class="close" @click="closeTransactionPopup">
              <IconTransactionClose />
            </button>
          </div>
          <div class="modal-body text-center pb-5 mb-4">
            <h6 class="font-weight-bold">
              {{ title }}
            </h6>
            <p class="modal-body-text mb-5">
              {{ message }}
            </p>
            <img v-if="transactionPopupStatus === 'SUCCESS'" src="~/assets/images/transaction-success.svg" />
            <img v-else src="~/assets/images/transaction-pending.svg" class="spin" />
          </div>
        </div>
      </div>
      <button
        class="modal-backdrop fade border-0"
        :class="{'backdrop-show': transactionPopupStatus}"
        type="button"
        @click="closeTransactionPopup"
      />
    </div>
  </div>
</template>

<script>
import IconTransactionClose from "@/assets/images/icon/transaction-close.svg?inline";

const MESSAGES = {
  HIDDEN: {
    title: null,
    text: null,
  },
  CONFIRMING: {
    title: "Pending Confirmation",
    text: "Please confirm the popped up transaction...",
  },
  PENDING: {
    title: "Pending Confirmation",
    text: "Please wait for the transaction to confirm...",
  },
  SUCCESS: {
    title: "Transaction Confirmed",
    text: "Transaction successfully confirmed!",
  },
};

export default {
  components: {
    IconTransactionClose,
  },
  data() {
    return {
      transactionPopupStatus: "HIDDEN",
    };
  },
  computed: {
    title() {
      return MESSAGES[this.transactionPopupStatus].title;
    },
    message() {
      return MESSAGES[this.transactionPopupStatus].text;
    },
  },
  created() {
    this.$nuxt.$on("toggleTransactionPopup", (status) => {
      this.transactionPopupStatus = status;
    });
  },
  destroyed() {
    this.$nuxt.$off("toggleTransactionPopup");
  },
  methods: {
    closeTransactionPopup() {
      this.transactionPopupStatus = "HIDDEN";
    },
  },
};
</script>

<style src="./index.scss" lang="scss" scoped></style>
