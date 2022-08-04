<template>
  <div class="info-block base-text__white" :class="type === 'time' ? 'mr-0' : ''">
    <span class="info-block__header base-text__white_muffled">{{ header }}</span>
    <EraPieceValue v-if="theme === 'point'" :value="value" class="info-block__value" />
    <span v-else-if="type === 'time'" class="info-block__value">
      <b class="text-gradient-light">Reward in:</b> {{ value | normalizeDate }}
    </span>
    <span v-else class="info-block__value" :class="[theme === 'gradient-value' ? 'text-gradient-light' : '']">
      {{ value }}
    </span>
  </div>
</template>
<script>
import helpers from "@/mixins/helpers";

export default {
  mixins: [helpers],
  props: {
    header: {
      type: [Number, String],
      default: "",
    },
    value: {
      type: [Number, String],
      default: "",
    },
    theme: {
      type: String,
      default: "default",
    },
    type: {
      type: String,
      default: "default",
    },
  },
  computed: {
    activityDate() {
      if (this.type !== "time") {
        return false;
      }
      return new Date(this.value);
    },
    timePassed() {
      return Date.now() - this.activityDate.getTime();
    },
    prettierTime() {
      // If timestamp within 1 hour return result like "X minutes ago"
      if (this.isActionWithin1Hour) {
        const minutesPassed = new Date(this.timePassed).getMinutes();
        return minutesPassed === 1 ? "1 minute ago" : `${minutesPassed} minutes ago`;
      }
      return this.activityDate.toLocaleString("en-US", {timeZone: "Europe/Moscow"});
    },
  },
};
</script>
<style lang="scss" scoped>
.info-block {
  display: flex;
  flex-direction: column;
  margin-right: 1.2381rem;
  text-align: left;
  p {
    margin-bottom: 0;
  }
  &__header {
    margin-bottom: 0.1905rem;
    text-transform: uppercase;
  }
  &__value {
    font-weight: 500;
  }
}
</style>
