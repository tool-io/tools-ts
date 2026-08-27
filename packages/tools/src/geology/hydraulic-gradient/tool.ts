import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type HydraulicGradientInput = {
  readonly headDifferenceM: number;
  readonly flowPathLengthM: number;
};

export type HydraulicGradientOutput = {
  readonly hydraulicGradient: number;
};

export const calculateHydraulicGradient = (
  input: HydraulicGradientInput,
): HydraulicGradientOutput => {
  if (!(input.flowPathLengthM > 0))
    simpleError(
      "flowPathLengthM",
      "Flow path length must be greater than zero.",
      "invalid_length",
    );
  return { hydraulicGradient: input.headDifferenceM / input.flowPathLengthM };
};

export const hydraulicGradientExample = {
  input: { headDifferenceM: 12, flowPathLengthM: 500 },
  output: { hydraulicGradient: 0.024 },
} satisfies ToolExample<HydraulicGradientInput, HydraulicGradientOutput>;

export const hydraulicGradientTool = createSimpleTool({
  id: "geology/hydraulic-gradient",
  title: "Hydraulic Gradient Calculator",
  description:
    "Compute the hydraulic gradient as head loss in meters divided by the flow path length in meters.",
  inputs: [
    {
      description: "Difference in hydraulic head between endpoints in meters.",
      id: "headDifferenceM",
      kind: "number",
      label: "Head difference",
    },
    {
      description: "Length of the flow path in meters.",
      id: "flowPathLengthM",
      kind: "number",
      label: "Flow length",
      minimum: 0,
    },
  ],
  outputs: [
    {
      description: "Hydraulic gradient (dimensionless).",
      id: "hydraulicGradient",
      kind: "number",
      label: "i",
    },
  ],
  calculate: (input) =>
    calculateHydraulicGradient(input as unknown as HydraulicGradientInput),
});

export const runHydraulicGradient = hydraulicGradientTool.execute;
export default hydraulicGradientTool;
