import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type TidalRangeSpringsNeapsInput = {
  neapRangeMeters: number;
  springRangeMeters: number;
};

export type TidalRangeSpringsNeapsOutput = {
  rangeRatio: number;
};

export const tidalRangeSpringsNeapsExample = {
  input: { neapRangeMeters: 2, springRangeMeters: 4 },
  output: { rangeRatio: 2 },
} satisfies ToolExample<
  TidalRangeSpringsNeapsInput,
  TidalRangeSpringsNeapsOutput
>;

export const calculateTidalRangeSpringsNeaps = (
  input: TidalRangeSpringsNeapsInput,
): TidalRangeSpringsNeapsOutput => {
  if (input.springRangeMeters <= 0)
    simpleError(
      "springRangeMeters",
      "Spring range must be positive.",
      "invalid_input",
    );
  if (input.neapRangeMeters <= 0)
    simpleError(
      "neapRangeMeters",
      "Neap range must be positive.",
      "invalid_input",
    );
  return { rangeRatio: input.springRangeMeters / input.neapRangeMeters };
};

export const tidalRangeSpringsNeapsTool = createSimpleTool({
  calculate: (input) =>
    calculateTidalRangeSpringsNeaps(
      input as unknown as TidalRangeSpringsNeapsInput,
    ),
  description:
    "Compute the tidal range ratio from rangeRatio = springRangeMeters / neapRangeMeters.",
  id: "sailing/tidal-range-springs-neaps",
  inputs: [
    {
      description: "Mean tidal range at spring tides.",
      id: "springRangeMeters",
      kind: "number",
      label: "Spring range",
      minimum: 0,
      unit: "m",
    },
    {
      description: "Mean tidal range at neap tides.",
      id: "neapRangeMeters",
      kind: "number",
      label: "Neap range",
      minimum: 0,
      unit: "m",
    },
  ],
  outputs: [
    {
      description:
        "Ratio of spring to neap ranges; larger values indicate stronger tidal asymmetry.",
      id: "rangeRatio",
      kind: "number",
      label: "Range ratio",
    },
  ],
  title: "Range Ratio Calculator",
});
export const runTidalRangeSpringsNeaps = tidalRangeSpringsNeapsTool.execute;
export default tidalRangeSpringsNeapsTool;
