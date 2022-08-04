<template>
  <div>
    <div class="col-lg-12 text-center">
      <h3 class="font-weight-bold mx-auto mt-4 mb-4">
        <b class="highlighted">Welcome to the P2E NFT World!</b>
      </h3>
    </div>

    <div class="col-lg-12 text-justify mb-3 mb-lg-0">
      <p class="mx-auto mb-2">
        In the game you can develop your world, earn tokens and exchange them for <b class="highlighted">real money!</b>
      </p>
    </div>

    <div class="col-lg-12 text-center">
      <h5 class="font-weight-bold mx-auto mt-4 mb-4">
        <b class="highlighted">How to do that</b>
      </h5>
    </div>

    <div class="col-lg-12 mt-3">
      <p class="mx-auto m-0">
        There are two characters in the game: <b class="highlighted">Landowner</b> and <b class="highlighted">Resident</b>
      </p>
    </div>
    <div class="col-lg-12 mt-3">
      <p class="mx-auto m-0">
        To become a Landowner, you need to buy a segment on the <nuxt-link class="font-weight-bold" :to="'/'"> main map </nuxt-link> (ETH
        mainnet)
      </p>
    </div>
    <div class="col-lg-12 mt-3">
      <p>
        To become a Resident, you need to click on a colored segment on the
        <nuxt-link class="font-weight-bold" :to="'/nft-era'"> game map </nuxt-link> and click on "Settle here". You will buy an nft and be
        housed in a cave. For now, it's free, since the game is in beta and on the Mumbai test network (you can get the free Matic
        <a class="font-weight-bold" href="https://faucet.polygon.technology/" target="_blank"> here </a>
        )
      </p>
    </div>
    <div class="col-lg-12 mt-3">
      <p>
        Then If you are a segment owner, you first need to log in to the game by clicking "Login to the Game". If you are a resident, you do
        not need to do this.
      </p>
    </div>
    <div class="col-lg-12 mt-3">
      <p>
        After that, you are in the game and can collect tokens!)<br />
        To do this, go to your segment on the map or sidebar by clicking on "My Segments" and click on "Claim."
      </p>
    </div>
    <div class="col-lg-12 mt-3">
      <p>
        If you are a landowner, you can build another cave in your segment. To do this, go to your segment and click "Create Cave". If you
        have enough tokens, the cave will be built and residents can settle in it.
      </p>
    </div>
    <div class="col-lg-12 mt-3">
      <p class="mb-1">More about game:</p>
      <p>Gitbook - <a href="https://mp0.gitbook.io/new/game.-new-life" target="_blank">https://mp0.gitbook.io/new/game.-new-life</a></p>

      <p class="mb-1">If you have any questions, write to us on Discord:</p>
      <p>Discord - <a href="https://discord.gg/AArN5K4VRc" target="_blank">https://discord.gg/AArN5K4VRc</a></p>
    </div>
  </div>
</template>
<script>
export default {
  data() {},
};
</script>
<style lang="scss" scoped></style>
