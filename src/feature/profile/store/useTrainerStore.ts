import {defineStore} from "pinia";
import {ref} from "vue";
import {getProfileSetup} from "@/core/utils/profileSetup";
import {LEGENDARY_IDS, MAX_TEAM_SIZE} from "../data/journeyPools";

const STORAGE_KEY = "pokedex66:trainer_team";

interface StoredTeam {
    team: number[];
    capturedLegendaryIds: number[];
}

function loadStoredTeam(): StoredTeam {
    const raw = localStorage.getItem(STORAGE_KEY);

    if (raw) {
        return JSON.parse(raw);
    }

    const starterId = getProfileSetup()?.starterId;
    return {team: starterId ? [starterId] : [], capturedLegendaryIds: []};
}

export const useTrainerStore = defineStore("trainer", () => {
    const profile = getProfileSetup();
    const stored = loadStoredTeam();

    const name = ref(profile?.name ?? "");
    const gender = ref(profile?.gender ?? "boy");
    const starterId = ref(profile?.starterId ?? null);

    const team = ref<number[]>(stored.team);
    const capturedLegendaryIds = ref<number[]>(stored.capturedLegendaryIds);

    function persist() {
        localStorage.setItem(STORAGE_KEY, JSON.stringify({
            team: team.value,
            capturedLegendaryIds: capturedLegendaryIds.value,
        }));
    }

    function isTeamFull(): boolean {
        return team.value.length >= MAX_TEAM_SIZE;
    }

    /*
     * Sin probabilidad de captura ni confirmación adicional (spec §7).
     * Devuelve false si no había espacio, para que el llamador decida qué hacer.
     */
    function capturePokemon(id: number): boolean {
        if (isTeamFull()) return false;

        team.value.push(id);

        if (LEGENDARY_IDS.has(id) && !capturedLegendaryIds.value.includes(id)) {
            capturedLegendaryIds.value.push(id);
        }

        persist();
        return true;
    }

    /*
     * El starter queda protegido para conservar el sentido del onboarding (spec §9).
     * Un legendario liberado sigue bloqueado: capturedLegendaryIds no se toca acá.
     */
    function releasePokemon(id: number): boolean {
        if (id === starterId.value) return false;

        const index = team.value.indexOf(id);
        if (index === -1) return false;

        team.value.splice(index, 1);
        persist();
        return true;
    }

    return {
        name,
        gender,
        starterId,
        team,
        capturedLegendaryIds,
        isTeamFull,
        capturePokemon,
        releasePokemon,
    };
});
