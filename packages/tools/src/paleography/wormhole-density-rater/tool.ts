import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type WormholeDensityRaterInput = {
  readonly wormholeCount: number;
  readonly pageAreaSquareCm: number;
};

export type WormholeDensityRaterOutput = {
  readonly wormholesPerSquareDecimetre: number;
  readonly infestationRating: "none" | "light" | "moderate" | "heavy";
};

export const calculateWormholeDensityRater = (
  input: WormholeDensityRaterInput,
): WormholeDensityRaterOutput => {
  if (!(Number.isSafeInteger(input.wormholeCount) && input.wormholeCount >= 0))
    return simpleError(
      "wormholeCount",
      "Wormhole count must be a non-negative integer.",
      "invalid_count",
    );
  if (!(Number.isFinite(input.pageAreaSquareCm) && input.pageAreaSquareCm > 0))
    return simpleError(
      "pageAreaSquareCm",
      "Page area must be greater than zero.",
      "invalid_area",
    );
  const wormholesPerSquareDecimetre =
    (input.wormholeCount / input.pageAreaSquareCm) * 100;
  if (!Number.isFinite(wormholesPerSquareDecimetre))
    return simpleError(
      "pageAreaSquareCm",
      "The density exceeds the numeric range.",
      "numeric_overflow",
    );
  const infestationRating =
    wormholesPerSquareDecimetre === 0
      ? "none"
      : wormholesPerSquareDecimetre < 2
        ? "light"
        : wormholesPerSquareDecimetre < 6
          ? "moderate"
          : "heavy";
  return { wormholesPerSquareDecimetre, infestationRating };
};

export const wormholeDensityRaterExample = {
  input: { pageAreaSquareCm: 150, wormholeCount: 12 },
  output: { wormholesPerSquareDecimetre: 8, infestationRating: "heavy" },
} satisfies ToolExample<WormholeDensityRaterInput, WormholeDensityRaterOutput>;

export const wormholeDensityRaterTool = createSimpleTool({
  id: "paleography/wormhole-density-rater",
  title: "Wormhole Density Rater",
  description:
    "Convert counted wormholes on a measured leaf into holes per square decimetre with exact arithmetic and rate them on the stated bands (none at zero, light under two, moderate under six, heavy from six).",
  inputs: [
    {
      description: "Wormholes counted on the leaf.",
      id: "wormholeCount",
      kind: "integer",
      label: "Wormholes",
      minimum: 0,
    },
    {
      description: "Leaf area in square centimetres.",
      id: "pageAreaSquareCm",
      kind: "number",
      label: "Area",
      minimum: 0,
    },
  ],
  outputs: [
    {
      description: "Wormholes per square decimetre.",
      id: "wormholesPerSquareDecimetre",
      kind: "number",
      label: "Per dm2",
    },
    {
      description: "Stated-band infestation rating.",
      id: "infestationRating",
      enum: ["none", "light", "moderate", "heavy"],
      kind: "string",
      label: "Rating",
    },
  ],
  calculate: (input) =>
    calculateWormholeDensityRater({
      wormholeCount: input.wormholeCount as number,
      pageAreaSquareCm: input.pageAreaSquareCm as number,
    }),
});

export const runWormholeDensityRater = wormholeDensityRaterTool.execute;
export default wormholeDensityRaterTool;
