# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

El público que realmente juzga este entregable es un evaluador/reclutador de un proceso de selección técnica (tipo Global66): revisa la app funcionando como lo haría un usuario final, pero evalúa craft técnico, arquitectura y fidelidad a las especificaciones de diseño entregadas. El producto está construido para sentirse como una pokedex real de cara a un usuario final (un fan o entrenador explorando/buscando pokemons), pero las decisiones de producto priorizan lo que un evaluador técnico notaría.

## Product Purpose

Servir como pieza de evaluación técnica para un proceso de selección: demostrar dominio de Vue 3 + TypeScript, disciplina arquitectónica y fidelidad a especificaciones de diseño dadas, sobre datos reales de PokeAPI. Funcionalmente es una pokedex: buscar, filtrar por tipo y ver el detalle de cada pokemon.

## Positioning

Lo que distingue esta entrega de una implementación genérica de tutorial es la disciplina arquitectónica (store global de lista/búsqueda separado del viewmodel aislado de detalle, services puros sin acoplar a Pinia) y la fidelidad exacta a las specs de diseño entregadas, en vez de aproximaciones genéricas de "pokedex de ejemplo".

## Operating Context

Revisado por un evaluador en desktop o mobile durante una revisión de código/producto. Todos los datos vienen en vivo de PokeAPI (sin mocks): listado con paginación/scroll infinito, filtro por tipo (multi-select aditivo), búsqueda por nombre, y detalle con datos cruzados de varios endpoints (species, ability, type damage relations).

## Capabilities and Constraints

- Grid de pokemons con scroll infinito y filtro por tipo; búsqueda por nombre.
- Vista de detalle con descripción, categoría, habilidad, ratio de género y debilidades calculadas correctamente contra la tabla real de efectividad de tipos (no una unión ingenua de `damage_relations`).
- **Confirmado:** existen specs de diseño puntuales (capturas/medidas ya entregadas) que las pantallas construidas (card, detail) siguen al pixel cuando existen. Sin spec para una pantalla nueva, hay libertad dentro del sistema visual ya establecido.
- Sin backend propio — todo contra la PokeAPI pública.
- El ítem de nav "Favoritos" existe visualmente pero la feature no está implementada.

## Brand Commitments

- Nombre del proyecto: `pokedex66`.
- Tipografía: Poppins, peso 600 (único peso cargado).
- Paleta: color dinámico por tipo de Pokémon (`POKEMON_TYPES` / `types.json`), no una paleta de marca fija.
- Iconografía: `@heroicons/vue` (24 outline/solid) combinado con el set de íconos de tipo custom en `/assets/icons`.

## Evidence on Hand

Existe un **Figma ya establecido** como parte de la prueba técnica — es la fuente de verdad y el diseño **debe respetarse tal cual**, sin desviarse. Lo ya construido (`PokemonCard.vue`, `PokemonDetailView.vue`) sigue capturas/medidas de ese Figma discutidas en sesión. Cualquier trabajo visual futuro (incluido `DESIGN.md` y `live`) documenta y refina dentro de esa spec — no propone una dirección visual alternativa.

## Product Principles

1. Cuando existe una referencia visual dada, se sigue esa spec al pixel antes que la interpretación libre.
2. Separación estricta de responsabilidades: store de lista, viewmodel de detalle y service de red no se pisan entre sí.
3. Datos siempre reales de PokeAPI, nunca mockeados — incluso cuando eso implica calcular algo (como debilidades) en vez de traerlo directo.
4. Reusar patrones ya establecidos (`TypeChip`, `TypeIconBackdrop`, `PokeballLoader`) antes de crear uno nuevo.
