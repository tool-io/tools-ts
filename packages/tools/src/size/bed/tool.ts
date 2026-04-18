import { defineTool } from "../../core/definition.js";
import {
  invalidInput,
  toolSuccess,
  type ToolIssue,
  type ToolResult,
} from "../../core/result.js";

export type BedSizeMarket = "au" | "eu" | "jp" | "uk" | "us";

export type BedSizeEntry = {
  readonly id: string;
  readonly lengthMm: number;
  readonly market: BedSizeMarket;
  readonly name: string;
  readonly widthMm: number;
};

export type BedSizeInput = {
  readonly market: BedSizeMarket;
  readonly size: string;
};

export type BedSizeMatch = BedSizeEntry & {
  readonly confidence: "closest" | "exact";
  readonly differenceMm: number;
};

export type BedSizeOutput = {
  readonly input: BedSizeEntry;
  readonly matches: readonly BedSizeMatch[];
  readonly warning: string;
};

export const bedSizeMarketLabels: Readonly<Record<BedSizeMarket, string>> = {
  au: "Australia",
  eu: "Continental Europe",
  jp: "Japan",
  uk: "United Kingdom",
  us: "United States",
};

// Nominal mattress surface dimensions. Manufacturers can use tolerances or
// product-specific dimensions, so labels are always secondary to measurements.
export const bedSizes: readonly BedSizeEntry[] = [
  { id: "single", lengthMm: 1880, market: "au", name: "Single", widthMm: 920 },
  {
    id: "long-single",
    lengthMm: 2030,
    market: "au",
    name: "Long Single",
    widthMm: 920,
  },
  {
    id: "king-single",
    lengthMm: 2030,
    market: "au",
    name: "King Single",
    widthMm: 1070,
  },
  { id: "double", lengthMm: 1880, market: "au", name: "Double", widthMm: 1370 },
  { id: "queen", lengthMm: 2030, market: "au", name: "Queen", widthMm: 1530 },
  { id: "king", lengthMm: 2030, market: "au", name: "King", widthMm: 1830 },
  {
    id: "super-king",
    lengthMm: 2030,
    market: "au",
    name: "Super King",
    widthMm: 2030,
  },
  {
    id: "90x200",
    lengthMm: 2000,
    market: "eu",
    name: "90 × 200",
    widthMm: 900,
  },
  {
    id: "120x200",
    lengthMm: 2000,
    market: "eu",
    name: "120 × 200",
    widthMm: 1200,
  },
  {
    id: "140x200",
    lengthMm: 2000,
    market: "eu",
    name: "140 × 200",
    widthMm: 1400,
  },
  {
    id: "160x200",
    lengthMm: 2000,
    market: "eu",
    name: "160 × 200",
    widthMm: 1600,
  },
  {
    id: "180x200",
    lengthMm: 2000,
    market: "eu",
    name: "180 × 200",
    widthMm: 1800,
  },
  {
    id: "200x200",
    lengthMm: 2000,
    market: "eu",
    name: "200 × 200",
    widthMm: 2000,
  },
  { id: "single", lengthMm: 1950, market: "jp", name: "Single", widthMm: 970 },
  {
    id: "semi-double",
    lengthMm: 1950,
    market: "jp",
    name: "Semi-double",
    widthMm: 1200,
  },
  { id: "double", lengthMm: 1950, market: "jp", name: "Double", widthMm: 1400 },
  { id: "queen", lengthMm: 1950, market: "jp", name: "Queen", widthMm: 1600 },
  { id: "king", lengthMm: 1950, market: "jp", name: "King", widthMm: 1800 },
  { id: "single", lengthMm: 1900, market: "uk", name: "Single", widthMm: 900 },
  {
    id: "small-double",
    lengthMm: 1900,
    market: "uk",
    name: "Small Double",
    widthMm: 1200,
  },
  { id: "double", lengthMm: 1900, market: "uk", name: "Double", widthMm: 1350 },
  { id: "king", lengthMm: 2000, market: "uk", name: "King", widthMm: 1500 },
  {
    id: "super-king",
    lengthMm: 2000,
    market: "uk",
    name: "Super King",
    widthMm: 1800,
  },
  { id: "twin", lengthMm: 1905, market: "us", name: "Twin", widthMm: 965 },
  {
    id: "twin-xl",
    lengthMm: 2032,
    market: "us",
    name: "Twin XL",
    widthMm: 965,
  },
  {
    id: "full",
    lengthMm: 1905,
    market: "us",
    name: "Full / Double",
    widthMm: 1372,
  },
  { id: "queen", lengthMm: 2032, market: "us", name: "Queen", widthMm: 1524 },
  { id: "king", lengthMm: 2032, market: "us", name: "King", widthMm: 1930 },
  {
    id: "california-king",
    lengthMm: 2134,
    market: "us",
    name: "California King",
    widthMm: 1829,
  },
];

