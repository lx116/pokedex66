<script setup lang="ts">

</script>

<template>
  <div class="screen min-h-screen flex flex-col items-center justify-center text-center p-6">

    <div class="animation-stage">

      <!-- Pokeball -->
      <img
          src="@/assets/pokeball.svg"
          alt="Pokeball"
          class="pokeball"
      />

      <!-- Destello -->
      <div class="flash"></div>

      <!-- Puff -->
      <img
          src="@/assets/puff.svg"
          alt=""
          class="puff"
      />

    </div>

    <div class="Notice">
      <h2 class="text-2xl font-bold text-gray-900">
        ¡Muy pronto disponible!
      </h2>

      <p class="text-gray-500 text-center">
        Estamos trabajando para traerte esta sección.
        Vuelve más adelante para descubrir todas las novedades.
      </p>
    </div>

  </div>
</template>

<style scoped>

.screen {
  overflow: hidden;
}

/* ============================= */
/* Animation stage */
/* ============================= */

.animation-stage {
  position: relative;

  width: 320px;
  height: 320px;

  display: flex;
  align-items: center;
  justify-content: center;
}


/* ============================= */
/* Pokeball */
/* ============================= */

.pokeball {
  position: absolute;

  width: 96px;
  height: 96px;

  opacity: 0;

  z-index: 3;

  animation:
      throwPokeball 1.25s
      cubic-bezier(.22, .75, .3, 1)
      forwards;
}

@keyframes throwPokeball {

  0% {
    opacity: 1;

    transform:
        translate(-260px, -280px)
        rotate(-360deg)
        scale(.75);
  }

  60% {
    opacity: 1;

    transform:
        translate(0, 15px)
        rotate(20deg)
        scale(1);
  }

  /* pequeño rebote */
  75% {
    transform:
        translate(0, -18px)
        rotate(-8deg)
        scale(1);
  }

  88% {
    transform:
        translate(0, 0)
        rotate(3deg)
        scale(1);
  }

  100% {
    opacity: 1;

    transform:
        translate(0, 0)
        rotate(0deg)
        scale(1);
  }
}


/* ============================= */
/* Red flash */
/* ============================= */

.flash {
  position: absolute;

  width: 110px;
  height: 110px;

  border-radius: 50%;

  background: rgba(239, 68, 68, .8);

  opacity: 0;

  z-index: 4;

  filter: blur(12px);

  animation:
      flashEffect .6s
      ease-out
      1.25s
      forwards;
}

@keyframes flashEffect {

  0% {
    opacity: 0;
    transform: scale(.2);
  }

  25% {
    opacity: 1;
    transform: scale(1);
  }

  55% {
    opacity: .8;
    transform: scale(2.2);
  }

  100% {
    opacity: 0;
    transform: scale(3);
  }
}


/* ============================= */
/* Puff */
/* ============================= */

.puff {
  position: absolute;

  width: 280px;
  height: 280px;

  object-fit: contain;

  opacity: 0;

  z-index: 5;

  transform: scale(.3);

  animation:
      puffAppear .9s
      cubic-bezier(.22, .8, .3, 1)
      1.35s
      forwards;
}

@keyframes puffAppear {

  0% {
    opacity: 0;

    transform:
        scale(.3)
        rotate(-8deg);
  }

  35% {
    opacity: 1;

    transform:
        scale(1.12)
        rotate(3deg);
  }

  65% {
    opacity: 1;

    transform:
        scale(.96)
        rotate(-1deg);
  }

  100% {
    opacity: 1;

    transform:
        scale(1)
        rotate(0);
  }
}


/* ============================= */
/* Hide Pokeball after flash */
/* ============================= */

.pokeball {
  animation:
      throwPokeball 1.25s
      cubic-bezier(.22, .75, .3, 1)
      forwards,

      hidePokeball .2s
      ease
      1.35s
      forwards;
}

@keyframes hidePokeball {

  from {
    opacity: 1;
    transform: scale(1);
  }

  to {
    opacity: 0;
    transform: scale(.6);
  }
}


/* ============================= */
/* Message */
/* ============================= */

.Notice {
  width: 400px;
  max-width: 100%;

  display: flex;
  flex-direction: column;

  gap: 12px;

  opacity: 0;

  transform: translateY(20px);

  animation:
      noticeAppear .7s
      ease-out
      2s
      forwards;
}

@keyframes noticeAppear {

  from {
    opacity: 0;
    transform: translateY(20px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

</style>