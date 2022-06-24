<template>
  <div class="lds-ellipsis">
    <div></div>
    <div></div>
    <div></div>
    <div></div>
  </div>
</template>

<style lang="scss" scoped>
.lds-ellipsis {
  position: relative;
  display: inline-block;
  width: 5rem;
  height: 5rem;
  &.map-loader {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
  &.game-map-loader {
    position: fixed;
    top: 50vh;
  }
}
.lds-ellipsis div {
  position: absolute;
  top: 2.0625rem;
  width: 0.8125rem;
  height: 0.8125rem;
  background: #fff;
  background: linear-gradient(74.53deg, #2771e9 0.04%, #792ee7 27.39%, #a82acc 58%, #d4504b 90.58%);
  border-radius: 50%;
  animation-timing-function: cubic-bezier(0, 1, 1, 0);
}
.lds-ellipsis div:nth-child(1) {
  left: 0.5rem;
  animation: lds-ellipsis1 0.6s infinite;
}
.lds-ellipsis div:nth-child(2) {
  left: 0.5rem;
  animation: lds-ellipsis2 0.6s infinite;
}
.lds-ellipsis div:nth-child(3) {
  left: 2rem;
  animation: lds-ellipsis2 0.6s infinite;
}
.lds-ellipsis div:nth-child(4) {
  left: 3.5rem;
  animation: lds-ellipsis3 0.6s infinite;
}
@keyframes lds-ellipsis1 {
  0% {
    transform: scale(0);
  }
  100% {
    transform: scale(1);
  }
}
@keyframes lds-ellipsis3 {
  0% {
    transform: scale(1);
  }
  100% {
    transform: scale(0);
  }
}
@keyframes lds-ellipsis2 {
  0% {
    transform: translate(0, 0);
  }
  100% {
    transform: translate(1.5rem, 0);
  }
}
</style>
