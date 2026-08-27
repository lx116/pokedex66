# Profile Journey — Planning

## Objetivo

Completar el minijuego del apartado `Profile`.

El usuario ya tiene creado su entrenador, seleccionó su starter y existe un sprite de caminar. Falta implementar el recorrido automático, cambio de terrenos, encuentros periódicos, selección de Pokémon, notificaciones y gestión del equipo.

La feature debe permanecer deliberadamente pequeña.

**No implementar combate, Poké Balls, niveles, experiencia, evolución ni inventario.**

---

## Flujo principal

```text
Profile
   ↓
Trainer + Starter
   ↓
Comienza recorrido automático
   ↓
Terreno actual
   ↓
Timer
   ↓
Encuentro con 3 Pokémon
   ↓
Capturar uno / Ignorar
   ↓
Continuar recorrido
   ↓
Equipo llega a 6
   ↓
Recorrido se detiene
```

El equipo tiene máximo:

```ts
const MAX_TEAM_SIZE = 6
```

El starter cuenta como el primer Pokémon.

---

## 1. Recorrido circular

Crear un elemento circular dentro de `Profile` donde se muestre el sprite del entrenador caminando.

El entrenador puede mantenerse visualmente estable mientras se anima el entorno para dar sensación de movimiento.

Existen únicamente tres terrenos:

```ts
type Terrain = 'grass' | 'fire' | 'water'
```

Se recorren de forma cíclica:

```text
grass → fire → water → grass → ...
```

Dentro del círculo debe aparecer el **asset/logo correspondiente al terreno actual**.

No crear nuevos logos ni ilustraciones si ya existen assets apropiados.

Ejemplo conceptual:

```text
      [ GRASS ASSET ]

          🚶
       walking sprite

   Próximo encuentro
        00:23
```

Cuando cambia el terreno, cambiar también el asset y la ambientación visual correspondiente.

---

## 2. Timer global

El encuentro ocurre cada `X` segundos.

Debe ser configurable mediante una constante:

```ts
const ENCOUNTER_INTERVAL = 30_000
```

El valor exacto puede ajustarse posteriormente.

No depender únicamente de un `setInterval`.

Guardar preferiblemente:

```ts
nextEncounterAt: number
```

como timestamp.

Esto permite que el countdown continúe siendo consistente aunque el usuario navegue entre vistas.

Estados:

```ts
type JourneyStatus =
  | 'traveling'
  | 'encounter'
  | 'team-full'
```

Mientras:

```ts
status === 'traveling'
```

el timer continúa.

Cuando llega a cero:

```ts
status = 'encounter'
```

y el timer se detiene hasta resolver el encuentro.

---

## 3. Encuentros fuera de Profile

El timer debe continuar mientras el usuario utiliza otras partes de la aplicación.

Si ocurre un encuentro mientras está en:

```text
Pokedex
Regions
Favorites
PokemonDetail
...
```

mostrar una notificación/toast:

```text
¡Encontraste Pokémon!

Hay nuevos Pokémon esperando durante tu recorrido.

[ Ver encuentro ]
```

La acción debe navegar a:

```text
/profile
```

También puede mostrarse un indicador en el botón/icono de `Profile`.

Ejemplo:

```text
Perfil ●
```

No abrir automáticamente Profile ni interrumpir la pantalla actual.

---

## 4. JSON de Pokémon

Crear un archivo de configuración independiente.

Ejemplo:

```text
src/
  feature/
    profile/
      data/
        journeyPokemon.json
```

El JSON debe tener tres pools específicos y uno global.

Estructura sugerida:

```json
{
  "grass": {
    "basic": [],
    "special": [],
    "legendary": []
  },
  "fire": {
    "basic": [],
    "special": [],
    "legendary": []
  },
  "water": {
    "basic": [],
    "special": [],
    "legendary": []
  },
  "global": []
}
```

Cada terreno tiene exactamente:

```text
5 basic
2 special
1 legendary
```

Total:

```text
8 Pokémon propios por terreno
```

Además existen:

```text
6 Pokémon Normal/global
```

que pueden aparecer en cualquiera de los tres terrenos.

Los IDs deben ser IDs válidos de Pokémon Gen I.

No cargar automáticamente toda la PokéAPI para decidir encuentros.

La lista del JSON es **cerrada**.

---

## 5. Distribución

La selección debe favorecer Pokémon normales y básicos y hacer raros los legendarios.

No hace falta construir un RNG complejo.

Ejemplo orientativo:

```ts
const rarityWeight = {
  global: 30,
  basic: 50,
  special: 17,
  legendary: 3,
}
```

Estos valores deben estar centralizados para poder ajustarlos.

Cada encuentro genera:

```ts
3
```

Pokémon diferentes.

Nunca mostrar duplicados dentro del mismo encuentro.

---

## 6. Legendarios

Los tres legendarios disponibles son los correspondientes a Gen I.

Regla importante:

> Un legendario que ya fue capturado no puede volver a aparecer.

Ejemplo:

```text
Equipo contiene Zapdos
↓
Zapdos queda excluido de futuros encounters
```

No significa que solo se pueda tener un legendario.

