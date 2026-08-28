import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type TransformerTurnsRatioInput = {
  readonly primaryTurns: number;
  readonly secondaryTurns: number;
};

export type TransformerTurnsRatioOutput = {
  readonly turnsRatio: number;
};

export const transformerTurnsRatioExample = {
  input: { primaryTurns: 500, secondaryTurns: 100 },
  output: { turnsRatio: 5 },
} satisfies ToolExample<
  TransformerTurnsRatioInput,
  TransformerTurnsRatioOutput
>;

export const transformerTurnsRatioTool = createSimpleTool({
  calculate: (input) => {
    const { primaryTurns, secondaryTurns } =
      input as unknown as TransformerTurnsRatioInput;
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
    return { turnsRatio: primaryTurns / secondaryTurns };
  },
  description:
    "Compute the turns ratio of a transformer from its primary and secondary winding turns.",
  id: "electronics/transformer-turns-ratio",
  inputs: [
    { id: "primaryTurns", kind: "integer", label: "Primary turns" },
    { id: "secondaryTurns", kind: "integer", label: "Secondary turns" },
  ],
  outputs: [{ id: "turnsRatio", kind: "number", label: "Turns ratio" }],
  title: "Turns Ratio",
});
export const runTransformerTurnsRatio = transformerTurnsRatioTool.execute;
export default transformerTurnsRatioTool;
