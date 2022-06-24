<template id="countdown-template">
  <div class="d-flex flex-row justify-content-around w-100 text-center">
    <div class="d-flex flex-column mb-2 mb-sm-0">
      <p class="digit">{{ twoDigits(days) }}</p>
      <p class="font-weight-bold m-0 d-none d-sm-block">Days</p>
      <p class="font-weight-bold m-0 d-sm-none">D</p>
    </div>
    <div class="d-flex flex-column mb-2 mb-sm-0">
      <p class="digit">{{ twoDigits(hours) }}</p>
      <p class="font-weight-bold m-0 d-none d-sm-block">Hours</p>
      <p class="font-weight-bold m-0 d-sm-none">H</p>
    </div>
    <div class="d-flex flex-column mb-2 mb-sm-0">
      <p class="digit">{{ twoDigits(minutes) }}</p>
      <p class="font-weight-bold m-0 d-none d-sm-block">Minutes</p>
      <p class="font-weight-bold m-0 d-sm-none">M</p>
    </div>
    <div class="d-flex flex-column mb-2 mb-sm-0">
      <p class="digit">{{ twoDigits(seconds) }}</p>
      <p class="font-weight-bold m-0 d-none d-sm-block">Seconds</p>
      <p class="font-weight-bold m-0 d-sm-none">S</p>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    date: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      now: Math.trunc(new Date().getTime() / 1000),
    };
  },
  computed: {
    dateInMilliseconds() {
      return Math.trunc(Date.parse(this.date) / 1000);
    },
    seconds() {
      return (this.dateInMilliseconds - this.now) % 60;
    },
    minutes() {
      return Math.trunc((this.dateInMilliseconds - this.now) / 60) % 60;
    },
    hours() {
      return Math.trunc((this.dateInMilliseconds - this.now) / 60 / 60) % 24;
    },
    days() {
      return Math.trunc((this.dateInMilliseconds - this.now) / 60 / 60 / 24);
    },
  },
  mounted() {
    window.setInterval(() => {
      this.now = Math.trunc(new Date().getTime() / 1000);
    }, 1000);
  },
  methods: {
    twoDigits(value) {
      if (value < 0) {
        return "00";
      }
      if (value.toString().length <= 1) {
        return `0${value}`;
      }
      return value;
    },
  },
};
</script>

<style scoped>
.digit {
  margin: 0;
  color: #ecf0f1;
  font-size: 2.625rem;
  text-align: center;
}
</style>
