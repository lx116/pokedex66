import {Pokemon} from "@/core/models/pokemonModel";
import {PokemonDetail} from "@/core/models/pokemonDetailModel";

interface AbilityEntryDto {
    ability: { name: string; url: string };
    is_hidden: boolean;
    slot: number;
}

interface LocalizedTextDto {
    language: { name: string };
}

interface FlavorTextEntryDto extends LocalizedTextDto {
    flavor_text: string;
}

interface GenusEntryDto extends LocalizedTextDto {
    genus: string;
}

export interface PokemonSpeciesDto {
    flavor_text_entries: FlavorTextEntryDto[];
    genera: GenusEntryDto[];
    gender_rate: number;
}

export interface AbilityDto {
    names: { name: string; language: { name: string } }[];
}

export interface TypeRelationDto {
    name: string;
    url: string;
}

export interface TypeDamageRelationsDto {
    double_damage_from: TypeRelationDto[];
    half_damage_from: TypeRelationDto[];
    no_damage_from: TypeRelationDto[];
}

function preferSpanish<T extends LocalizedTextDto>(entries: T[]): T | undefined {
    return entries.find(entry => entry.language.name === "es") ?? entries.find(entry => entry.language.name === "en");
}

export function extractPrimaryAbilitySlug(abilities: AbilityEntryDto[]): string {
    const primary = abilities.find(entry => !entry.is_hidden) ?? abilities[0];
    return primary.ability.name;
}

export function extractAbilityName(dto: AbilityDto, fallbackSlug: string): string {
    const localized = preferSpanish(dto.names);
    return localized?.name ?? fallbackSlug.replace(/-/g, " ");
}

export function extractDescription(species: PokemonSpeciesDto): string {
    const entry = preferSpanish(species.flavor_text_entries);
    return (entry?.flavor_text ?? "").replace(/[\n\f\r]+/g, " ").replace(/\s+/g, " ").trim();
}

export function extractCategory(species: PokemonSpeciesDto): string {
    const entry = preferSpanish(species.genera);
    return (entry?.genus ?? "").replace(/^pok[eé]mon\s+/i, "").trim();
}

export function calculateWeaknesses(relationsList: TypeDamageRelationsDto[]): string[] {
    const multipliers = new Map<string, number>();

    for (const relations of relationsList) {
        for (const {name} of relations.double_damage_from) {
            multipliers.set(name, (multipliers.get(name) ?? 1) * 2);
        }
        for (const {name} of relations.half_damage_from) {
            multipliers.set(name, (multipliers.get(name) ?? 1) * 0.5);
        }
        for (const {name} of relations.no_damage_from) {
            multipliers.set(name, (multipliers.get(name) ?? 1) * 0);
        }
    }

    return Array.from(multipliers.entries())
        .filter(([, multiplier]) => multiplier > 1)
        .sort((a, b) => b[1] - a[1])
        .map(([name]) => name);
}

export function createPokemonDetail(
    base: Pokemon,
    species: PokemonSpeciesDto,
    ability: string,
    weaknesses: string[],
): PokemonDetail {
    return {
        ...base,
        description: extractDescription(species),
        category: extractCategory(species),
        ability,
        genderRate: species.gender_rate,
        weaknesses,
    };
}
