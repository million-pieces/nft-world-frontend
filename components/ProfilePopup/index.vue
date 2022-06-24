<template>
  <transition name="fade">
    <div v-show="isOpenProfilePopup">
      <div class="modal d-block" @click.self="closeProfilePopup">
        <div class="modal-content ever-modal-unlock bg-white">
          <div class="modal-header ever-modal-header text-center">
            <h3 class="font-weight-bold mx-auto pt-2">Edit Profile</h3>
            <button type="button" class="close" @click="closeProfilePopup">
              <CloseIcon />
            </button>
          </div>
          <form action="" method="post" @submit.prevent="saveData($event)">
            <div class="img-block px-2 mb-4 position-relative">
              <input id="profileImg" type="file" class="d-none" accept="image/x-png,image/jpeg" name="image" @change="setPreview($event)" />
              <label for="profileImg" class="mt-3 square-block edit-img rounded-circle cursor-pointer">
                <EditIcon class="square-img w-50" />
              </label>
              <img v-if="address" class="avatar p-2 rounded-circle mx-auto" :src="previewImg || userAvatar || $identicon(address)" />
            </div>
            <div class="px-5">
              <input v-model="formData.name" type="text" class="input w-100" placeholder="Name" name="username" />
            </div>
            <div class="w-100 px-5 my-4">
              <h4 class="mb-3">Social links:</h4>
              <div v-for="(social, index) in socials" :key="index" class="social-item">
                <img :src="social.icon" />
                <input v-model="formData.socials[social.title]" type="url" class="input" />
              </div>
            </div>
            <div class="mb-4">
              <button type="submit" class="btn btn-apply bg-primary-gradient m-auto">Save</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </transition>
</template>
<script>
import user from "@/mixins/user";
import EditIcon from "@/assets/images/icon/edit.svg?inline";
import CloseIcon from "@/assets/images/icon/close.svg?inline";

export default {
  components: {
    EditIcon,
    CloseIcon,
  },
  mixins: [user],
  data() {
    return {
      previewImg: "",
      formData: {},
      isOpenProfilePopup: false,
      socials: [],
      userData: {},
    };
  },
  computed: {
    userAvatar() {
      if (this.userData.avatar) {
        return process.env.SERVER_URL + "/files/users/avatars/" + this.userData.avatar;
      } else {
        return false;
      }
    },
  },
  watch: {
    isOpenProfilePopup() {
      this.previewImg = "";
    },
    userData(data) {
      this.formData = data;
    },
  },
  created() {
    this.$nuxt.$on("openProfilePopup", (socials, user) => {
      this.socials = socials;
      this.userData = user;
      this.isOpenProfilePopup = true;
    });
  },
  mounted() {
    this.formData = this.userData;
  },
  destroyed() {
    this.$nuxt.$off("openProfilePopup");
  },
  methods: {
    closeProfilePopup() {
      this.isOpenProfilePopup = false;
    },
    setPreview(e) {
      const [file] = e.target.files;
      if (file) {
        this.previewImg = URL.createObjectURL(file);
      }
    },
    async saveData(event) {
      const newUserData = {
        username: this.formData.name,
        socials: this.formData.socials,
      };

      try {
        // upload avatar
        if (this.previewImg) {
          const imgData = new FormData(event.target);

          await this.$axios.$put(`${process.env.SERVER_URL}/user/${this.address}/avatar`, imgData, {
            headers: {
              "Content-Type": "multipart/form-data",
              "Wallet-Address": this.address,
              Signature: this.signature,
            },
          });
        }
        // name & socials
        await this.$axios.$put(`${process.env.SERVER_URL}/user/${this.address}`, newUserData, this.requestConfig);
      } catch (error) {
        console.error(error);
        alert("INTERNAL ERROR");
      } finally {
        this.closeProfilePopup();
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.modal {
  position: fixed;
  width: 100%;
  height: 100%;
  background: rgba(255, 255, 255, 0.479);
}

.modal-content {
  top: 50%;
  max-width: 29.5rem;
  margin: 0 auto;
  background: transparent;
  border: 1px solid $dark-secondary;
  transform: translateY(-50%);
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

.edit-img {
  position: absolute;
  right: 0.625rem;
  bottom: 0;
  z-index: 2;
  width: 2rem;
  background: #81849a;
  border: 2px solid #fff;
  path {
    stroke: #fff;
  }
}
.avatar {
  width: 5.9375rem;
  height: 5.9375rem;
  object-fit: cover;
  object-position: center;
}
.img-block {
  display: inline-flex;
  margin-left: 50%;
  transform: translateX(-50%);
}

.social-item {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1.25rem;
  img {
    position: absolute;
    top: 50%;
    left: 0.625rem;
    height: 1.5625rem;
    margin-right: 1.25rem;
    transform: translateY(-50%);
  }

  .input {
    flex: auto;
    padding-left: 3.125rem;
  }
}
</style>
