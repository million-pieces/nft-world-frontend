<template>
  <div class="form-group has-search search" @click="search()">
    <input
      v-model="searchInput"
      type="text"
      :class="['form-control', showResults ? 'form-control_with-results' : '']"
      placeholder="Search"
      @keyup="search()"
      @change="search()"
    />
    <transition name="fade">
      <div v-if="showResults" class="search-results">
        <ul>
          <li v-for="(result, index) of searchResults" :key="index" @mouseenter="setSearchVal(result)">
            {{ result.replaceAll("_", " ") }}
          </li>
        </ul>
      </div>
    </transition>
    <SearchIcon class="form-control-feedback" />
  </div>
</template>

<script>
import SearchIcon from "@/assets/images/icon/search.svg?inline";
import {mapActions} from "vuex";

export default {
  components: {
    SearchIcon,
  },
  data() {
    return {
      searchInput: "",
      searchResults: [],
    };
  },
  computed: {
    searchVal() {
      return this.searchInput.replaceAll(" ", "_");
    },
    showResults() {
      return this.searchInput.length > 1;
    },
  },

  mounted() {
    this.$nuxt.$on("highlight-from-activity", (coord) => {
      this.setSearchVal(coord);
      this.search();
    });
  },

  beforeDestroy() {
    this.$nuxt.$off("highlight-from-activity");
  },

  methods: {
    ...mapActions({
      setFilterValue: "worldMap/setFilterValue",
    }),
    search() {
      if (this.searchInput.length === 1) return false;
      // checks for a number in searchVal
      if (/\d/.test(this.searchVal)) {
        this.$emit("SearchFilter", this.searchVal.toUpperCase());
        this.setFilterValue(this.searchVal.toUpperCase());
      } else {
        const values = this.$store.getters["worldMap/getValuesByString"](this.searchVal);
        this.searchResults = values;
        this.$emit("SearchFilter", values);
        this.setFilterValue(this.searchVal.toLowerCase());
      }
    },
    setSearchVal(val) {
      this.searchInput = val.replaceAll("_", " ");
    },
    clearVal() {
      this.searchInput = "";
    },
  },
};
</script>

<style lang="scss" scoped>
.search {
  position: relative;
  margin: 0;

  .form-control {
    padding-top: 0;
    padding-bottom: 0;

    &:focus {
      color: #fff;
      font: 0.875rem 400 Mont;
      -webkit-text-fill-color: #fff;

      &::placeholder {
        color: lightslategrey;
      }
    }
    &_with-results {
      border-radius: 0.625rem 0.625rem 0 0;
      & + .search-results {
        max-height: 9.375rem;
        overflow: auto;
        border: 1px solid #fff;
      }
    }
  }

  svg {
    height: 0.9375rem;
  }
}
.search-results {
  position: absolute;
  top: 100%;
  box-sizing: border-box;
  width: 100%;
  max-height: 0;
  margin-top: 0.3125rem;
  overflow: hidden;
  text-align: left;
  border: 0;
  border-radius: 0 0 0.625rem 0.625rem;
  transition: all ease 0.2s;

  ul {
    margin: 0;
    padding: 0.625rem 0;
    font-weight: 400;
    font-size: 0.875rem;
    line-height: normal;
    list-style: none;
    background: rgba(0, 0, 0, 0.15);
    box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
    -webkit-backdrop-filter: blur(4px);
    backdrop-filter: blur(2px);
    li {
      padding: 0.5rem 1rem;
      color: #fff;
      line-height: normal;
      text-transform: capitalize;
      cursor: pointer;
    }
  }
}
</style>
