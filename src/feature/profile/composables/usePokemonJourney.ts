import {computed, ref} from "vue";
import {isProfileSetupDone} from "@/core/utils/profileSetup";
import {useTrainerStore} from "../store/useTrainerStore";
import {
    ENCOUNTER_INTERVAL,
    nextTerrain,
    poolFor,
    RARITY_WEIGHT,
    TERRAIN_ORDER,
    type Rarity,
    type Terrain,
} from "../data/journeyPools";

export type JourneyStatus = "traveling" | "encounter" | "team-full";

const STORAGE_KEY = "pokedex66:journey_state";

interface StoredJourney {
    terrain: Terrain;
    status: JourneyStatus;
    nextEncounterAt: number | null;
    currentEncounter: number[];
}

// Estado compartido a nivel de módulo: un solo recorrido para toda la app.
const terrain = ref<Terrain>(TERRAIN_ORDER[0]);
const status = ref<JourneyStatus>("traveling");
const nextEncounterAt = ref<number | null>(null);
const currentEncounter = ref<number[]>([]);
const now = ref(Date.now());

let initialized = false;

function persist() {
    const data: StoredJourney = {
        terrain: terrain.value,
        status: status.value,
        nextEncounterAt: nextEncounterAt.value,
        currentEncounter: currentEncounter.value,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

function weightedPick(pool: { id: number; rarity: Rarity }[], excluded: Set<number>): number {
    const candidates = pool.filter(p => !excluded.has(p.id));
    const totalWeight = candidates.reduce((sum, c) => sum + RARITY_WEIGHT[c.rarity], 0);

    let roll = Math.random() * totalWeight;
    for (const candidate of candidates) {
        roll -= RARITY_WEIGHT[candidate.rarity];
        if (roll <= 0) return candidate.id;
    }

    return candidates[candidates.length - 1].id;
}

function generateEncounterIds(currentTerrain: Terrain, capturedLegendaryIds: number[]): number[] {
    const pool = poolFor(currentTerrain);
    const excluded = new Set(capturedLegendaryIds);
    const picked: number[] = [];

    while (picked.length < 3) {
        picked.push(weightedPick(pool, new Set([...excluded, ...picked])));
    }

    return picked;
}

function generateEncounter() {
    const trainerStore = useTrainerStore();

    currentEncounter.value = generateEncounterIds(terrain.value, trainerStore.capturedLegendaryIds);
    status.value = "encounter";
    nextEncounterAt.value = null;
    persist();
}

/*
 * Único punto de entrada. Se llama una vez desde AppLayout (montado siempre)
 * y es seguro llamarlo también desde ProfileView: la segunda llamada es un no-op.
 */
export function initJourney() {
    if (initialized) return;
    initialized = true;

    const raw = localStorage.getItem(STORAGE_KEY);

    if (raw) {
        const stored: StoredJourney = JSON.parse(raw);
        terrain.value = stored.terrain;
        status.value = stored.status;
        nextEncounterAt.value = stored.nextEncounterAt;
        currentEncounter.value = stored.currentEncounter;
        return;
    }

    terrain.value = TERRAIN_ORDER[0];
    status.value = "traveling";
    nextEncounterAt.value = Date.now() + ENCOUNTER_INTERVAL;
    currentEncounter.value = [];
    persist();
}

/*
 * Se llama cada segundo desde AppLayout mientras la app está abierta.
 * No depende únicamente del setInterval: compara contra nextEncounterAt
 * (timestamp), así que sigue siendo correcto aunque se haya navegado
 * entre vistas o recargado la página.
 */
export function tick() {
    /*
     * AppLayout arranca este tick sin saber si el perfil ya existe (puede
     * completarse recién en esta misma sesión). Nos auto-inicializamos la
     * primera vez que hay perfil, en vez de depender de un chequeo único
     * en el mount de AppLayout.
     */
    if (!initialized) {
        if (!isProfileSetupDone()) return;
        initJourney();
    }

    now.value = Date.now();

    const trainerStore = useTrainerStore();

    if (trainerStore.isTeamFull()) {
        if (status.value !== "team-full") {
            status.value = "team-full";
            nextEncounterAt.value = null;
            persist();
        }
        return;
    }

    // Se liberó un Pokémon y ahora hay espacio: retomamos el recorrido solos.
    if (status.value === "team-full") {
        status.value = "traveling";
        nextEncounterAt.value = Date.now() + ENCOUNTER_INTERVAL;
        persist();
        return;
    }

    if (status.value !== "traveling" || nextEncounterAt.value === null) return;

    if (now.value >= nextEncounterAt.value) {
        generateEncounter();
    }
}


export function resolveEncounter(capturedId?: number) {
    const trainerStore = useTrainerStore();

    if (capturedId !== undefined) {
        trainerStore.capturePokemon(capturedId);
    }

    currentEncounter.value = [];
    terrain.value = nextTerrain(terrain.value);

    if (trainerStore.isTeamFull()) {
        status.value = "team-full";
        nextEncounterAt.value = null;
    } else {
        status.value = "traveling";
        nextEncounterAt.value = Date.now() + ENCOUNTER_INTERVAL;
    }

    persist();
}

export function usePokemonJourney() {
    const remainingSeconds = computed(() => {
        if (status.value !== "traveling" || nextEncounterAt.value === null) return 0;
        return Math.max(0, Math.ceil((nextEncounterAt.value - now.value) / 1000));
    });

    return {
        terrain,
        status,
        currentEncounter,
        remainingSeconds,
        initJourney,
        tick,
        resolveEncounter,
    };
}
