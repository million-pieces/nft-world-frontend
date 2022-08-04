export default {
  filters: {
    dashReplacer(string) {
      return string?.replace(/_/g, " ");
    },
    //  convert to 22h.30m. formate
    normalizeDate(date) {
      const dateBefore = new Date(date);
      const dateNow = new Date();
      const timeBeforeInSec = (dateBefore - dateNow) / 1000;
      const timeBeforeInMinutes = timeBeforeInSec / 60;
      const secLeft = Math.floor((timeBeforeInSec % 60) % 60);
      const minutesLeft = Math.floor(timeBeforeInMinutes % 60);
      const hoursLeft = Math.floor(timeBeforeInMinutes / 60);
      return `${hoursLeft}h.${minutesLeft}m.${secLeft}s.`;
    },
  },
  methods: {
    showErrorNotification(error) {
      const notificationData = {
        header: error.message,
        buttonText: "Close",
      };
      if (error.response?.data?.error) {
        notificationData.header = error.response.data.error;
      }
      this.$nuxt.$emit("openGamePopup", notificationData);
    },
  },
};
