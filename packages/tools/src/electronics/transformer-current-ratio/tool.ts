import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type TransformerCurrentRatioInput = {
  readonly primaryCurrentA: number;
  readonly primaryTurns: number;
  readonly secondaryTurns: number;
};

export type TransformerCurrentRatioOutput = {
  readonly secondaryCurrentA: number;
};

export const transformerCurrentRatioExample = {
  input: { primaryCurrentA: 2, primaryTurns: 100, secondaryTurns: 500 },
  output: { secondaryCurrentA: 0.4 },
} satisfies ToolExample<
  TransformerCurrentRatioInput,
  TransformerCurrentRatioOutput
>;

export const transformerCurrentRatioTool = createSimpleTool({
  calculate: (input) => {
    const { primaryCurrentA, primaryTurns, secondaryTurns } =
      input as unknown as TransformerCurrentRatioInput;
    if (primaryTurns < 1)
      simpleError(
        "primaryTurns",
        "Primary turns must be at least 1.",
        "degenerate_input",
      );
    if (secondaryTurns < 1)
      simpleError(
        "secondaryTurns",
        "Secondary turns must be at least 1.",
        "degenerate_input",
      );
    return {
      secondaryCurrentA: (primaryCurrentA * primaryTurns) / secondaryTurns,
    };
  },
  description:
    "Compute the transformer secondary current from the primary current and winding turns.",
  id: "electronics/transformer-current-ratio",
  inputs: [
    {
      id: "primaryCurrentA",
      kind: "number",
      label: "Primary current",
      unit: "A",
    },
    { id: "primaryTurns", kind: "integer", label: "Primary turns" },
    { id: "secondaryTurns", kind: "integer", label: "Secondary turns" },
  ],
  outputs: [
    {
      id: "secondaryCurrentA",
      kind: "number",
      label: "Secondary current",
      unit: "A",
    },
  ],
  title: "Current Ratio",
});
export const runTransformerCurrentRatio = transformerCurrentRatioTool.execute;
export default transformerCurrentRatioTool;
