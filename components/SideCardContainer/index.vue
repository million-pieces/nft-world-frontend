<template>
  <div>
    <slot></slot>
  </div>
</template>
<script>
export default {};
</script>

<style lang="scss">
hr {
  margin-top: 2rem;
  background: #6d6b88;
}
.side-card-selection {
  position: fixed;
  top: 3.375rem;
  right: -100%;
  bottom: 0;
  z-index: 2;
  width: 20rem;
  overflow-y: auto;
  border-top: 1px solid #adadad;
  border-left: 1px solid #adadad;
  border-top-left-radius: $border-radius-lg;
  box-shadow: inset 0.3125rem 0.3125rem 15rem rgba(255, 255, 255, 0.02);
  transition: right $short-delay;
  @include media-breakpoint-up(sm) {
    top: 6.125rem;
    width: 34.375rem;
  }
  &-img {
    position: absolute;
    top: 0;
    right: 0;
    width: 2.4375rem;
  }
}
.visible {
  right: 0;
}
.img-block {
  width: 60%;
  @include media-breakpoint-up(sm) {
    width: 36%;
  }
}
.description-block {
  width: 100%;
  @include media-breakpoint-up(sm) {
    width: 52%;
  }
}

.cart-trigger {
  position: relative;
  padding: 0px;
}
.badge {
  position: absolute;
  top: -0.625rem;
  right: -0.625rem;
  width: 1.5625rem;
  height: 1.5625rem;
  padding: 0;
  color: #fff;
  line-height: 1.5625rem;
}

.delete-btn {
  svg {
    path {
      stroke: #fff;
    }
  }
}
::v-deep {
  .lds-ellipsis {
    margin: auto;
  }
}
</style>
