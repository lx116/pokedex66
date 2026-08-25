<script setup lang="ts">
import { onBeforeUnmount, ref, watch } from 'vue'

type LoaderState = 'idle' | 'loading' | 'success' | 'error' | 'notFound'

const props = defineProps({
  loading: {
    type: Boolean,
    default: false
  },

  error: {
    type: Boolean,
    default: false
  },

  notFound: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits<{
  complete: []
  errorComplete: []
  notFoundComplete: []
}>()

const state = ref<LoaderState>('idle')

let animationTimer: ReturnType<typeof setTimeout> | null = null

function clearAnimationTimer() {
  if (animationTimer) {
    clearTimeout(animationTimer)
    animationTimer = null
  }
}

function finishSuccess() {
  clearAnimationTimer()

  state.value = 'success'

  animationTimer = setTimeout(() => {
    state.value = 'idle'
    emit('complete')
  }, 1100)
}

function finishError() {
  clearAnimationTimer()

  state.value = 'error'

  animationTimer = setTimeout(() => {
    state.value = 'idle'
    emit('errorComplete')
  }, 1400)
}

function finishNotFound() {
  clearAnimationTimer()

  state.value = 'notFound'

  animationTimer = setTimeout(() => {
    state.value = 'idle'
    emit('notFoundComplete')
  }, 1400)
}

watch(
    () => [props.loading, props.error, props.notFound] as const,
    ([loading, error, notFound], oldValue) => {
      const previousLoading = oldValue?.[0] ?? false

      clearAnimationTimer()

      /*
       * Si empieza una nueva operación,
       * loading siempre tiene prioridad.
       */
      if (loading) {
        state.value = 'loading'
        return
      }

      /*
       * Solo mostramos resultado después
       * de haber estado cargando.
       */
      if (previousLoading && !loading) {
        if (notFound) {
          finishNotFound()
        } else if (error) {
          finishError()
        } else {
          finishSuccess()
        }
      }
    },
    {
      immediate: true
    }
)

onBeforeUnmount(() => {
  clearAnimationTimer()
})
</script>

<template>
  <div
      v-if="state !== 'idle'"
      class="pokeball-loader"
  >
    <div
        class="pokeball-wrapper"
        :class="{
        loading: state === 'loading',
        success: state === 'success',
        error: state === 'error',
        'not-found': state === 'notFound'
      }"
    >
      <img
          src="@/assets/pokeball.svg"
          class="pokeball"
          alt="Loading"
      />

      <!-- Success sparkles -->

      <span class="spark spark-1">✦</span>
      <span class="spark spark-2">✦</span>
      <span class="spark spark-3">✦</span>
      <span class="spark spark-4">✦</span>

      <!-- Error particles -->

      <span class="error-particle error-particle-1" />
      <span class="error-particle error-particle-2" />
      <span class="error-particle error-particle-3" />
      <span class="error-particle error-particle-4" />

      <!-- Error electrical bolts -->

      <span class="error-bolt error-bolt-1">ϟ</span>
      <span class="error-bolt error-bolt-2">ϟ</span>

      <!-- Not found question marks -->

      <span class="question-mark question-mark-1">?</span>
      <span class="question-mark question-mark-2">?</span>
      <span class="question-mark question-mark-3">?</span>
    </div>

    <div
        class="pokeball-shadow"
        :class="{
        'shadow-loading': state === 'loading',
        'shadow-success': state === 'success',
        'shadow-error': state === 'error',
        'shadow-not-found': state === 'notFound'
      }"
    />
  </div>
</template>

<style scoped>

/* =========================================================
   Container
   ========================================================= */

.pokeball-loader {
  position: relative;

  width: 320px;
  height: 360px;

  display: flex;
  justify-content: center;
  align-items: flex-start;
}

.pokeball-wrapper {
  position: relative;

  width: 256px;
  height: 256px;

  z-index: 2;
}

.pokeball {
  width: 100%;
  height: 100%;

  display: block;
}


/* =========================================================
   Loading
   ========================================================= */

.loading .pokeball {
  transform-origin: center bottom;

  animation:
      shake 1.2s ease-in-out infinite;
}

@keyframes shake {

  0%,
  100% {
    transform:
        translateY(0)
        rotate(0deg);
  }

  15% {
    transform:
        translateY(-20px)
        rotate(-15deg);
  }

  30% {
    transform:
        translateY(0)
        rotate(10deg);
  }

  45% {
    transform:
        translateY(-12px)
        rotate(-10deg);
  }

  60% {
    transform:
        translateY(0)
        rotate(6deg);
  }

  75% {
    transform:
        rotate(-3deg);
  }
}


