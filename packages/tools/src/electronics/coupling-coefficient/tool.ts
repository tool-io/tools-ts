import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type CouplingCoefficientInput = {
  readonly inductanceOneH: number;
  readonly inductanceTwoH: number;
  readonly mutualInductanceH: number;
};

export type CouplingCoefficientOutput = {
  readonly couplingCoefficientK: number;
};

export const couplingCoefficientExample = {
  input: {
    inductanceOneH: 0.01,
    inductanceTwoH: 0.04,
    mutualInductanceH: 0.018,
  },
  output: { couplingCoefficientK: 0.8999999999999999 },
} satisfies ToolExample<CouplingCoefficientInput, CouplingCoefficientOutput>;

export const calculateCouplingCoefficient = (
  input: CouplingCoefficientInput,
): CouplingCoefficientOutput => {
  if (!(input.inductanceOneH > 0) || !(input.inductanceTwoH > 0))
    simpleError(
      "inductanceOneH",
      "Inductances must be positive.",
      "invalid_inductance",
    );
  const couplingCoefficientK =
    input.mutualInductanceH /
    Math.sqrt(input.inductanceOneH * input.inductanceTwoH);
  if (couplingCoefficientK > 1)
    simpleError(
      "mutualInductanceH",
      "Mutual inductance cannot exceed the geometric mean of the inductances.",
      "invalid_coupling",
    );
  return { couplingCoefficientK };
};

export const couplingCoefficientTool = createSimpleTool({
  calculate: (input) =>
    calculateCouplingCoefficient(input as unknown as CouplingCoefficientInput),
  description: "Calculate the coupling coefficient of two coupled inductors.",
  id: "electronics/coupling-coefficient",
  inputs: [
    {
      id: "mutualInductanceH",
      kind: "number",
      label: "Mutual inductance",
      unit: "H",
    },
    { id: "inductanceOneH", kind: "number", label: "Inductance L1", unit: "H" },
    { id: "inductanceTwoH", kind: "number", label: "Inductance L2", unit: "H" },
  ],
  outputs: [
    {
      id: "couplingCoefficientK",
      kind: "number",
      label: "Coupling coefficient",
    },
  ],
  title: "Coupling Coefficient",
});
export const runCouplingCoefficient = couplingCoefficientTool.execute;
export default couplingCoefficientTool;
