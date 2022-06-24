<template>
  <div>
    <input class="address position-absolute" style="opacity: 0" type="text" :value="address" />
    <div class="d-inline-flex align-items-center">
      <nuxt-link :to="'/account/' + address" class="text-middle opacity-3 text-underline mb-0">
        <u :class="`text-${color} mr-2 address-txt`">
          {{ normalizedAddress }}
        </u>
      </nuxt-link>

      <div class="tooltip-container">
        <button :class="`text-${color} btn p-0 border-0 copy-btn opacity-3`" @click="copyLink">
          <CopyIcon />
        </button>
        <span class="tooltip tron-tooltip"> {{ tooltipText }} </span>
      </div>
    </div>
  </div>
</template>
<script>
import CopyIcon from "@/assets/images/icon/dark-copy.svg?inline";
export default {
  components: {
    CopyIcon,
  },

  props: {
    address: {
      type: String,
      required: true,
    },
    color: {
      type: String,
      required: false,
      default: "dark",
    },
  },

  data() {
    return {
      tooltipText: "copy",
    };
  },

  computed: {
    refLink() {
      return `${window.location.origin}/?r=${this.address}`;
    },
    normalizedAddress() {
      return `${this.address ? this.address.slice(0, 6) : ""}....${this.address ? this.address.slice(-6) : ""}`;
    },
  },

  methods: {
    copyLink() {
      let textToCopy = document.querySelector(".address");
      textToCopy.select();
      try {
        document.execCommand("copy");
        this.tooltipText = "Copied";
      } catch (err) {
        alert("Oops, unable to copy");
      }
    },
  },
};
</script>

<style lang="scss">
.address-container {
  .address-txt {
    color: #fff;
    text-align: left;
  }
}
.copy-btn {
  &.text-white {
    path {
      fill: #fff;
    }
  }
}
</style>
