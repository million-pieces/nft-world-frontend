<template>
  <div>
    <div class="col-lg-12 text-center">
      <h3 class="font-weight-bold mx-auto mt-4 mb-4">
        <b class="highlighted">How to play</b>
      </h3>
    </div>

    <div class="col-lg-12 text-justify mb-3 mb-lg-0">
      <p class="mx-auto mb-2">The goal of the game is to <b class="highlighted">occupy</b> as much land as possible.</p>

      <p class="mx-auto mb-0">
        When you enter the game, you are given the opportunity to take <b class="highlighted">one piece for free</b>. Just click on any
        unoccupied segment and the "occupy" button in the opened popup.
      </p>
    </div>

    <div class="col-lg-12 mt-3">
      <p class="mx-auto m-0">Every 1 hour you will receive {{ gameIncome }} tokens for each busy segment.</p>
    </div>
    <div class="col-lg-12 mt-3">
      <p class="mx-auto m-0">Further you can occupy new segments if you have enough balance.</p>
    </div>
    <div class="col-lg-12 mt-3">
      <p>
        Also, you can attack land already occupied by someone for {{ attackPrice }} tokens.<br />
        To do this, click on the occupied segment and the "Attack" button in the opened popup.<br />
        With a <b class="highlighted">50% chance</b> your attack will be successful.<br />
        The owner of the land has 2 hours to fight off the attack.<br />
        If he does not, then the segment goes to you.<br />
      </p>
    </div>
    <div class="col-lg-12 mt-3">
      <p>
        If they attacked you, then you can repel the attack within 2 hours by paying {{ fendPrice }} tokens for this.<br />
        If you don't then you're <b class="highlighted">losing ground</b>
      </p>
    </div>
    <div class="col-lg-12 mt-3">
      <p>If you have any questions, write to us on Discord.</p>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      attackPrice: process.env.GAME_ATTACK_PRICE,
      fendPrice: process.env.GAME_FEND_PRICE,
      gameIncome: process.env.GAME_INCOME,
    };
  },
};
</script>
