import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type VoidRatioFromPorosityInput = {
  readonly porosityFraction: number;
};

export type VoidRatioFromPorosityOutput = {
  readonly voidRatio: number;
};

export const calculateVoidRatioFromPorosity = (
  input: VoidRatioFromPorosityInput,
): VoidRatioFromPorosityOutput => {
  if (!(input.porosityFraction >= 0 && input.porosityFraction < 1))
    simpleError(
      "porosityFraction",
      "Porosity must lie in the range [0, 1).",
      "invalid_porosity",
    );
  return { voidRatio: input.porosityFraction / (1 - input.porosityFraction) };
};

export const voidRatioFromPorosityExample = {
  input: { porosityFraction: 0.4 },
  output: { voidRatio: 0.6666666666666667 },
} satisfies ToolExample<
  VoidRatioFromPorosityInput,
  VoidRatioFromPorosityOutput
>;

export const voidRatioFromPorosityTool = createSimpleTool({
  id: "geology/void-ratio-from-porosity",
  title: "Void Ratio From Porosity Calculator",
  description: "Convert porosity n to the void ratio using e = n / (1 - n).",
  inputs: [
    {
      description: "Porosity as a fraction between 0 and 1.",
      id: "porosityFraction",
      kind: "number",
      label: "Porosity",
      minimum: 0,
    },
  ],
  outputs: [
    {
      description: "Void ratio (dimensionless).",
      id: "voidRatio",
      kind: "number",
      label: "Void ratio",
    },
  ],
  calculate: (input) =>
    calculateVoidRatioFromPorosity(
      input as unknown as VoidRatioFromPorosityInput,
    ),
});

export const runVoidRatioFromPorosity = voidRatioFromPorosityTool.execute;
export default voidRatioFromPorosityTool;
