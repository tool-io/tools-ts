import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type OverburdenStressInput = {
  readonly depthM: number;
  readonly unitWeightKnPerM3: number;
};

export type OverburdenStressOutput = {
  readonly verticalStressKpa: number;
};

export const calculateOverburdenStress = (
  input: OverburdenStressInput,
): OverburdenStressOutput => {
  if (!(input.unitWeightKnPerM3 > 0))
    simpleError(
      "unitWeightKnPerM3",
      "Unit weight must be greater than zero.",
      "invalid_unit_weight",
    );
  if (!(input.depthM >= 0))
    simpleError("depthM", "Depth cannot be negative.", "invalid_depth");
  return { verticalStressKpa: input.unitWeightKnPerM3 * input.depthM };
};

export const overburdenStressExample = {
  input: { depthM: 30, unitWeightKnPerM3: 22 },
  output: { verticalStressKpa: 660 },
} satisfies ToolExample<OverburdenStressInput, OverburdenStressOutput>;

export const overburdenStressTool = createSimpleTool({
  id: "geology/overburden-stress",
  title: "Overburden Stress Calculator",
  description:
    "Compute the geostatic (overburden) vertical stress as the product of unit weight in kN/m3 and depth in meters, giving kPa.",
  inputs: [
    {
      description: "Depth below surface in meters.",
      id: "depthM",
      kind: "number",
      label: "Depth",
      minimum: 0,
    },
    {
      description: "Average bulk unit weight of overlying material in kN/m3.",
      id: "unitWeightKnPerM3",
      kind: "number",
      label: "Unit weight",
      minimum: 0,
    },
  ],
  outputs: [
    {
      description: "Vertical overburden stress in kilopascals.",
      id: "verticalStressKpa",
      kind: "number",
      label: "Vertical stress",
    },
  ],
  calculate: (input) =>
    calculateOverburdenStress(input as unknown as OverburdenStressInput),
});

export const runOverburdenStress = overburdenStressTool.execute;
export default overburdenStressTool;
