import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const repeatingPairSlipCompatibilityCheckerExample = {
  input: {
    momentANm: 100000000000000,
    areaAKm2: 0.01,
    momentBNm: 105000000000000,
    areaBKm2: 0.0105,
  },
  output: { slipRatio: 1, compatible: true },
} satisfies ToolExample<Record<string, unknown>, Record<string, unknown>>;

export const repeatingPairSlipCompatibilityCheckerTool = createSimpleTool({
  calculate: (input: Readonly<Record<string, unknown>>) =>
    (({ momentANm, areaAKm2, momentBNm, areaBKm2 }) => {
      if (areaAKm2 <= 0 || areaBKm2 <= 0)
        simpleError("areaAKm2", "Areas must be positive.");
      if (momentANm <= 0 || momentBNm <= 0)
        simpleError("momentANm", "Moments must be positive.");
      const slipRatio = momentBNm / areaBKm2 / (momentANm / areaAKm2);
      return { slipRatio, compatible: Math.abs(slipRatio - 1) <= 0.2 };
    })(input as never) as Record<string, unknown>,
  description:
    "Check whether two repeating events' implied slips are compatible given their areas and moments.",
  id: "seismology/repeating-pair-slip-compatibility-checker",
  inputs: [
    {
      minimum: 0,
      description: "Moment of event A.",
      id: "momentANm",
      kind: "number",
      label: "M₀,A",
      unit: "N·m",
    },
    {
      minimum: 0,
      description: "Patch area of A.",
      id: "areaAKm2",
      kind: "number",
      label: "A_A",
      unit: "km²",
    },
    {
      minimum: 0,
      description: "Moment of event B.",
      id: "momentBNm",
      kind: "number",
      label: "M₀,B",
      unit: "N·m",
    },
    {
      minimum: 0,
      description: "Patch area of B.",
      id: "areaBKm2",
      kind: "number",
      label: "A_B",
      unit: "km²",
    },
  ],
  outputs: [
    {
      description: "Implied slip ratio.",
      id: "slipRatio",
      kind: "number",
      label: "D_B/D_A",
    },
    {
      description: "Whether the ratio is within ±20 percent of unity.",
      id: "compatible",
      kind: "boolean",
      label: "Compatible?",
    },
  ],
  title: "Repeating Pair Slip Compatibility Checker",
});
export const runRepeatingPairSlipCompatibilityChecker =
  repeatingPairSlipCompatibilityCheckerTool.execute;
export { repeatingPairSlipCompatibilityCheckerExample as example };
export default repeatingPairSlipCompatibilityCheckerTool;
