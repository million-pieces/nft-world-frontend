<template>
  <transition name="fade">
    <div v-if="value">
      <div class="modal d-block" @click.self="$emit('input', false)">
        <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content ever-modal-unlock p-3">
            <div class="container">
              <div class="row mb-2">
                <!-- Header -->
                <div class="col-lg-12 text-center">
                  <h3 class="notification-popup-header">{{ data.header }}</h3>
                </div>
                <!-- Content -->
                <div class="content-box">
                  <figure v-if="data.isPopupWithSegment" class="image-box">
                    <img :src="data.image" alt="card" />
                  </figure>
                  <div :class="[data.isPopupWithSegment ? '' : 'textCenter']" class="content-text-box">
                    <p class="content-text">
                      {{ data.text }}
                    </p>
                    <app-loader v-if="isLoading" class="loader"></app-loader>
                    <p v-if="data.isPopupWithSegment" class="country-box">
                      <span class="small-text">CounTRY</span>
                      <span> {{ data.country }}</span>
                    </p>
                  </div>
                </div>
                <!-- Button -->
                <div class="button-box">
                  <!-- Winner image upload form -->
                  <template v-if="data.isWinnerPopup">
                    <form class="w-100" action="" method="post" @submit.prevent="saveData($event)">
                      <div v-if="address" class="text-center"><img class="preview-img pb-4" :src="previewImg" /></div>
                      <div class="mb-2 form-buttons">
                        <input
                          id="profileImg"
                          type="file"
                          class="d-none"
                          accept="image/x-png,image/jpeg"
                          name="image"
                          @change="setPreview($event)"
                        />
                        <label
                          for="profileImg"
                          :class="[previewImg ? 'btn-border-primary-gradient' : 'bg-primary-gradient']"
                          class="btn btn-default text-white text-nowrap mr-2 form-label"
                        >
                          Upload
                        </label>
                        <button
                          type="submit"
                          :class="[previewImg ? 'bg-primary-gradient' : 'btn-border-primary-gradient disabled']"
                          class="btn btn-default text-white text-nowrap"
                        >
                          Save
                        </button>
                      </div>
                    </form>
                  </template>
                  <template v-else>
                    <!-- Button with function -->
                    <button
                      v-if="onNotificationAccept"
                      :class="[isLoading ? 'disabled' : '']"
                      class="btn bg-primary-gradient notification-popup-button"
                      @click="onAccept"
                    >
                      {{ data.buttonText }}
                      <span v-if="data.price">
                        <b>{{ data.price }}</b>
                        <img class="point-icon" src="~assets/images/icon/white-point-icon.svg" />
                      </span>
                    </button>
                    <!-- Button close -->
                    <button v-else class="btn bg-primary-gradient notification-popup-button" @click.self="$emit('input', false)">
                      {{ data.buttonText }}
                      <span v-if="data.price">
                        <b>{{ data.price }}</b>
                        <img class="point-icon" src="~assets/images/icon/white-point-icon.svg" />
                      </span>
                    </button>
                  </template>
                </div>
                <div v-if="data.note" class="note-box text-center mt-3">NOTE: {{ data.note }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="modal-backdrop show"></div>
    </div>
  </transition>
</template>

<script>
import user from "@/mixins/user";

export default {
  mixins: [user],
  props: {
    value: {
      type: Boolean,
      required: true,
    },
    data: {
      type: Object,
      default: () => ({
        isPopupWithSegment: false,
        isWinnerPopup: false,
        header: "Header text",
        text: "Game message for user",
        buttonText: "Back to conquest",
        note: "Notification",
        image: "",
      }),
    },
    onNotificationAccept: {
      type: Function,
      default: null,
      required: false,
    },
  },
  data() {
    return {
      isLoading: false,
      previewImg: "",
    };
  },
  methods: {
    async onAccept() {
      this.isLoading = true;
      await this.onNotificationAccept();
      this.$emit("input", false);
      this.isLoading = false;
    },
    setPreview(e) {
      const [file] = e.target.files;
      if (file) {
        this.previewImg = URL.createObjectURL(file);
      }
    },

    async saveData(event) {
      try {
        if (this.previewImg) {
          const imgData = new FormData(event.target);
          await this.$axios.$put(process.env.SERVER_GAME_URL + "/api/game/current-game/image", imgData, {
            headers: {
              "Content-Type": "multipart/form-data",
              "Wallet-Address": this.address,
              Signature: this.signature,
            },
          });
          this.$nuxt.$emit("upload-winner-image");
        }
      } catch (error) {
        console.error(error);
        alert(error.response.data.error);
      } finally {
        this.$emit("input", false);
      }
    },
  },
};
</script>

<style src="./index.scss" lang="scss" scoped></style>
