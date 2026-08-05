import type { FactorUnit } from "./factor-conversion.js";

export const BIPM_SI_BROCHURE =
  "https://www.bipm.org/en/publications/si-brochure";

export const siPrefixes = [
  ["q", "Quecto", 1e-30],
  ["r", "Ronto", 1e-27],
  ["y", "Yocto", 1e-24],
  ["z", "Zepto", 1e-21],
  ["a", "Atto", 1e-18],
  ["f", "Femto", 1e-15],
  ["p", "Pico", 1e-12],
  ["n", "Nano", 1e-9],
  ["u", "Micro", 1e-6],
  ["m", "Milli", 1e-3],
  ["c", "Centi", 1e-2],
  ["d", "Deci", 1e-1],
  ["", "", 1],
  ["da", "Deca", 1e1],
  ["h", "Hecto", 1e2],
  ["k", "Kilo", 1e3],
  ["M", "Mega", 1e6],
  ["G", "Giga", 1e9],
  ["T", "Tera", 1e12],
  ["P", "Peta", 1e15],
  ["E", "Exa", 1e18],
  ["Z", "Zetta", 1e21],
  ["Y", "Yotta", 1e24],
  ["R", "Ronna", 1e27],
  ["Q", "Quetta", 1e30],
] as const;

export const createSiFactors = (
  symbol: string,
  name: string,
  baseFactor = 1,
): Record<string, FactorUnit> =>
  Object.fromEntries(
    siPrefixes.map(([prefixSymbol, prefixName, factor]) => [
      `${prefixSymbol}${symbol}`,
      {
        cite: BIPM_SI_BROCHURE,
        factor: factor * baseFactor,
        name: prefixName
          ? `${prefixName}${name.toLowerCase()}`
          : `${name.charAt(0).toUpperCase()}${name.slice(1)}`,
      },
    ]),
  );