/* =========================================================
   Success
   ========================================================= */

.success .pokeball {
  animation:
      successBall 1s
      cubic-bezier(.2, .8, .2, 1)
      forwards;
}

@keyframes successBall {

  0% {
    transform: scale(1);
    filter: brightness(1);
  }

  20% {
    transform: scale(.9);
  }

  40% {
    transform: scale(1.15);
    filter: brightness(1.2);
  }

  65% {
    transform: scale(.98);
  }

  100% {
    transform: scale(1);
    filter: brightness(1);
  }
}


/* =========================================================
   Success sparkles
   ========================================================= */

.spark {
  position: absolute;

  opacity: 0;

  font-size: 72px;
  line-height: 1;

  pointer-events: none;
}

.success .spark {
  animation:
      sparkle .8s ease-out forwards;
}

.spark-1 {
  top: -60px;
  left: -40px;

  animation-delay: .1s !important;
}

.spark-2 {
  top: -80px;
  right: -48px;

  animation-delay: .2s !important;
}

.spark-3 {
  bottom: 20px;
  left: -72px;

  animation-delay: .25s !important;
}

.spark-4 {
  bottom: 0;
  right: -60px;

  animation-delay: .15s !important;
}

@keyframes sparkle {

  0% {
    opacity: 0;

    transform:
        scale(0)
        rotate(0deg);
  }

  40% {
    opacity: 1;

    transform:
        scale(1.3)
        rotate(90deg);
  }

  100% {
    opacity: 0;

    transform:
        scale(.3)
        rotate(180deg);
  }
}


/* =========================================================
   Error
   ========================================================= */

.error .pokeball {
  transform-origin: center bottom;

  animation:
      brokenPokeball 1.35s
      cubic-bezier(.36, .07, .19, .97)
      forwards;
}

@keyframes brokenPokeball {

  /*
   * Empieza normal.
   */
  0% {
    transform:
        translate(0, 0)
        rotate(0deg)
        scale(1);

    filter:
        saturate(1)
        brightness(1);
  }

  /*
   * Primer tirón fuerte.
   */
  8% {
    transform:
        translate(-18px, -6px)
        rotate(-13deg)
        scale(1.03);
  }

  16% {
    transform:
        translate(20px, 2px)
        rotate(11deg)
        scale(.98);
  }

  24% {
    transform:
        translate(-15px, -2px)
        rotate(-9deg);
  }

  32% {
    transform:
        translate(13px, 1px)
        rotate(7deg);
  }

  /*
   * El dispositivo comienza a "morir".
   */
  42% {
    transform:
        translate(-8px, 3px)
        rotate(-5deg)
        scale(.97);

    filter:
        saturate(.8)
        brightness(.95);
  }

  50% {
    transform:
        translate(7px, 4px)
        rotate(4deg)
        scale(.96);
  }

  58% {
    transform:
        translate(-5px, 5px)
        rotate(-3deg);
  }

  66% {
    transform:
        translate(4px, 7px)
        rotate(2deg);

    filter:
        saturate(.45)
        brightness(.8);
  }

  /*
   * Últimos espasmos.
   */
  74% {
    transform:
        translate(-3px, 8px)
        rotate(-2deg)
        scale(.94);
  }

  82% {
    transform:
        translate(2px, 10px)
        rotate(1deg)
        scale(.93);
  }

  /*
   * Pokéball "apagada".
   */
  100% {
    transform:
        translateY(12px)
        rotate(-4deg)
        scale(.92);

    filter:
        saturate(.2)
        brightness(.7)
        contrast(.9);
  }
}


/* =========================================================
   Error particles
   ========================================================= */

.error-particle {
  position: absolute;

  width: 16px;
  height: 16px;

  border-radius: 3px;

  background: #ef4444;

  opacity: 0;

  pointer-events: none;
}

.error .error-particle {
  animation:
      errorParticle .7s ease-out forwards;
}

.error-particle-1 {
  top: 75px;
  left: 25px;

  animation-delay: .18s !important;
}

.error-particle-2 {
  top: 55px;
  right: 18px;

  animation-delay: .25s !important;
}

.error-particle-3 {
  bottom: 45px;
  left: 15px;

  animation-delay: .3s !important;
}

.error-particle-4 {
  bottom: 65px;
  right: 8px;

  animation-delay: .22s !important;
}

