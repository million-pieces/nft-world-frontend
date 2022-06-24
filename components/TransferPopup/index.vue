<template>
  <transition name="fade">
    <div v-if="isOpenTransferPopup">
      <div class="modal d-block" @click.self="closeTransferPopup">
        <div class="modal-dialog px-2">
          <div class="modal-content ever-modal-unlock bg-white">
            <div class="modal-header ever-modal-header text-center">
              <p class="font-weight-bold mx-auto pt-2">Transfer</p>
              <button type="button" class="close" @click="closeTransferPopup">
                <CloseIcon />
              </button>
            </div>
            <div class="modal-body table-responsive p-0 w-75">
              <input type="text" class="form-control" placeholder="Add Address" />
            </div>
            <div class="my-5">
              <button type="button" class="btn btn-apply bg-primary-gradient m-auto">Add</button>
            </div>
          </div>
        </div>
      </div>
      <div class="modal-backdrop show"></div>
    </div>
  </transition>
</template>

<script>
import CloseIcon from "@/assets/images/icon/close.svg?inline";

export default {
  components: {
    CloseIcon,
  },
  data() {
    return {
      isOpenTransferPopup: false,
    };
  },
  created() {
    this.$nuxt.$on("openTransferPopup", () => {
      this.isOpenTransferPopup = true;
    });
  },
  destroyed() {
    this.$nuxt.$off("openTransferPopup");
  },
  methods: {
    closeTransferPopup() {
      this.isOpenTransferPopup = false;
    },
  },
};
</script>

<style lang="scss" scoped>
.modal-content {
  top: 15.625rem;
  max-width: 29.5rem;
  margin: 0 auto;
  background: transparent;
  border: 1px solid $dark-secondary;
}

.modal {
  z-index: 9999;
}

.modal-backdrop {
  background: #fff;
}

.modal-body {
  margin: 0 auto;
}

.btn-apply {
  display: flex;
  padding: 0.667rem 4.3125rem;
  color: rgb(255, 255, 255);
  font-size: 1rem;
  border: none;
  border-radius: 0.625rem;
  -webkit-box-align: center;
  -webkit-box-pack: center;
}
.form-control {
  padding: 1.25rem;
}
</style>
