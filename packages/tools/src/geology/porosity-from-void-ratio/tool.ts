import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type PorosityFromVoidRatioInput = {
  readonly voidRatio: number;
};

export type PorosityFromVoidRatioOutput = {
  readonly porosityFraction: number;
};

export const calculatePorosityFromVoidRatio = (
  input: PorosityFromVoidRatioInput,
): PorosityFromVoidRatioOutput => {
  if (!(input.voidRatio >= 0))
    simpleError(
      "voidRatio",
      "Void ratio cannot be negative.",
      "invalid_void_ratio",
    );
  return { porosityFraction: input.voidRatio / (1 + input.voidRatio) };
};

export const porosityFromVoidRatioExample = {
  input: { voidRatio: 0.6 },
  output: { porosityFraction: 0.37499999999999994 },
} satisfies ToolExample<
  PorosityFromVoidRatioInput,
  PorosityFromVoidRatioOutput
>;

export const porosityFromVoidRatioTool = createSimpleTool({
  id: "geology/porosity-from-void-ratio",
  title: "Porosity From Void Ratio Calculator",
  description: "Convert void ratio e to porosity using n = e / (1 + e).",
  inputs: [
    {
      description: "Void ratio (dimensionless).",
      id: "voidRatio",
      kind: "number",
      label: "Void ratio",
      minimum: 0,
    },
  ],
  outputs: [
    {
      description: "Porosity as a fraction between 0 and 1.",
      id: "porosityFraction",
      kind: "number",
      label: "Porosity",
    },
  ],
  calculate: (input) =>
    calculatePorosityFromVoidRatio(
      input as unknown as PorosityFromVoidRatioInput,
    ),
});

export const runPorosityFromVoidRatio = porosityFromVoidRatioTool.execute;
export default porosityFromVoidRatioTool;
