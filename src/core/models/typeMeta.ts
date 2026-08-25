import rawTypes from "@/assets/json/types.json";

export interface PokemonTypeMeta {
    name: string;
    spanishName: string;
    color: string;
    iconUrl: string;
}

const iconModules = import.meta.glob("../../assets/icons/*.svg", {
    eager: true,
    import: "default",
}) as Record<string, string>;

function resolveIconUrl(fileName: string): string {
    const match = Object.entries(iconModules).find(([path]) => path.endsWith(`/${fileName}`));
    return match?.[1] ?? "";
}

export const POKEMON_TYPES: PokemonTypeMeta[] = rawTypes.types.map((entry) => {
    const [name, meta] = Object.entries(entry)[0] as [string, { icon: string; color: string; spanish_name: string }];

    return {
        name,
        spanishName: meta.spanish_name,
        color: meta.color,
        iconUrl: resolveIconUrl(meta.icon),
    };
});
