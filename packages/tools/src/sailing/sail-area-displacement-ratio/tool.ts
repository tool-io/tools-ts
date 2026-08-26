import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type SailAreaDisplacementRatioInput = {
  readonly displacementLb: number;
  readonly sailAreaFt2: number;
};

export type SailAreaDisplacementRatioOutput = {
  readonly saDispRatio: number;
};

/** Seawater weighs 64 lb per cubic foot. */
const LB_PER_CUBIC_FT_SEAWATER = 64;

export const sailAreaDisplacementRatioExample = {
  input: { displacementLb: 8000, sailAreaFt2: 500 },
  output: { saDispRatio: 20 },
} satisfies ToolExample<
  SailAreaDisplacementRatioInput,
  SailAreaDisplacementRatioOutput
>;

export const calculateSailAreaDisplacementRatio = (
  input: SailAreaDisplacementRatioInput,
): SailAreaDisplacementRatioOutput => {
  if (input.displacementLb <= 0 || input.sailAreaFt2 <= 0)
    simpleError(
      "displacementLb",
      "Displacement and sail area must be positive.",
      "invalid_input",
    );
  const cubicFt = input.displacementLb / LB_PER_CUBIC_FT_SEAWATER;
  return {
    saDispRatio: input.sailAreaFt2 / Math.cbrt(cubicFt ** 2),
  };
};

export const sailAreaDisplacementRatioTool = createSimpleTool({
  calculate: (input) =>
    calculateSailAreaDisplacementRatio(
      input as unknown as SailAreaDisplacementRatioInput,
    ),
  description:
    "Compute the sail area to displacement ratio; above fifteen indicates good light-air performance.",
  id: "sailing/sail-area-displacement-ratio",
  inputs: [
    {
      description: "Total upwind sail area.",
      format: "area-ft2",
      id: "sailAreaFt2",
      kind: "number",
      label: "Sail area",
      unit: "ft²",
    },
    {
      description: "Displacement in pounds (seawater).",
      format: "weight-lb",
      id: "displacementLb",
      kind: "number",
      label: "Displacement",
      unit: "lb",
    },
  ],
  outputs: [
    {
      description: "SA/D ratio; fourteen to seventeen is typical for cruisers.",
      format: "ratio",
      id: "saDispRatio",
      kind: "number",
      label: "SA/D",
    },
  ],
  title: "Sail Area Displacement Ratio Calculator",
});
export const runSailAreaDisplacementRatio =
  sailAreaDisplacementRatioTool.execute;
export default sailAreaDisplacementRatioTool;
