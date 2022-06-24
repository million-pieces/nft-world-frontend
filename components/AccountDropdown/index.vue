<template>
  <div v-click-outside="handleOutside" class="position-relative">
    <div class="cursor-pointer" @click="handleAccaunt">
      <img :src="avatar || $identicon(address)" class="user-avatar mr-2 rounded-circle" />
      <span class="text-white text-color border-bottom border-primary-gradient user-address">
        {{ normalizedAddress }}
      </span>
    </div>
    <transition name="fade">
      <ul v-if="dropDownVisible" class="drop-down list-unstyled mb-0">
        <li>
          <nuxt-link :to="'/account/'" class="text-white text-color">Account</nuxt-link>
        </li>
        <li>
          <button class="btn btn-border-primary-gradient btn-default text-white text-nowrap" @click="logOut">Log out</button>
        </li>
      </ul>
    </transition>
  </div>
</template>
<script>
import user from "@/mixins/user";

export default {
  mixins: [user],
  props: {
    userData: {
      type: Object,
      default: () => {
        return {};
      },
      require: false,
    },
  },
  data() {
    return {
      dropDownVisible: false,
    };
  },
  computed: {
    avatar() {
      if (this.userData.avatar) {
        return `${process.env.SERVER_URL}/files/users/avatars/${this.userData.avatar}`;
      } else {
        return false;
      }
    },
    normalizedAddress() {
      return `${this.address.slice(0, 5)}....${this.address.slice(-3, this.address.length)}`;
    },
  },
  methods: {
    handleAccaunt() {
      this.dropDownVisible = !this.dropDownVisible;
    },
    handleOutside() {
      this.dropDownVisible = false;
    },
  },
};
</script>
<style lang="scss" scoped>
.drop-down {
  position: absolute;
  top: 3rem;
  right: 0;
  width: 100%;
  padding: 0.7619rem 0.381rem;
  background: rgba(0, 0, 0, 0.15);
  border-radius: $border-radius;
  box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
  -webkit-backdrop-filter: blur(4px);
  backdrop-filter: blur(2px);
  li {
    margin-bottom: 0.7rem;
    &:last-child {
      margin-bottom: 0;
    }
  }
}
.user-address {
  border-top: 0;
  border-right: 0;
  border-left: 0;
}
.user-avatar {
  width: 1.5625rem;
  height: 1.5625rem;
  @include media-breakpoint-up(sm) {
    width: 2.2857rem;
    height: 2.2857rem;
  }
}
</style>
