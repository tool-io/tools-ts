import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type MutualInductanceInput = {
  readonly couplingCoefficientK: number;
  readonly inductanceOneH: number;
  readonly inductanceTwoH: number;
};

export type MutualInductanceOutput = {
  readonly mutualInductanceHenries: number;
};

export const mutualInductanceExample = {
  input: {
    couplingCoefficientK: 0.9,
    inductanceOneH: 0.01,
    inductanceTwoH: 0.02,
  },
  output: { mutualInductanceHenries: 0.012727922061357855 },
} satisfies ToolExample<MutualInductanceInput, MutualInductanceOutput>;

export const calculateMutualInductance = (
  input: MutualInductanceInput,
): MutualInductanceOutput => {
  if (!(input.inductanceOneH > 0) || !(input.inductanceTwoH > 0))
    simpleError(
      "inductanceOneH",
      "Inductances must be positive.",
      "invalid_inductance",
    );
  return {
    mutualInductanceHenries:
      input.couplingCoefficientK *
      Math.sqrt(input.inductanceOneH * input.inductanceTwoH),
  };
};

export const mutualInductanceTool = createSimpleTool({
  calculate: (input) =>
    calculateMutualInductance(input as unknown as MutualInductanceInput),
  description: "Calculate the mutual inductance of two coupled inductors.",
  id: "electronics/mutual-inductance",
  inputs: [
    {
      id: "couplingCoefficientK",
      kind: "number",
      label: "Coupling coefficient",
      maximum: 1,
      minimum: 0,
    },
    { id: "inductanceOneH", kind: "number", label: "Inductance L1", unit: "H" },
    { id: "inductanceTwoH", kind: "number", label: "Inductance L2", unit: "H" },
  ],
  outputs: [
    {
      id: "mutualInductanceHenries",
      kind: "number",
      label: "Mutual inductance",
      unit: "H",
    },
  ],
  title: "Mutual Inductance",
});
export const runMutualInductance = mutualInductanceTool.execute;
export default mutualInductanceTool;
