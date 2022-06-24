<template>
  <footer class="footer">
    <h2 class="footer__small-header">Social media links</h2>
    <div class="footer__socials">
      <a class="footer__soc-link" href="https://discord.gg/ZyXmhH9AwF" target="_blank">
        <Discord></Discord>
      </a>
      <a class="footer__soc-link" href="https://twitter.com/nftworldcom" target="_blank">
        <Twitter></Twitter>
      </a>
      <a class="footer__soc-link" href="https://nftworldcom.medium.com/" target="_blank">
        <Medium></Medium>
      </a>
      <a class="footer__soc-link" href="https://millionpieces.gitbook.io/millionpieces/" target="_blank">
        <Gitbook></Gitbook>
      </a>
    </div>
    <p class="footer__copyright">© nftworld.com</p>
    <nuxt-link class="footer__toc link" to="/terms">Terms and Conditions</nuxt-link>
  </footer>
</template>

<script>
import Medium from "@/assets/images/icon/Medium-gradient.svg?inline";
import Gitbook from "@/assets/images/icon/GitBook-gradient.svg?inline";
import Twitter from "@/assets/images/icon/Twitter-gradient.svg?inline";
import Discord from "@/assets/images/icon/Discord-gradient.svg?inline";

export default {
  components: {
    Medium,
    Gitbook,
    Twitter,
    Discord,
  },
};
</script>

<style lang="scss" scoped>
.footer {
  margin-top: 10rem;
  padding: 0 1.5rem;
  color: white;
  font-weight: 500;
  text-align: center;

  @include media-breakpoint-down(md) {
    margin-top: 5rem;
  }

  @include media-breakpoint-up(sm) {
    position: relative;
    padding: 0 2rem;
    text-align: unset;
  }

  &__small-header {
    margin-bottom: 0.6rem;
    color: rgba(255, 255, 255, 0.6);
    font-size: 0.875rem;
    text-transform: uppercase;
  }

  &__socials {
    display: flex;
    justify-content: center;
    margin-bottom: 2.2rem;

    > *:not(:last-child) {
      margin-right: 0.5rem;
    }

    @include media-breakpoint-up(sm) {
      justify-content: flex-start;
      margin-bottom: 1.5rem;
    }
  }

  &__soc-link {
    padding: 0.25rem;
    border-radius: 0.5rem;

    &:focus {
      outline: 1px solid white;
    }

    &:hover {
      background-color: rgba(255, 255, 255, 0.16);
    }

    svg {
      width: 2rem;
      height: 100%;
    }
  }

  &__copyright {
    margin-bottom: 0;
    padding-bottom: 2.5rem;
  }

  &__toc {
    display: inline-block;
    padding: 0.5rem;
    color: inherit;

    @include media-breakpoint-up(sm) {
      position: absolute;
      bottom: 2.75rem;
      left: 50%;
      transform: translate(-50%, -50%);
    }
  }
}
</style>
