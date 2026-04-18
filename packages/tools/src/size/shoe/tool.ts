import { defineTool } from "../../core/definition.js";
import {
  invalidInput,
  toolSuccess,
  type ToolIssue,
  type ToolResult,
} from "../../core/result.js";
import {
  shoeSizeSystemMarkets,
  type ShoeSizeMatch,
  type ShoeSizeProfile,
  type ShoeSizeSystem,
  type ShoeSizeTableRow,
} from "../core.js";

export type ShoeSizeInput = {
  readonly profile: ShoeSizeProfile;
  readonly size: number | string;
  readonly system: ShoeSizeSystem;
};

export type ShoeSizeOutput = {
  readonly footLengthMm: number;
  readonly input: {
    readonly label: string;
    readonly system: ShoeSizeSystem;
  };
  readonly matches: readonly ShoeSizeMatch[];
  readonly profile: ShoeSizeProfile;
  readonly warning: string;
};

const systems: readonly ShoeSizeSystem[] = [
  "mondopoint",
  "eu",
  "uk",
  "us",
  "jp",
  "cn",
  "kr",
];
const profiles: readonly ShoeSizeProfile[] = ["women", "men", "children"];
const BARLEYCORN_MM = 25.4 / 3;
const TOE_ALLOWANCE_MM = 12.7;

// The conversion model uses physical length-grading units rather than a
// copied brand table: a Paris point is 20/3 mm, a barleycorn is 1/3 inch,
// and measurement-based systems retain their millimetre or centimetre value.

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const roundHalf = (value: number): number => Math.round(value * 2) / 2;

const conciseNumber = (value: number): string =>
  Number.isInteger(value) ? String(value) : value.toFixed(1);

const parseFiniteSize = (value: unknown): number | null => {
  if (
    (typeof value !== "number" && typeof value !== "string") ||
    (typeof value === "string" && value.trim() === "")
  )
    return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : null;
};

const parseChildScale = (
  value: unknown,
  system: "uk" | "us",
): number | null => {
  if (typeof value === "number")
    return Number.isFinite(value) && value > 0 ? value : null;
  if (typeof value !== "string") return null;
  const match = value
    .trim()
    .toUpperCase()
    .match(/^(\d+(?:\.5)?)([CKY])?$/);
  if (!match) return null;
  const number = Number(match[1]);
  const suffix = match[2];
  if (!Number.isFinite(number) || number <= 0) return null;
  if (suffix === "Y") return number + 13;
  if (system === "uk" && suffix === "C") return null;
  if (system === "us" && suffix === "K") return null;
  return number;
};

const childLabel = (rawSize: number, system: "uk" | "us"): string => {
  const rounded = roundHalf(rawSize);
  return rounded >= 14
    ? `${conciseNumber(rounded - 13)}Y`
    : `${conciseNumber(rounded)}${system === "us" ? "C" : "K"}`;
};

const adultUkFromFootLength = (footLengthMm: number): number =>
  (footLengthMm + TOE_ALLOWANCE_MM) / BARLEYCORN_MM - 25;

const childUkFromFootLength = (footLengthMm: number): number =>
  (footLengthMm + TOE_ALLOWANCE_MM) / BARLEYCORN_MM - 12;

const footLengthFromSize = (input: ShoeSizeInput): number | null => {
  const size =
    input.profile === "children" &&
    (input.system === "uk" || input.system === "us")
      ? parseChildScale(input.size, input.system)
      : parseFiniteSize(input.size);
  if (size === null) return null;

  switch (input.system) {
    case "mondopoint":
    case "cn":
    case "kr":
      return size;
    case "jp":
      return size * 10;
    case "eu":
      return size * (20 / 3) - 40 / 3;
    case "uk":
      return (
        (size + (input.profile === "children" ? 12 : 25)) * BARLEYCORN_MM -
        TOE_ALLOWANCE_MM
      );
    case "us": {
      const ukSize =
        input.profile === "children"
          ? size - 1
          : size - (input.profile === "women" ? 2 : 0.5);
      return (
        (ukSize + (input.profile === "children" ? 12 : 25)) * BARLEYCORN_MM -
        TOE_ALLOWANCE_MM
      );
    }
  }
};