const markets = Object.keys(bedSizeMarketLabels) as BedSizeMarket[];
const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

export const getBedSizesForMarket = (
  market: BedSizeMarket,
): readonly BedSizeEntry[] =>
  bedSizes.filter((entry) => entry.market === market);

const difference = (first: BedSizeEntry, second: BedSizeEntry): number =>
  Math.abs(first.widthMm - second.widthMm) +
  Math.abs(first.lengthMm - second.lengthMm);

export const compareBedSizes = (input: unknown): ToolResult<BedSizeOutput> => {
  if (!isRecord(input))
    return invalidInput([
      {
        code: "object_required",
        field: "",
        message: "Input must be an object.",
      },
    ]);
  const issues: ToolIssue[] = [];
  if (!markets.includes(input.market as BedSizeMarket))
    issues.push({
      code: "unsupported_market",
      field: "market",
      message: "The bed-size market is not supported.",
    });
  if (typeof input.size !== "string" || input.size.trim() === "")
    issues.push({
      code: "size_required",
      field: "size",
      message: "Size must be a non-empty bed-size identifier.",
    });
  for (const field of Object.keys(input))
    if (field !== "market" && field !== "size")
      issues.push({
        code: "unknown_field",
        field,
        message: `${field} is not a supported input field.`,
      });
  if (issues.length > 0) return invalidInput(issues);

  const market = input.market as BedSizeMarket;
  const size = (input.size as string).trim().toLowerCase();
  const selected = bedSizes.find(
    (entry) =>
      entry.market === market &&
      (entry.id === size || entry.name.toLowerCase() === size),
  );
  if (!selected)
    return invalidInput([
      {
        code: "unknown_size",
        field: "size",
        message: "The selected size is not available in that market.",
      },
    ]);

  const matches = markets.map((targetMarket): BedSizeMatch => {
    const candidates = getBedSizesForMarket(targetMarket);
    const closest = candidates.reduce((best, candidate) =>
      difference(selected, candidate) < difference(selected, best)
        ? candidate
        : best,
    );
    const differenceMm = difference(selected, closest);
    return {
      ...closest,
      confidence: differenceMm <= 20 ? "exact" : "closest",
      differenceMm,
    };
  });

  return toolSuccess({
    input: selected,
    matches,
    warning:
      "Named bed sizes are regional conventions. Check the manufacturer’s finished mattress and frame dimensions before buying.",
  });
};

export const isBedSizeOutput = (value: unknown): value is BedSizeOutput =>
  isRecord(value) &&
  isRecord(value.input) &&
  Array.isArray(value.matches) &&
  typeof value.warning === "string";

export const bedSizeTool = defineTool<BedSizeInput, BedSizeOutput>({
  contractVersion: 1,
  description:
    "Compare common bed and mattress names through nominal width and length across major regional markets.",
  execute: compareBedSizes,
  executionKind: "pure",
  id: "size/bed",
  inputSchema: {
    additionalProperties: false,
    properties: {
      market: { enum: markets, type: "string" },
      size: { minLength: 1, type: "string" },
    },
    required: ["market", "size"],
    type: "object",
  },
  isOutput: isBedSizeOutput,
  outputSchema: {
    additionalProperties: false,
    properties: {
      input: { type: "object" },
      matches: { type: "array" },
      warning: { type: "string" },
    },
    required: ["input", "matches", "warning"],
    type: "object",
  },
  title: "Bed Size Comparison",
});