@keyframes errorParticle {

  0% {
    opacity: 0;

    transform:
        translate(0, 0)
        rotate(0deg)
        scale(.3);
  }

  20% {
    opacity: 1;
  }

  100% {
    opacity: 0;

    transform:
        translate(30px, -45px)
        rotate(180deg)
        scale(.1);
  }
}


/* =========================================================
   Error electrical effects
   ========================================================= */

.error-bolt {
  position: absolute;

  opacity: 0;

  font-size: 64px;
  font-weight: 700;

  line-height: 1;

  pointer-events: none;
}

.error-bolt-1 {
  top: 5px;
  right: -20px;

  transform: rotate(15deg);
}

.error-bolt-2 {
  bottom: 30px;
  left: -30px;

  transform: rotate(-25deg);
}

.error .error-bolt {
  animation:
      electricalFailure .9s steps(2, end) forwards;
}

.error-bolt-1 {
  animation-delay: .12s !important;
}

.error-bolt-2 {
  animation-delay: .28s !important;
}

@keyframes electricalFailure {

  0% {
    opacity: 0;
  }

  15% {
    opacity: 1;
  }

  30% {
    opacity: 0;
  }

  42% {
    opacity: 1;
  }

  55% {
    opacity: 0;
  }

  68% {
    opacity: .8;
  }

  100% {
    opacity: 0;
  }
}


/* =========================================================
   Not found
   ========================================================= */

.not-found .pokeball {
  transform-origin: center bottom;

  animation:
      confusedWobble 1.2s
      ease-in-out
      forwards;
}

@keyframes confusedWobble {

  0%,
  100% {
    transform: rotate(0deg);
  }

  20% {
    transform: rotate(-9deg);
  }

  40% {
    transform: rotate(7deg);
  }

  60% {
    transform: rotate(-5deg);
  }

  80% {
    transform: rotate(3deg);
  }
}

.question-mark {
  position: absolute;

  opacity: 0;

  font-size: 56px;
  font-weight: 800;
  line-height: 1;

  color: #64748B;

  pointer-events: none;
}

.not-found .question-mark {
  animation:
      questionPop .9s
      ease-out
      forwards;
}

.question-mark-1 {
  top: -55px;
  left: 0;

  animation-delay: .1s !important;
}

.question-mark-2 {
  top: -75px;
  right: -8px;

  animation-delay: .3s !important;
}

.question-mark-3 {
  top: -35px;
  right: -55px;

  animation-delay: .5s !important;
}

@keyframes questionPop {

  0% {
    opacity: 0;

    transform:
        translateY(10px)
        scale(.4)
        rotate(-10deg);
  }

  50% {
    opacity: 1;

    transform:
        translateY(-10px)
        scale(1.1)
        rotate(6deg);
  }

  100% {
    opacity: 0;

    transform:
        translateY(-25px)
        scale(.85)
        rotate(0deg);
  }
}


/* =========================================================
   Shadow
   ========================================================= */

.pokeball-shadow {
  position: absolute;

  bottom: 32px;

  width: 168px;
  height: 28px;

  border-radius: 50%;

  background: rgba(0, 0, 0, .15);

  filter: blur(8px);

  transition:
      width .2s ease,
      opacity .2s ease,
      transform .2s ease;
}


/* Loading shadow */

.shadow-loading {
  animation:
      loadingShadow 1.2s ease-in-out infinite;
}

@keyframes loadingShadow {

  0%,
  30%,
  60%,
  100% {
    transform: scaleX(1);
    opacity: 1;
  }

  15% {
    transform: scaleX(.8);
    opacity: .65;
  }

  45% {
    transform: scaleX(.88);
    opacity: .75;
  }
}


/* Success shadow */

.shadow-success {
  animation:
      successShadow 1s ease forwards;
}

@keyframes successShadow {

  0% {
    transform: scaleX(1);
  }

  40% {
    transform: scaleX(1.2);
  }

  100% {
    transform: scaleX(1);
  }
}


/* Error shadow */

.shadow-error {
  animation:
      errorShadow 1.35s ease forwards;
}

@keyframes errorShadow {

  0% {
    transform: scaleX(1);
    opacity: 1;
  }

  30% {
    transform: scaleX(1.15);
    opacity: .9;
  }

  65% {
    transform: scaleX(.95);
    opacity: .75;
  }

  100% {
    transform:
        translateY(8px)
        scaleX(.85);

    opacity: .55;
  }
}


/* Not found shadow */

.shadow-not-found {
  animation:
      notFoundShadow 1.2s ease-in-out forwards;
}

@keyframes notFoundShadow {

  0%,
  100% {
    transform: scaleX(1);
    opacity: 1;
  }
}

</style>