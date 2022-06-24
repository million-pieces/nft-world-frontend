<template>
  <li class="activity-card">
    <img v-if="user.avatar" class="activity-card__avatar rounded-circle" :src="user.avatar" width="56" height="56" />
    <div v-else class="activity-card__avatar activity-card__avatar_empty rounded-circle"></div>

    <div class="activity-card__activity-info">
      <p class="activity-card__action">
        <!-- User (Wallet ID) -->
        <nuxt-link v-if="activity.walletAddress" :to="`/account/${activity.walletAddress}`" class="activity-card__user-link">{{
          shortenAddress(activity.walletAddress)
        }}</nuxt-link>
        <span v-else> Somebody </span>

        {{ isActionWithin1Hour ? "just " : "" }}{{ activityTypes[activity.action] }}{{ prependPluralOrSingular }}

        <!-- Coordinates -->
        <transition name="fade">
          <span v-if="hideLongCoordinates" class="activity-card__coordinates-container">
            <span
              v-for="(coordinate, index) in activity.coordinates.slice(0, visibleCoordinates)"
              :key="`coordinate-${index}`"
              class="activity-card__coordinates"
            >
              <!-- prepend "and" if there are more than one coordinate -->
              {{ index === 0 ? "" : ", " }}
              <button class="activity-card__coordinate" :title="`Highlight ${coordinate} segment`" @click="highlightSegment(coordinate)">
                {{ coordinate }}
              </button>
            </span>
          </span>
          <span v-else>
            <span v-for="(coordinate, index) in activity.coordinates" :key="`coordinate-${index}`" class="activity-card__coordinates">
              <!-- prepend "and" if there are more than one coordinate -->
              {{ index === 0 ? "" : ", " }}
              <button class="activity-card__coordinate" :title="`Highlight ${coordinate} segment`" @click="highlightSegment(coordinate)">
                {{ coordinate }}
              </button>
            </span>
          </span>
        </transition>

        <span v-if="hiddenCoordinates > 0">
          <button
            v-if="hideLongCoordinates"
            class="activity-card__coordinates-container__toggle"
            title="Toggle hidden coordinates"
            @click="hideLongCoordinates = false"
          >
            ... + {{ hiddenCoordinates }} more
          </button>
          <button
            v-else
            class="activity-card__coordinates-container__toggle"
            title="Toggle hidden coordinates"
            @click="hideLongCoordinates = true"
          >
            hide
          </button>
        </span>
      </p>

      <!-- Timestamp -->
      <p class="activity-card__timestamp">{{ prettierTime }}</p>
    </div>

    <!-- Show image, if the image is added -->
    <div class="activity-card__change-in-image" :style="`backgroundImage: url('${changedToImage}');`">
      <!-- TODO: Change `activity.imageChange` according to API (not implemented) -->
      <!-- <img v-if="isChangingImage" :src="changedToImage" alt="" /> -->
    </div>
  </li>
</template>

<script>
export default {
  name: "UserActivityCard",

  props: {
    activity: {
      type: Object,
      default: () => ({}),
    },
  },

  data: () => ({
    user: {},
    executedRecently: false,
    activityTypes: {
      0: "uploaded an image for",
      1: "merged",
      2: "split",
      3: "claimed",
    },
    visibleCoordinates: 4,
    hideLongCoordinates: true,
  }),

  computed: {
    // Return plurals or singular word for coordinate(s)
    prependPluralOrSingular() {
      return this.activity.coordinates.length > 1 ? " segments" : " the segment";
    },
    activityDate() {
      return new Date(this.activity.createdAt);
    },
    timePassed() {
      return Date.now() - this.activityDate.getTime();
    },
    isActionWithin1Hour() {
      return this.timePassed < 3600000;
    },
    prettierTime() {
      // If timestamp within 1 hour return result like "X minutes ago"
      if (this.isActionWithin1Hour) {
        const minutesPassed = new Date(this.timePassed).getMinutes();
        return minutesPassed === 1 ? "1 minute ago" : `${minutesPassed} minutes ago`;
      }
      return this.activityDate.toLocaleString("en-US", {timeZone: "Europe/Moscow"});
    },
    isChangingImage() {
      return this.activity.action === 0;
    },
    hasMoreThan4Coordinates() {
      return this.totalCoordinates > this.visibleCoordinates;
    },
    totalCoordinates() {
      return this.activity.coordinates.length;
    },
    hiddenCoordinates() {
      return this.totalCoordinates - this.visibleCoordinates;
    },
    changedToImage() {
      if (this.isChangingImage === false) {
        return false;
      }

      return process.env.SERVER_URL + "/files/log-images/" + this.activity.image;
    },
  },

  async mounted() {
    if (this.activity.walletAddress) {
      this.user = await this.$axios
        .$get(`${process.env.SERVER_URL}/user/${this.activity.walletAddress}`)
        .catch((err) => console.error(err));

      // Generate a user avatar, if there are non configured
      if (!this.user.avatar) {
        this.user.avatar = this.$identicon(this.activity.walletAddress);
        return;
      }

      this.user.avatar = process.env.SERVER_URL + "/files/users/avatars/" + this.user.avatar;
    }
  },

  methods: {
    shortenAddress(address) {
      return `${address.slice(0, 6)}....${address.slice(-4, address.length)}`;
    },
    highlightSegment(coordinate) {
      // Emit function max. once every 1 sec
      const debouncedEmit = () => {
        if (!this.executedRecently) {
          this.$nuxt.$emit("highlight-from-activity", coordinate);
          this.executedRecently = true;
          setTimeout(() => {
            this.executedRecently = false;
          }, 1000);
        }
      };
      debouncedEmit();
    },
  },
};
</script>

<style src="./index.scss" lang="scss" scoped></style>
