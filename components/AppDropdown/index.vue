<template>
  <div v-click-outside="closeDropDown" class="dropdown-address-content">
    <button class="image-content-box" @click="handleDropDownActive">
      <img :src="isDropdownActive ? filterIcon : account ? filterDarkIcon : filterWhiteIcon" alt="" />
    </button>
    <transition name="fade">
      <div v-if="isDropdownActive" class="dropdown-menu dropdown-address bg-dark border show overflow-hidden">
        <div class="text-white d-flex justify-content-between mb-4">
          Filter Segments
          <button type="button" class="border-0 bg-transparent pr-0" @click="closeDropDown">
            <CloseIcon />
          </button>
        </div>
        <form @submit.prevent="filter()" @reset.prevent="clear()">
          <div v-for="(option, index) in optionsList" :key="index" class="form-group" @click="lastActiveInput = index">
            <model-select
              v-model="option.item"
              :options="option.options"
              :name="option.placeholder.value"
              :placeholder="option.placeholder.text"
              class="rounded"
            />
          </div>

          <div class="form-group position-relative" @click="lastActiveInput = 'coordinates'">
            <label class="select-title rounded text-capitalize d-block" for="letters"> By Coordinates </label>
            <div class="coordinate-content d-flex">
              <input
                id="letters"
                v-model="coordintatesLetter"
                type="text"
                placeholder="aa"
                maxlength="2"
                class="coordinate rounded-0 d-inline p-0 form-control border-top-0 border-left-0 border-right-0 mr-2"
              />
              <input
                v-model="coordintatesNumber"
                type="text"
                placeholder="000"
                maxlength="3"
                class="coordinate coordinate-number rounded-0 d-inline p-0 form-control border-top-0 border-left-0 border-right-0"
              />
            </div>
          </div>
          <div v-if="!isFiltersClear" class="btn-padding p-0 pt-3 d-flex justify-content-around">
            <button type="reset" class="btn px-4 py-1 text-middle text-middle btn-transparent text-white">Reset</button>
            <button type="submit" class="btn px-4 py-1 text-middle text-middle btn-transparent text-white">Apply</button>
          </div>
        </form>
      </div>
    </transition>
  </div>
</template>
<script>
import {mapGetters, mapActions} from "vuex";
import FilterIcon from "@/assets/images/icon/filter.svg";
import FilterWhiteIcon from "@/assets/images/icon/filter-white.svg";
import FilterDarkIcon from "@/assets/images/icon/filter-dark.svg";
import CloseIcon from "@/assets/images/icon/white-close.svg?inline";
import {ModelSelect} from "vue-search-select";

export default {
  components: {
    ModelSelect,
    CloseIcon,
  },
  props: {
    account: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      filterIcon: FilterIcon,
      filterWhiteIcon: FilterWhiteIcon,
      filterDarkIcon: FilterDarkIcon,
      isDropdownActive: false,
      lastActiveInput: null,
      coordintatesLetter: null,
      coordintatesNumber: null,
      optionsList: [
        {
          options: [],
          item: {
            value: "",
            text: "",
          },
          placeholder: {value: "country", text: "by country"},
        },
        {
          options: [],
          item: {
            value: "",
            text: "",
          },
          placeholder: {value: "contintent", text: "By Contintent"},
        },
        {
          options: [],
          item: {
            value: "",
            text: "",
          },
          placeholder: {value: "city", text: "by big city"},
        },
      ],
    };
  },
  computed: {
    ...mapGetters({
      address: "auth/address",
      places: "worldMap/data",
    }),
    inputText() {
      if (this.searchText) {
        return "";
      } else {
        let text = this.placeholder;
        if (this.selectedOption) {
          text = this.selectedOption.text;
        }
        return text;
      }
    },
    isFiltersClear() {
      return !this.optionsList.some((el) => el.item.value !== "") && !this.coordinates;
    },
    coordinates() {
      return this.coordintatesLetter?.toUpperCase() + this.coordintatesNumber;
    },
  },
  watch: {
    places() {
      this.setOptions();
    },
  },
  mounted() {
    this.setOptions();
  },
  methods: {
    ...mapActions({
      setMapIsBlurred: "worldMap/setMapIsBlurred",
      setFilterValue: "worldMap/setFilterValue",
    }),

    blurMap() {
      this.$nuxt.$emit("close-merge-mode");
      this.setMapIsBlurred(true);
    },
    closeDropDown() {
      this.isDropdownActive = false;
    },
    handleDropDownActive() {
      this.isDropdownActive = !this.isDropdownActive;
      this.blurMap();
      this.setFilterValue("");
    },
    setOptions() {
      this.optionsList[0].options = this.getTitles(this.places.countries);
      this.optionsList[1].options = this.getTitles(this.places.continents);
      this.optionsList[2].options = this.getTitles(this.places.bigCities);
    },
    getTitles(arr) {
      const titlesArr = [];

      arr.forEach((element) => {
        titlesArr.push({
          value: element,
          text: element.replaceAll("_", " "),
        });
      });

      return titlesArr;
    },
    filter() {
      this.reset(this.lastActiveInput);
      if (this.lastActiveInput !== "coordinates") {
        this.$emit("DDFilter", this.optionsList[this.lastActiveInput].item.value);
      } else {
        this.$emit("DDFilter", this.coordinates);
      }
    },
    reset(idx) {
      if (idx === "coordinates") {
        this.optionsList.forEach((el) => {
          el.item = {item: "", text: ""};
        });
      } else {
        this.optionsList.forEach((el, index) => {
          if (index !== idx) el.item = {item: "", text: ""};
        });
        this.coordintatesLetter = null;
        this.coordintatesNumber = null;
      }
    },
    clear() {
      this.reset();
      this.$emit("DDFilter", "");
    },
  },
};
</script>
<style lang="scss" scoped>
.coordinate {
  width: 3.5ch;
  height: auto;
  &-number {
    width: 3ch;
  }
  &-content {
    position: absolute;
    top: 0;
    right: 1.25rem;
    bottom: 0;
    height: 35%;
    margin: auto;
  }
}
.select-title {
  &:after {
    content: none;
  }
}
.btn {
  padding: 0.8125rem 2.25rem;
  &:hover {
    background-color: $dark !important;
  }
  &-padding {
    padding: 0 3.25rem;
  }
}
.dropdown-address-content button {
  padding: 0;
}
</style>
