---
name: Pokedex66
description: Pokedex Vue 3 + TypeScript sobre PokeAPI, fiel a un Figma dado como parte de una prueba técnica.
colors:
  ink: "#1a1a1a"
  ink-secondary: "#757575"
  ink-muted: "#9E9E9E"
  border: "#e0e0e0"
  surface: "#ffffff"
  action-blue: "#2563eb"
  type-bug: "#43A047"
  type-dragon: "#00ACC1"
  type-ground: "#FFB300"
  type-fairy: "#E91E63"
  type-fighting: "#E53935"
  type-fire: "#FF9800"
  type-flying: "#00BCD4"
  type-ghost: "#8E24AA"
  type-ice: "#3D8BFF"
  type-grass: "#8BC34A"
  type-steel: "#546E7A"
  type-normal: "#546E7A"
  type-poison: "#9C27B0"
  type-psychic: "#673AB7"
  type-rock: "#795548"
  type-dark: "#546E7A"
  type-electric: "#FDD835"
  type-water: "#2196F3"
typography:
  display:
    fontFamily: "Poppins, sans-serif"
    fontSize: "32px"
    fontWeight: 600
    lineHeight: 1
    letterSpacing: "normal"
  body:
    fontFamily: "ui-sans-serif, system-ui, sans-serif"
    fontSize: "15px"
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: "normal"
  label:
    fontFamily: "ui-sans-serif, system-ui, sans-serif"
    fontSize: "12px"
    fontWeight: 600
    lineHeight: 1.2
    letterSpacing: "0.02em"
rounded:
  pill: "999px"
  card: "16px"
  stat: "14px"
  circle: "50%"
spacing:
  xs: "4px"
  sm: "8px"
  md: "16px"
  lg: "24px"
  xl: "32px"
components:
  button-primary:
    backgroundColor: "{colors.action-blue}"
    textColor: "{colors.surface}"
    rounded: "{rounded.pill}"
    padding: "12px 24px"
  chip-type:
    backgroundColor: "{colors.type-fire}"
    textColor: "{colors.surface}"
    rounded: "{rounded.pill}"
    padding: "3px 6px"
  card-pokemon:
    backgroundColor: "{colors.type-fire}"
    rounded: "{rounded.card}"
  stat-card:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    rounded: "{rounded.stat}"
    padding: "10px 14px"
---

# Design System: Pokedex66

## Overview

**Creative North Star: "El Manual de Campo"**

Pokedex66 se lee como una ficha de campo: precisa, sin adornos, donde cada dato tiene su lugar fijo y el único elemento que cambia de una pantalla a otra es el color, dictado siempre por el tipo del pokemon que se está mostrando. No hay una paleta de marca propia — el "color de marca" literalmente lo elige el dato. El resto de la interfaz vive en una escala de grises neutros (`#1a1a1a` / `#757575` / `#e0e0e0`) que nunca compite con ese acento.

Este documento describe **lo que ya existe en el código**, que a su vez sigue un Figma ya entregado como parte de una prueba técnica. **El Figma es la fuente de verdad** — este archivo documenta y sirve de referencia para iteración (`/impeccable live`), pero no autoriza desviarse de esa spec.

**Key Characteristics:**
- Flat por completo: cero `box-shadow` en toda la base de código. La profundidad no existe como recurso.
- Un único acento por pantalla: el color del tipo de pokemon (18 valores en `types.json`), nunca un color de marca fijo.
- Poppins (600) reservado exclusivamente para texto identitario del pokemon (nombre, "Debilidades"); todo lo demás usa la pila sans del sistema.
- Chips, cards y stat-boxes comparten el mismo lenguaje de esquinas redondeadas y borde de 1px — nada de bordes gruesos ni decorativos.

## Colors

La paleta funcional es neutra; el color vivo lo aporta siempre el tipo de pokemon activo en pantalla.

### Primary (dinámico, por dato)
- **Color de Tipo** (18 valores, ver frontmatter `type-*`): fondo de card (a 42% de opacidad), fondo del contenedor de imagen (72%), fondo de chip (100%, texto blanco forzado), y fondo del hero en el detalle. Es el mecanismo de acento de todo el sistema — nunca un valor fijo.

### Neutral
- **Tinta** (`#1a1a1a`): texto principal, nombres, valores de stat-card.
- **Tinta Secundaria** (`#757575` / `#9E9E9E`): labels, número de pokedex, texto de apoyo.
- **Borde Perla** (`#e0e0e0`): divisores, borde de stat-card.
- **Superficie** (`#ffffff`): fondo base de la vista de detalle y de las stat-cards.

### Sin resolver
- **Azul de Acción** (`#2563eb`, Tailwind `blue-600`): usado en el botón de aplicar filtros y en el badge de conteo de filtros. Y por separado, `#2196f3` en la barra de género del detalle (masculino) — coincide con el azul del tipo Agua, pero es una elección arbitraria mía, no confirmada contra el Figma. **Hay dos azules distintos en la app sin una regla que los unifique**; queda para verificar contra el Figma antes de tratarlo como token oficial.

### Named Rules
**La Regla del Único Acento.** Ninguna pantalla define un color de marca fijo. El único acento permitido es el color del tipo de pokemon activo; todo lo demás es escala de grises.

## Typography

**Display Font:** Poppins (con fallback `sans-serif`) — único peso cargado: 600.
**Body Font:** pila sans del sistema (`ui-sans-serif, system-ui, sans-serif`, default de Tailwind).

