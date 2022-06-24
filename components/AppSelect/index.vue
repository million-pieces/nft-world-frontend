<template lang="html">
  <div v-click-outside="closeSelect" class="select position-relative">
    <select :name="name" class="d-none">
      <option :value="value.value">{{ value.text || "" }}</option>
    </select>
    <div class="select-title rounded text-capitalize" :class="{opened: list}" @click="list = !list">
      {{ value.text || "" }}
    </div>
    <transition name="fade">
      <div v-if="list" class="select-list border-top-0">
        <ul class="list-unstyled">
          <li v-for="item in items" :key="item.value" class="select-item px-2 py-2 text-capitalize" @click="choose(item)">
            {{ item.text }}
          </li>
        </ul>
      </div>
    </transition>
  </div>
</template>

<script>
export default {
  props: {
    items: {
      type: Array,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    value: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      list: false,
    };
  },
  methods: {
    closeSelect() {
      this.list = false;
    },
    choose(item) {
      this.$emit("input", item);
      this.list = false;
    },
  },
};
</script>

<style lang="scss" scoped>
.fade {
  &-enter-active,
  &-leave-active {
    transition: 0.2s;
  }
  &-enter,
  &-leave-to {
    max-height: 0;
  }
}
</style>
