<template>
  <transition name="fade">
    <div v-if="value">
      <div class="modal d-block" @click.self="$emit('input', false)">
        <div class="modal-dialog px-2">
          <div class="modal-content ever-modal-unlock bg-white">
            <div class="modal-header ever-modal-header text-center">
              <p class="font-weight-bold mx-auto pt-2">Add Link</p>

              <button type="button" class="close" @click="$emit('input', false)">
                <CloseIcon />
              </button>
            </div>
            <form action="" method="post">
              <div class="modal-body table-responsive p-0 w-75">
                <div v-for="(social, index) in socials" :key="index" class="d-flex mb-4">
                  <img :src="social" class="mr-4" />
                  <input type="text" :name="index" class="form-control" :placeholder="index + ' Link'" />
                </div>
              </div>
              <div class="my-5">
                <button type="submit" class="btn btn-apply bg-primary-gradient m-auto">Add</button>
              </div>
            </form>
          </div>
        </div>
      </div>
      <div class="modal-backdrop show"></div>
    </div>
  </transition>
</template>
<script>
import CloseIcon from "@/assets/images/icon/close.svg?inline";
import Facebook from "@/assets/images/icon/facebook-dark.svg";
import Instagram from "@/assets/images/icon/instagram-dark.svg";
import Linkedin from "@/assets/images/icon/linkedin-dark.svg";

export default {
  components: {
    CloseIcon,
  },
  props: {
    value: {
      type: Boolean,
      required: true,
    },
  },
  data() {
    return {
      socials: {
        Facebook: Facebook,
        LinkedIn: Linkedin,
        Instagram: Instagram,
      },
    };
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