**Character:** Poppins 600 aparece solo donde el texto ES el pokemon (su nombre, el título "Debilidades"); todo el resto de la UI —labels, botones, descripciones, navegación— usa la tipografía neutra del sistema. Es una separación deliberada entre "identidad del dato" y "chrome de la interfaz".

### Hierarchy
- **Display** (600, 32px, line-height 1): nombre del pokemon en el detalle.
- **Headline** (600, 22px): "Debilidades" y títulos de sección equivalentes.
- **Title** (600, 21px, Poppins): nombre del pokemon en la card.
- **Body** (400, 14-15px, line-height 1.5): descripción del pokemon, texto de apoyo.
- **Label** (600, 12px, uppercase, tracking 0.02em): labels de stat-card ("PESO", "ALTURA"), "GÉNERO".
- **Micro** (400-500, 11-12px): número de pokedex (`Nº001`), chip compacto.

### Named Rules
**La Regla de Poppins Exclusivo.** Poppins se usa solo para texto que nombra al pokemon mismo. Cualquier otro texto de interfaz usa la tipografía del sistema — nunca al revés.

## Layout

Mobile-first. La grilla de pokemons pasa de 1 columna en mobile a 2/3/4 columnas en `sm`/`md`/`lg` con `gap-4`. Las cards y componentes usan la escala de espaciado de Tailwind incluyendo pasos fraccionarios (`w-31.5`, `h-25.5`) — indicio de que las medidas persiguen el pixel exacto del Figma, no un múltiplo redondo. La vista de detalle limita el contenido a `max-width: 480px` centrado, con padding lateral de 20px.

## Elevation & Depth

**Sin sombras en absoluto.** Se verificó `box-shadow` en toda la base de código y no aparece ni una vez. La profundidad no es un recurso del sistema — la separación entre elementos se resuelve con color de fondo (bloques de color por tipo) y con borde de 1px (`#e0e0e0`), nunca con elevación.

### Named Rules
**La Regla Flat-Siempre.** Ningún componente usa `box-shadow`. Si un elemento necesita separarse del fondo, se resuelve con color de superficie o borde de 1px — no con sombra.

## Shapes

Dos familias de esquina conviven:
- **Píldora** (`border-radius: 999px` / `48.61px` / `rounded-full`): chips de tipo, botones de acción, contenedor de badge/nav.
- **Redondeado suave** (`16px` en cards, `14px` en stat-cards): contenedores de contenido.
- **Círculo** (`50%`): badges de ícono dentro de los chips, elementos circulares del loader.

No hay esquinas rectas en ningún componente relevado.

## Components

### Buttons
- **Shape:** píldora (`border-radius: 999px` / `rounded-full`).
- **Primary:** fondo `#2563eb`, texto blanco, bold, padding generoso (`py-3` + horizontal amplio).
- **Ghost/Secondary:** fondo gris claro (`bg-gray-100`), texto oscuro, misma forma de píldora.

### Chips (TypeChip)
- **Style:** fondo = color del tipo al 100%, texto blanco forzado (`forceWhiteText`) o `#1a1a1a` según contraste calculado por luminancia; badge circular blanco con el ícono del tipo dentro.
- **State:** variante `compact` (más chica, usada en card) vs. tamaño completo (detalle); no hay estado "unselected" opaco fuera del filtro de Home.

### Cards / Containers (PokemonCard)
- **Corner Style:** `16px` (`rounded-2xl`).
- **Background:** color del tipo primario a 42% de opacidad; el contenedor de imagen interno usa el mismo color a 72%.
- **Shadow Strategy:** ninguna — ver Elevation.
- **Border:** ninguno.
- **Internal Padding:** `pl-4`, layout flex con gap de 1 (`gap-1`) entre nombre/id/chips.

### Stat Boxes (StatCard, detalle)
- **Style:** borde 1px `#e0e0e0`, `border-radius: 14px`, padding `10px 14px`.
- **Label:** ícono 16px + texto 12px uppercase gris (`#757575`).
- **Value:** 20px, 600, `#1a1a1a`; variante `uppercaseValue` para categoría.

### Navigation (AppLayout)
- Sidebar en desktop, bottom nav en mobile. Ítem activo en azul (`text-blue-600` implícito por clase Tailwind), inactivo en gris. Forma `rounded-lg` en el hover del sidebar.

### Type Icon Backdrop (componente de firma)
Marca de agua decorativa: el ícono del tipo primario, enmascarado con un gradiente blanco diagonal (`linear-gradient(147.44deg, #fff 0.68%, transparent 101.63%)`), posicionado en la esquina superior derecha de la card (`TypeIconBackdrop`) o centrado y ampliado detrás del sprite en el hero del detalle. Mismo componente, dos escalas — no se duplica la técnica.

## Do's and Don'ts

### Do:
- **Do** seguir el Figma entregado al pixel cuando exista una referencia para esa pantalla — es la fuente de verdad, no este documento.
- **Do** usar el color del tipo de pokemon como único acento; nunca introducir un color de marca fijo nuevo.
- **Do** reservar Poppins 600 exclusivamente para texto que nombra al pokemon.
- **Do** reusar `TypeChip`, `StatCard`, `TypeIconBackdrop` y `PokeballLoader` antes de crear un componente nuevo para el mismo propósito.

### Don't:
- **Don't** agregar `box-shadow` en ningún componente — el sistema es flat en el 100% del código relevado.
- **Don't** cargar otro peso de Poppins — solo 600 está importado en `index.html`.
- **Don't** tratar `#2563eb`/`#2196f3` como tokens resueltos sin confirmarlos contra el Figma primero (ver "Sin resolver" en Colors).
