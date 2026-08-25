export function formatDecimalEs(value: number, digits = 1): string {
    return value.toFixed(digits).replace(".", ",")
}
