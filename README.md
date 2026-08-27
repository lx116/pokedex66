<p align="center">
  <img src="src/assets/pokedex66.png" alt="Pokedex66" />
</p>

---

<h3 align="center">Luis E Vélez</h3>

<p align="center">
  Software Developer
</p>

<p align="center">
  <a href="mailto:luivelez.dev@gmail.com">
    <img src="https://img.shields.io/badge/Email-luivelez.dev%40gmail.com-EA4335?style=for-the-badge&logo=gmail&logoColor=white" alt="Email" />
  </a>
  <a href="https://www.linkedin.com/in/luis-enrique-velez-santos/">
    <img src="https://img.shields.io/badge/LinkedIn-Luis%20E%20Vélez-0A66C2?style=for-the-badge&logo=linkedin&logoColor=white" alt="LinkedIn" />
  </a>
  <a href="https://www.instagram.com/luis_velez.dev/">
    <img src="https://img.shields.io/badge/Instagram-@luis__velez.dev-E4405F?style=for-the-badge&logo=instagram&logoColor=white" alt="Instagram" />
  </a>
</p>


<h3 align="center">Live Preview</h3>

<p align="center">
  <a href="https://pokedex66.velantos.com">
    <img src="https://img.shields.io/badge/OPEN%20LIVE%20PREVIEW-pokedex66.velantos.com-FF3B00?style=for-the-badge&logo=googlechrome&logoColor=white" alt="Live Preview" />
  </a>
</p>

---

## Sobre el proyecto

Prueba técnica desarrollada con Vue para explorar Pokémon, consultar su detalle y administrar favoritos. Los datos provienen de [PokéAPI](https://pokeapi.co/): el listado y la búsqueda/detalle por nombre se complementan con información de tipos, especies y habilidades para la vista de detalle.

## Funcionalidades

- Listado de Pokémon con paginación e *infinite scroll*.
- Búsqueda por nombre, detalle enriquecido y estados de carga, error o sin resultados mediante el loader de Pokébola.
- Filtros por uno o varios tipos; la búsqueda y los filtros se reflejan en la URL (`q` y `types`) para compartir una consulta.
- Favoritos administrados con Pinia y persistidos localmente en el navegador.
- Interfaz responsive para escritorio y dispositivos móviles.
- Copia al portapapeles de los datos principales desde el detalle del Pokémon.

## Tecnologías

- **Vue 3** con Composition API y `<script setup>`.
- **TypeScript** para código tipado.
- **Vite** para desarrollo local y compilaciones de producción.
- **Vue Router** para navegación y filtros controlados por URL.
- **Pinia** para el estado compartido de Pokémon y favoritos.
- **Axios** para las solicitudes a PokéAPI.
- **Tailwind CSS** para estilos adaptables.
- **Vitest** para pruebas unitarias.

## Diseño de referencia

[Archivo de Figma — Pokédex](https://figma.com/design/edU7Pms8bvosgSYW23yOds/Pokédex?node-id=0-1&t=SsODsVPCyjixaxoD-0)

## Puesta en marcha

Requiere Node.js `>=22.12.0`.

```bash
npm install
npm run dev
```

## Scripts disponibles

| Comando | Descripción |
| --- | --- |
| `npm run dev` | Inicia el entorno de desarrollo. |
| `npm run build` | Ejecuta la comprobación de tipos y genera la compilación de producción. |
| `npm run preview` | Sirve localmente la compilación generada. |
| `npm run test` | Ejecuta Vitest en modo interactivo. |
| `npm run type-check` | Ejecuta la comprobación de tipos con `vue-tsc`. |

## Arquitectura

- `src/feature`: organiza las vistas y componentes por funcionalidad (inicio, detalle y favoritos).
- `src/core`: concentra modelos, clientes de API, mapeos DTO a modelo, stores y utilidades compartidas.
- Los DTO de PokéAPI se transforman en modelos de la aplicación antes de llegar a las vistas, evitando acoplar la UI a las respuestas remotas.

## Decisiones técnicas

- **Estado:** Pinia separa el catálogo de Pokémon de los favoritos; estos últimos se guardan en `localStorage` y no requieren backend.
- **Navegación compartible:** `q` representa el nombre buscado y `types` los tipos seleccionados. Cuando ambos existen, el resultado debe coincidir con la búsqueda y con alguno de los tipos elegidos.
- **Carga progresiva:** el catálogo se obtiene en lotes de 20 y un `IntersectionObserver` solicita el siguiente lote antes de alcanzar el final de la lista.

## Pruebas

El proyecto incluye **9 archivos de prueba** con **49 casos**. Cubren la carga y los errores del detalle, el store y la lista de Pokémon, la búsqueda, los filtros, la sincronización de la URL, los mensajes sin resultados y los estados del loader de Pokébola.

## Consideraciones de escalabilidad

- El listado general pagina los nombres y carga el detalle solo del lote visible.
- En filtros por tipo, la API entrega los miembros de cada tipo; se deduplican, ordenan y se hidratan progresivamente para mantener la interfaz fluida.

## Limitaciones conocidas

- Los favoritos dependen del navegador y dispositivo actual; no se sincronizan entre sesiones ni usuarios.
- La copia al portapapeles depende de que el navegador exponga `navigator.clipboard` y conceda los permisos correspondientes.
