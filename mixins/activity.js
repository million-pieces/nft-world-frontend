import {mapGetters} from "vuex";
export default {
  data: () => ({
    activities: [],
    activityPage: 1,
    isLoadingFinished: false,
    isLoading: false,
    limit: 10,
    offset: 0,
  }),

  methods: {
    async loadActivities() {
      if (this.isLoadingFinished) return;

      let logsURL = `${process.env.SERVER_URL}/logs?limit=${this.limit}&offset=${this.offset}`;
      switch (this.activeTab) {
        case "By wallet":
          logsURL = `${process.env.SERVER_URL}/logs/${this.filterByWallet || null}?limit=${this.limit}&offset=${this.offset}`;
          break;
        case "My activity":
          logsURL = `${process.env.SERVER_URL}/logs/${this.walletId}?limit=${this.limit}&offset=${this.offset}`;
          break;
      }

      this.isLoading = true;

      await this.$axios
        .$get(logsURL)
        .then((data) => {
          this.activities.push(data);
          this.activities = this.activities.flat();

          if (data.length < this.limit) {
            this.isLoadingFinished = true;
            return;
          }

          this.activityPage++;
          this.offset = this.activityPage * this.limit;
        })
        .catch((err) => console.error(err));

      this.isLoading = false;
    },

    resetActivities() {
      this.activities = [];
      this.isLoading = false;
      this.isLoadingFinished = false;
      this.activityPage = 1;
    },

    async loadMoreActivities() {
      this.loadActivities();
      // this.activeTab
    },
  },
  computed: {
    ...mapGetters({
      getIsMapLoaded: "worldMap/getIsMapLoaded",
    }),
  },
  watch: {
    getIsMapLoaded: {
      async handler(newValue) {
        if (newValue === true) {
          try {
            this.resetActivities();
            this.loadActivities();
          } catch (err) {
            console.error(err);
          }
        }
      },
    },
  },
};
