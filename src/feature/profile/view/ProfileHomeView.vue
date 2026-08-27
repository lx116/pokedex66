<script setup lang="ts">
import {computed} from "vue";
import {getProfileSetup} from "@/core/utils/profileSetup";
import {STARTERS} from "@/core/models/starterMeta";
import boySprite from "@/assets/profile/boy.png";
import girlSprite from "@/assets/profile/girl.png";
import TrainerJourney from "./components/TrainerJourney.vue";
import TrainerTeam from "./components/TrainerTeam.vue";

const profile = getProfileSetup();
const isGirl = computed(() => profile?.gender === "girl");
const avatarSrc = computed(() => (isGirl.value ? girlSprite : boySprite));

const starter = computed(() =>
    STARTERS.find(s => s.id === profile?.starterId) ?? STARTERS[0]
);
</script>

<template>
  <div class="profile-home">

    <div class="profile-topbar">
      <span class="profile-name">{{ profile?.name }}</span>

      <div class="profile-avatar-frame">
        <img :src="avatarSrc" :alt="profile?.name" class="profile-avatar"/>
      </div>

      <img :src="starter.imageUrl" :alt="starter.spanishName" class="profile-starter-sprite"/>
    </div>

    <TrainerJourney/>

    <TrainerTeam/>

  </div>
</template>

<style scoped>

.profile-home {
  position: relative;

  display: flex;
  flex-direction: column;
  align-items: center;

  padding: 88px 20px 12px;
  gap: 32px;
}

.profile-topbar {
  position: absolute;
  top: 20px;
  right: 20px;

  display: flex;
  align-items: center;
  gap: 10px;
}

.profile-avatar-frame {
  width: 56px;
  height: 56px;
  flex-shrink: 0;

  border-radius: 50%;
  border: 3px solid #2563eb;
  overflow: hidden;

  display: flex;
  align-items: center;
  justify-content: center;

  background: #eff6ff;
}

.profile-avatar {
  width: 100%;
  height: 160%;

  object-fit: cover;
  object-position: top;
  image-rendering: pixelated;
}

.profile-name {
  font-size: 15px;
  font-weight: 700;
  color: #1a1a1a;
}

.profile-starter-sprite {
  width: 40px;
  height: 40px;
  flex-shrink: 0;

  object-fit: contain;
  image-rendering: pixelated;
}

</style>