export const shoeSizeMatchesFromFootLength = (
  footLengthMm: number,
  profile: ShoeSizeProfile,
): readonly ShoeSizeMatch[] => {
  const uk =
    profile === "children"
      ? childUkFromFootLength(footLengthMm)
      : adultUkFromFootLength(footLengthMm);
  const labels: Readonly<Record<ShoeSizeSystem, string>> = {
    cn: String(Math.round(footLengthMm / 5) * 5),
    eu: conciseNumber(roundHalf((footLengthMm + 40 / 3) / (20 / 3))),
    jp: conciseNumber(Math.round(footLengthMm / 5) / 2),
    kr: String(Math.round(footLengthMm / 5) * 5),
    mondopoint: String(Math.round(footLengthMm / 5) * 5),
    uk:
      profile === "children"
        ? childLabel(uk, "uk")
        : conciseNumber(roundHalf(uk)),
    us:
      profile === "children"
        ? childLabel(uk + 1, "us")
        : conciseNumber(roundHalf(uk + (profile === "women" ? 2 : 0.5))),
  };

  return systems.map((system) => ({
    confidence: ["cn", "jp", "kr", "mondopoint"].includes(system)
      ? "exact"
      : "recommended",
    label: labels[system],
    markets: shoeSizeSystemMarkets[system],
    system,
  }));
};

export const createShoeSizeTable = (
  profile: ShoeSizeProfile,
): readonly ShoeSizeTableRow[] => {
  const minimum = profile === "children" ? 90 : 215;
  const maximum = profile === "children" ? 245 : 325;
  const rows: ShoeSizeTableRow[] = [];
  for (let footLengthMm = minimum; footLengthMm <= maximum; footLengthMm += 5)
    rows.push({
      footLengthMm,
      matches: shoeSizeMatchesFromFootLength(footLengthMm, profile),
    });
  return rows;
};

export const shoeSizeInputSchema = {
  additionalProperties: false,
  properties: {
    profile: { enum: profiles, type: "string" },
    size: { anyOf: [{ type: "number" }, { type: "string" }] },
    system: { enum: systems, type: "string" },
  },
  required: ["profile", "size", "system"],
  type: "object",
} as const;

export const shoeSizeOutputSchema = {
  additionalProperties: false,
  properties: {
    footLengthMm: { exclusiveMinimum: 0, type: "number" },
    input: { type: "object" },
    matches: { type: "array" },
    profile: { enum: profiles, type: "string" },
    warning: { type: "string" },
  },
  required: ["footLengthMm", "input", "matches", "profile", "warning"],
  type: "object",
} as const;

export const isShoeSizeOutput = (value: unknown): value is ShoeSizeOutput =>
  isRecord(value) &&
  typeof value.footLengthMm === "number" &&
  Number.isFinite(value.footLengthMm) &&
  value.footLengthMm > 0 &&
  isRecord(value.input) &&
  Array.isArray(value.matches) &&
  profiles.includes(value.profile as ShoeSizeProfile) &&
  typeof value.warning === "string";

export const compareShoeSizes = (
  input: unknown,
): ToolResult<ShoeSizeOutput> => {
  if (!isRecord(input))
    return invalidInput([
      {
        code: "object_required",
        field: "",
        message: "Input must be an object.",
      },
    ]);

  const issues: ToolIssue[] = [];
  if (!profiles.includes(input.profile as ShoeSizeProfile))
    issues.push({
      code: "unsupported_profile",
      field: "profile",
      message: "Profile must be women, men, or children.",
    });
  if (!systems.includes(input.system as ShoeSizeSystem))
    issues.push({
      code: "unsupported_system",
      field: "system",
      message: "The source sizing system is not supported.",
    });
  const known = new Set(["profile", "size", "system"]);
  for (const field of Object.keys(input))
    if (!known.has(field))
      issues.push({
        code: "unknown_field",
        field,
        message: `${field} is not a supported input field.`,
      });
  if (issues.length > 0) return invalidInput(issues);

  const profile = input.profile as ShoeSizeProfile;
  const system = input.system as ShoeSizeSystem;
  const footLengthMm = footLengthFromSize({
    profile,
    size: input.size as number | string,
    system,
  });
  if (
    footLengthMm === null ||
    !Number.isFinite(footLengthMm) ||
    footLengthMm < 70 ||
    footLengthMm > 400
  )
    return invalidInput([
      {
        code: "invalid_size",
        field: "size",
        message: "Size must resolve to a foot length from 70 to 400 mm.",
      },
    ]);

  return toolSuccess({
    footLengthMm,
    input: { label: String(input.size), system },
    matches: shoeSizeMatchesFromFootLength(footLengthMm, profile),
    profile,
    warning:
      "Recommended conversion only. Shoe lasts, toe allowance, width, and brand fit vary.",
  });
};

export const shoeSizeTool = defineTool<ShoeSizeInput, ShoeSizeOutput>({
  contractVersion: 1,
  description:
    "Compare shoe sizes through foot length across Mondopoint, EU, UK, US, Japanese, Chinese, and Korean systems.",
  execute: compareShoeSizes,
  executionKind: "pure",
  id: "size/shoe",
  inputSchema: shoeSizeInputSchema,
  isOutput: isShoeSizeOutput,
  outputSchema: shoeSizeOutputSchema,
  title: "Shoe Size Comparison",
});
