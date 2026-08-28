import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type TransformerEfficiencyInput = {
  readonly pIn: number;
  readonly pOut: number;
};

export type TransformerEfficiencyOutput = {
  readonly efficiencyPercent: number;
};

export const transformerEfficiencyExample = {
  input: { pIn: 100, pOut: 85 },
  output: { efficiencyPercent: 85 },
} satisfies ToolExample<
  TransformerEfficiencyInput,
  TransformerEfficiencyOutput
>;

export const transformerEfficiencyTool = createSimpleTool({
  id: "electronics/transformer-efficiency",
  title: "Transformer Efficiency",
  description:
    "Compute transformer efficiency percent as output power divided by input power times 100.",
  inputs: [
    { id: "pIn", label: "Input power", kind: "number", unit: "W" },
    { id: "pOut", label: "Output power", kind: "number", unit: "W" },
  ],
  outputs: [
    {
      id: "efficiencyPercent",
      label: "Efficiency",
      kind: "number",
      unit: "%",
    },
  ],
  calculate: (input) => {
    const pIn = input.pIn as number;
    const pOut = input.pOut as number;
    if (!(pIn > 0))
      simpleError("pIn", "Input power must be positive.", "invalid_power");
    if (pOut > pIn)
      simpleError(
        "pOut",
        "Output power must not exceed input power.",
        "invalid_power",
      );
    return { efficiencyPercent: (pOut / pIn) * 100 };
  },
});
export const runTransformerEfficiency = transformerEfficiencyTool.execute;
export default transformerEfficiencyTool;