Puede existir perfectamente:

```text
Articuno
Zapdos
Moltres
```

en el mismo equipo.

La única restricción es:

```text
legendario ya capturado → no vuelve a salir
```

Si posteriormente el usuario libera ese legendario, debe mantenerse igualmente bloqueado.

Usar:

```ts
capturedLegendaryIds
```

para representar legendarios obtenidos históricamente, no solo los que están actualmente en el equipo.

Esto evita farming del mismo legendario.

---

## 7. Resolución del encuentro

Cuando ocurre un encounter, pausar visualmente el recorrido.

Mostrar:

```text
¡Pokémon salvajes!

[ PokemonCard ]
[ PokemonCard ]
[ PokemonCard ]

[ Continuar sin capturar ]
```

Reutilizar el componente existente:

```text
PokemonCard
```

No crear una nueva card.

Al pulsar una card:

```ts
capturePokemon(pokemon)
```

Si hay espacio:

```ts
team.length < 6
```

añadir directamente.

No existe probabilidad de captura.

No existe confirmación adicional.

Después:

```text
encounter resolved
↓
next terrain
↓
nuevo timer
```

---

## 8. Equipo lleno

Cuando:

```ts
team.length === 6
```

el recorrido debe detenerse.

Estado:

```ts
status = 'team-full'
```

No generar nuevos encuentros mientras el equipo esté lleno.

El Profile pasa principalmente a mostrar:

```text
Trainer
+
Team
```

con las seis `PokemonCard`.

---

## 9. Liberar Pokémon

Cada miembro del equipo puede tener una acción:

```text
Liberar
```

El starter puede mantenerse protegido si se quiere conservar el significado del onboarding.

Flujo:

```text
Equipo: 6/6

Liberar Pokémon
↓
Equipo: 5/6
↓
status = traveling
↓
reiniciar journey
↓
nuevo timer
```

En cuanto exista nuevamente espacio:

```ts
team.length < MAX_TEAM_SIZE
```

el recorrido vuelve a activarse automáticamente.

No hace falta ningún sistema de PC/cajas Pokémon.

Liberar significa eliminarlo del equipo.

### Regla para legendarios liberados

Si se libera un legendario, este **no debe volver a aparecer**.

El historial de legendarios capturados se mantiene en:

```ts
capturedLegendaryIds
```

---

## 10. Persistencia

Persistir al menos:

```ts
interface JourneyState {
  terrain: Terrain
  status: JourneyStatus

  nextEncounterAt: number | null

  currentEncounter: number[]

  capturedLegendaryIds: number[]
}
```

Y el perfil:

```ts
interface TrainerProfile {
  name: string
  avatar: string

  starterId: number

  team: number[]
}
```

Puede guardarse mediante Pinia + `localStorage`.

Después de recargar la aplicación debe conservar:

```text
Entrenador
Starter
Equipo
Legendarios obtenidos
Terreno actual
Encounter pendiente
Timer
```

---

## 11. Separación de responsabilidades

No meter toda la lógica en `ProfileView.vue`.

Mantener aproximadamente:

```text
profile/
│
├── ProfileView.vue
│
├── components/
│   ├── TrainerJourney.vue
│   ├── JourneyCircle.vue
│   ├── PokemonEncounter.vue
│   └── TrainerTeam.vue
│
├── composables/
│   └── usePokemonJourney.ts
│
├── store/
│   └── useTrainerStore.ts
│
└── data/
    └── journeyPokemon.json
```

### `useTrainerStore`

Responsable de:

```text
trainer
team
capture
release
persistence
capturedLegendaryIds
```

### `usePokemonJourney`

Responsable de:

```text
timer
terrain
encounter generation
journey state
rarity
```

### `ProfileView`

Solo orquesta la UI.

---

## 12. Restricciones de implementación

El agente **no debe ampliar el scope**.

No implementar:

```text
combates
niveles
experiencia
HP
Poké Balls
items
dinero
evolución
moves
PC
gimnasios
badges
reemplazo complejo
encuentros ilimitados con equipo lleno
```

La feature termina en:

```text
Caminar
→ encontrar
→ elegir
→ completar 6
→ liberar si quieres buscar otro
```

---

## Reglas finales

1. El starter cuenta dentro del máximo de 6 Pokémon.
2. El recorrido solo existe dentro de Profile, pero el timer continúa mientras el usuario navega por la app.
3. Un encuentro pendiente pausa el timer hasta resolverse.
4. Cada encuentro contiene exactamente 3 Pokémon diferentes.
5. Cada terreno tiene exactamente 8 Pokémon propios.
6. Existen 6 Pokémon globales/Normal que pueden aparecer en cualquier terreno.
7. Los legendarios son raros, pero no existe límite de legendarios dentro del equipo.
8. Un legendario capturado no puede volver a aparecer, incluso si posteriormente es liberado.
9. Con equipo lleno no se generan nuevos encuentros.
10. Liberar un Pokémon reactiva automáticamente el recorrido si quedan menos de 6 miembros.
11. Reutilizar `PokemonCard` existente.
12. No añadir sistemas adicionales fuera de esta especificación.
