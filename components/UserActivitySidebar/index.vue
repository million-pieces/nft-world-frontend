<template>
  <div class="activity-sidebar">
    <!-- Button in the NavBar - toggles activity sidebar -->
    <button
      class="activity-btn btn link text-white text-nowrap text-color px-3 p-0 navbar__link"
      :class="`${isPopupVisible ? 'bg-primary-gradient' : ''}`"
      @click="isPopupVisible = !isPopupVisible"
    >
      Activity
    </button>

    <div v-if="isPopupVisible" class="selection bg-dark p-4 right" :class="isPopupVisible ? 'visible' : ''">
      <!-- Closes side bar -->
      <div class="text-white d-flex justify-content-between">
        Activity
        <button class="p-0 border-0 bg-transparent" @click="close()">
          <IconClose />
        </button>
      </div>

      <!-- Sidebar top navigation -->
      <ul class="sidebar-navigation text-white">
        <li
          v-for="(tabName, index) in activeTabNames"
          :key="`tab-${index}`"
          class="sidebar-navigation__item"
          :class="activeTab === tabName ? 'active' : ''"
          @click="changeTab($event)"
        >
          {{ tabName }}
        </li>
      </ul>

      <!-- Tab content -->
      <!-- <ul v-if="activeTab === 'All'" class="activity-list">
        <user-activity-card
          v-for="(activity, index) in activities['All']"
          :key="`activity-${index}`"
          :activity="activity"
          class="activity-list__card text-white"
        />
      </ul> -->

      <!-- Search by wallet id -->
      <div v-if="activeTab === 'By wallet'" class="search-activities form-group has-search">
        <input
          id="filterByWallet"
          v-model="filterByWallet"
          class="search-activities__input form-control"
          placeholder="Search"
          type="text"
          name="Filter activities by wallet"
        />
        <SearchIcon class="form-control-feedback" />
      </div>
      <ul class="activity-list">
        <user-activity-card
          v-for="(activity, index) in activities"
          :key="`activity-${index}`"
          :activity="activity"
          class="activity-list__card text-white"
        />
      </ul>

      <button v-if="!isLoadingFinished && !isLoading && activities.length" class="activities__more" @click="loadActivities">
        Load more
      </button>
      <app-loader v-if="isLoading" class="d-flex align-items-center justify-content-center m-auto"></app-loader>

      <!-- <ul v-if="activeTab === 'My activity'" class="activity-list">
        <user-activity-card
          v-for="(activity, index) in activities['My activity']"
          :key="`activity-${index}`"
          :activity="activity"
          class="activity-list__card text-white"
        />
      </ul> -->
    </div>
  </div>
</template>

<script>
import IconClose from "@/assets/images/icon/white-close.svg?inline";
import SearchIcon from "@/assets/images/icon/search.svg?inline";

import activity from "@/mixins/activity";
import sidebar from "@/mixins/sidebar";
import {mapGetters} from "vuex";

export default {
  name: "UserActivitySidebar",
  components: {
    IconClose,
    SearchIcon,
  },

  mixins: [activity, sidebar],

  data: () => ({
    activeTab: "All",
    activeTabNames: ["All", "By wallet"],
    filterByWallet: "",
  }),

  computed: {
    ...mapGetters({
      isLoggedIn: "auth/isLoggedIn",
      walletId: "auth/address",
    }),
  },

  watch: {
    isLoggedIn() {
      if (this.isLoggedIn) {
        this.activeTabNames.push("My activity");
      }
    },
    filterByWallet() {
      this.resetActivities();
      this.loadActivities();
    },
    isPopupVisible(isOpening) {
      if (!isOpening) this.resetActivities();
      this.loadActivities();
    },
  },

  mounted() {
    if (this.isLoggedIn) {
      this.activeTabNames.push("My activity");
      return;
    }
  },

  methods: {
    changeTab($event) {
      const tabName = $event.target.innerHTML.trim();
      this.activeTab = tabName;
      this.resetActivities();
      this.loadActivities();
    },
  },
};
</script>

<style src="./index.scss" lang="scss" scoped></style>
