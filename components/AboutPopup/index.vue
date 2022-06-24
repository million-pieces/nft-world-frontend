<template>
  <transition name="fade">
    <div v-if="isOpenAboutPopup">
      <div class="modal d-block" @click.self="closeAboutPopup">
        <div class="modal-content ever-modal-unlock bg-white p-3">
          <div class="container">
            <div class="row mb-2">
              <!-- game description -->
              <about-popup-game v-if="isAboutGamePopup"></about-popup-game>
              <!-- project description -->
              <about-popup-project v-else></about-popup-project>
              <div class="col-lg-12">
                <div class="d-flex flex-row justify-content-around w-100 pb-3 pt-3 mt-3">
                  <a href="https://discord.gg/ZyXmhH9AwF" target="_blank" rel="noreferrer noopener">
                    <DiscordIcon width="40" height="40" fill="white" />
                  </a>
                  <a href="https://twitter.com/nftworldcom" target="_blank" rel="noreferrer noopener">
                    <TwitterIcon width="40" height="40" fill="white" />
                  </a>
                  <a href="https://nftworldcom.medium.com/" target="_blank" rel="noreferrer noopener">
                    <MediumIcon width="40" height="40" fill="white" />
                  </a>
                  <a href="https://millionpieces.gitbook.io/millionpieces/" target="_blank" rel="noreferrer noopener">
                    <GitBookIcon width="70" height="40" fill="white" />
                  </a>
                </div>
              </div>
              <div class="col-lg-12 mt-4 mb-4 text-center">
                <div class="col-lg-12">
                  <p class="mx-auto m-0">NFT World (MillionPieces) contract:</p>
                  <a
                    href="https://etherscan.io/token/0x32a984f84e056b6e553cd0c3729fddd2d897769c"
                    target="_blank"
                    rel="noreferrer noopener"
                    class="mx-auto m-0"
                  >
                    <b>0x32a984f84e056b6e553cd0c3729fddd2d897769c</b>
                  </a>
                </div>
                <div class="col-lg-12 mt-4">
                  <nuxt-link :to="'/terms'" class="text-white text-nowrap mr-lg-3 ml-lg-3 mr-xl-5 ml-xl-5 text-color">
                    Terms & conditions
                  </nuxt-link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="modal-backdrop show"></div>
    </div>
  </transition>
</template>

<script>
import TwitterIcon from "@/assets/images/icon/twitter-logo.svg?inline";
import DiscordIcon from "@/assets/images/icon/discord-logo.svg?inline";
import GitBookIcon from "@/assets/images/icon/gitbook-logo.svg?inline";
import MediumIcon from "@/assets/images/icon/medium-logo.svg?inline";

export default {
  components: {
    TwitterIcon,
    DiscordIcon,
    GitBookIcon,
    MediumIcon,
  },
  data() {
    return {
      isOpenAboutPopup: false,
      isAboutGamePopup: false,
    };
  },
  created() {
    this.$nuxt.$on("openAboutPopup", (isAboutGamePopup) => {
      this.isAboutGamePopup = isAboutGamePopup;
      this.isOpenAboutPopup = true;
    });
  },
  destroyed() {
    this.$nuxt.$off("openAboutPopup");
  },
  methods: {
    closeAboutPopup() {
      this.isOpenAboutPopup = false;
    },
  },
};
</script>

<style lang="scss" scoped>
.modal {
  overflow: auto;

  .modal-content {
    width: 39.6875rem;
    min-width: 18.75rem;
    max-width: 85%;
    margin: 3rem auto;
    color: white;
    background: linear-gradient(90deg, rgba(10, 22, 39, 1) 0%, rgba(23, 34, 98, 1) 50%, rgba(57, 45, 84, 1) 100%);

    a {
      color: white;
    }
  }
}

.modal-backdrop {
  background: #fff;
}
</style>
