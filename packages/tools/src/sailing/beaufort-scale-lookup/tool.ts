import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";

export type BeaufortScaleLookupInput = {
  readonly windSpeedKt: number;
};

export type BeaufortScaleLookupOutput = {
  readonly beaufortForce: number;
};

const BEAUFORT_UPPER_BOUNDS_KT = [1, 3, 6, 10, 16, 21, 27, 33, 40, 47, 55, 63];

export const beaufortScaleLookupExample = {
  input: { windSpeedKt: 15 },
  output: { beaufortForce: 4 },
} satisfies ToolExample<BeaufortScaleLookupInput, BeaufortScaleLookupOutput>;

export const calculateBeaufortScaleLookup = (
  input: BeaufortScaleLookupInput,
): BeaufortScaleLookupOutput => {
  const force = BEAUFORT_UPPER_BOUNDS_KT.findIndex(
    (upperBoundKt) => input.windSpeedKt <= upperBoundKt,
  );
  return { beaufortForce: force === -1 ? 12 : force };
};

export const beaufortScaleLookupTool = createSimpleTool({
  calculate: (input) =>
    calculateBeaufortScaleLookup(input as unknown as BeaufortScaleLookupInput),
  description:
    "Look up the Beaufort wind force from zero to twelve for a wind speed in knots using standard inclusive upper bounds.",
  id: "sailing/beaufort-scale-lookup",
  inputs: [
    {
      description: "Wind speed to classify on the Beaufort scale.",
      id: "windSpeedKt",
      kind: "number",
      label: "Wind speed",
      minimum: 0,
      unit: "kt",
    },
  ],
  outputs: [
    {
      description:
        "Beaufort force from zero (calm) through twelve (hurricane).",
      id: "beaufortForce",
      kind: "integer",
      label: "Beaufort force",
    },
  ],
  title: "Beaufort Scale Lookup",
});
export const runBeaufortScaleLookup = beaufortScaleLookupTool.execute;
export default beaufortScaleLookupTool;
