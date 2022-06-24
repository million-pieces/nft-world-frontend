<template>
  <div class="card">
    <div class="card-body rounded-lg">
      <div v-if="address && isEditAvailable" class="text-right pr-2">
        <button class="border-0 bg-transparent opacity-3" @click="handleProfilePopup">
          <EditIcon />
        </button>
      </div>
      <div v-if="address" class="text-center">
        <div class="col-5 col-xl-5 col-md-4 p-0 m-auto">
          <div class="square-block rounded-circle bg-primary-gradient">
            <img v-if="address" class="square-img p-2 rounded-circle" :src="userAvatar || $identicon(address)" />
          </div>
        </div>
        <h3 class="mt-3 text-bigger text-dark text-capitalize">
          {{ user.name }}
        </h3>
        <copy-link :address="address" />
      </div>
      <div v-if="user.socials" class="social-links">
        <div v-for="(social, index) in socials" :key="index" target="_blank">
          <a v-if="user.socials[social.title]" :href="user.socials[social.title]" target="_blank">
            <img :src="social.icon" />
          </a>
        </div>
      </div>
      <div class="card-body-block">
        <div class="bg-primary-gradient mb-4 rounded padding-1">
          <div class="text-left bg-white rounded p-3">
            <p class="text-middle text-dark text-uppercase m-0 mb-1">Segments Owned</p>
            <h3 class="text-bigest text-dark m-0">{{ user.totalSegments }}</h3>
          </div>
        </div>
        <div class="d-sm-flex justify-content-around text-left">
          <div class="bg-dark-secondary w-100 rounded p-3">
            <p class="text-middle text-dark m-0 text-uppercase">Claimable PIECE</p>
            <h3 class="text-bigest text-dark m-0">
              {{ user.claimablePiece }}
              PIECE
            </h3>
          </div>
          <!-- <div class="bg-dark-secondary w-100 rounded p-3">
            <p class="text-middle text-dark text-uppercase m-0 mb-1">For Sale</p>
            <h3 class="text-bigest text-dark m-0">{{ user.segmentsForSale }}</h3>
          </div> -->
        </div>
        <a v-if="isEditAvailable && provider === 'injected'" class="add-pieces-btn" @click="addPieceTokens">Add PIECE to MetaMask</a>
      </div>
    </div>
  </div>
</template>
<script>
import EditIcon from "@/assets/images/icon/edit.svg?inline";

export default {
  components: {
    EditIcon,
  },
  props: {
    user: {
      type: Object,
      required: true,
    },
    address: {
      type: String,
      default: null,
    },
    isEditAvailable: {
      type: Boolean,
      default: false,
    },
    socials: {
      type: Array,
      default: null,
      required: false,
    },
  },
  data() {
    return {
      provider: null,
    };
  },
  computed: {
    userAvatar() {
      if (this.user.avatar) {
        return process.env.SERVER_URL + "/files/users/avatars/" + this.user.avatar;
      } else {
        return false;
      }
    },
  },
  async mounted() {
    this.provider = await this.$localForage.getItem("provider");
  },
  methods: {
    handleProfilePopup() {
      this.$nuxt.$emit("openProfilePopup", this.socials, this.user);
    },
    async addPieceTokens() {
      await this.$addPieceTokens();
    },
  },
};
</script>

<style lang="scss" scoped>
.card {
  color: #9ba9ba;
  letter-spacing: 0.04em;
  border-radius: 1.875rem;
  box-shadow: 0 0 4rem rgba(255, 255, 255, 0.07);
  @include media-breakpoint-up(xl) {
    min-width: 22.5rem;
  }
  @include media-breakpoint-up(xxl) {
    min-width: 24.5rem;
  }
  &-body {
    box-shadow: 0 0 4rem rgba(3, 9, 53, 0.06);
  }
}
.square-block.bg-primary-gradient {
  background: linear-gradient(
    74.53deg,
    rgba($primary, 0.15) 0.04%,
    rgba($info, 0.15) 27.39%,
    rgba($pink, 0.15) 58%,
    rgba($danger, 0.15) 90.58%
  );
}
.border {
  border: 2px solid #2d244b !important;
}
.social-links {
  display: flex;
  justify-content: center;
  margin: 1.25rem 0;
  div {
    &:not(:last-child) {
      a {
        display: block;
        margin-right: 0.9375rem;
      }
    }
  }
  img {
    height: 1.5625rem;
  }
}
.add-pieces-btn {
  display: inline-block;
  width: 100%;
  margin: 1.25rem auto 0;
  padding: 0;
  color: transparent;
  text-align: center;
  background: linear-gradient(74.53deg, #d4504b 0.04%, #a82acc 27.39%, #792ee7 58%, #2771e9 90.58%);
  background-size: 200% auto;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -ms-background-clip: text;
  background-clip: text;
  border: none;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
  -ms-text-fill-color: transparent;
  text-fill-color: transparent;
}
</style>
