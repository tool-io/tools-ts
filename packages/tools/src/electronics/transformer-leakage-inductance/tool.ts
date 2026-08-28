import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type TransformerLeakageInductanceInput = {
  readonly couplingCoefficientK?: number;
  readonly magnetizingUh: number;
};

export type TransformerLeakageInductanceOutput = {
  readonly leakageInductanceUh: number;
};

export const transformerLeakageInductanceExample = {
  input: { magnetizingUh: 250000 },
  output: { leakageInductanceUh: 4975.000000000007 },
} satisfies ToolExample<
  TransformerLeakageInductanceInput,
  TransformerLeakageInductanceOutput
>;

export const calculateTransformerLeakageInductance = (
  input: TransformerLeakageInductanceInput,
): TransformerLeakageInductanceOutput => {
  if (!(input.magnetizingUh > 0))
    simpleError(
      "magnetizingUh",
      "Magnetizing inductance must be positive.",
      "invalid_inductance",
    );
  const couplingCoefficientK = input.couplingCoefficientK ?? 0.99;
  if (!(couplingCoefficientK > 0) || !(couplingCoefficientK < 1))
    simpleError(
      "couplingCoefficientK",
      "Coupling coefficient must be strictly between zero and one.",
      "invalid_coupling",
    );
  return {
    leakageInductanceUh:
      (1 - couplingCoefficientK * couplingCoefficientK) * input.magnetizingUh,
  };
};

export const transformerLeakageInductanceTool = createSimpleTool({
  calculate: (input) =>
    calculateTransformerLeakageInductance(
      input as unknown as TransformerLeakageInductanceInput,
    ),
  description:
    "Estimate leakage inductance from the magnetizing inductance and the winding coupling coefficient.",
  id: "electronics/transformer-leakage-inductance",
  inputs: [
    {
      description: "Magnetizing (primary) inductance of the transformer.",
      format: "inductance",
      id: "magnetizingUh",
      kind: "number",
      label: "Magnetizing inductance",
      unit: "µH",
    },
    {
      default: 0.99,
      description:
        "Coupling coefficient strictly between zero and one; unity coupling implies zero leakage.",
      id: "couplingCoefficientK",
      kind: "number",
      label: "Coupling coefficient",
    },
  ],
  outputs: [
    {
      description: "Estimated leakage inductance seen at the primary.",
      format: "inductance",
      id: "leakageInductanceUh",
      kind: "number",
      label: "Leakage inductance",
      unit: "µH",
    },
  ],
  title: "Leakage Inductance Estimate",
});
export const runTransformerLeakageInductance =
  transformerLeakageInductanceTool.execute;
export default transformerLeakageInductanceTool;
