import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type TransformerImpedanceRatioInput = {
  readonly turnsRatio: number;
};

export type TransformerImpedanceRatioOutput = {
  readonly impedanceRatio: number;
};

export const transformerImpedanceRatioExample = {
  input: { turnsRatio: 10 },
  output: { impedanceRatio: 100 },
} satisfies ToolExample<
  TransformerImpedanceRatioInput,
  TransformerImpedanceRatioOutput
>;

export const transformerImpedanceRatioTool = createSimpleTool({
  calculate: (input) => {
    const { turnsRatio } = input as unknown as TransformerImpedanceRatioInput;
    if (turnsRatio <= 0)
      simpleError(
        "turnsRatio",
        "Turns ratio must be positive.",
        "degenerate_input",
      );
    return { impedanceRatio: Math.pow(turnsRatio, 2) };
  },
  description:
    "Compute the transformer impedance ratio as the square of the turns ratio.",
  id: "electronics/transformer-impedance-ratio",
  inputs: [{ id: "turnsRatio", kind: "number", label: "Turns ratio" }],
  outputs: [{ id: "impedanceRatio", kind: "number", label: "Impedance ratio" }],
  title: "Impedance Ratio",
});
export const runTransformerImpedanceRatio =
  transformerImpedanceRatioTool.execute;
export default transformerImpedanceRatioTool;
