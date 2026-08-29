import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const example = {
  input: { probabilities: [0, 1], outcomes: [0, 1] },
  output: { score: 0 },
} satisfies ToolExample<Record<string, unknown>, Record<string, unknown>>;
export const tool = createSimpleTool({
  id: "metrics/brier-score",
  title: "Brier Score Calculator",
  description:
    "Compute mean squared probability error for binary outcomes. Probabilities must lie in [0,1], outcomes must be 0 or 1; lower scores are better.",
  inputs: [
    { id: "probabilities", kind: "numberList", label: "probabilities" },
    { id: "outcomes", kind: "numberList", label: "outcomes" },
  ],
  outputs: [{ id: "score", kind: "number", label: "score" }],
  calculate: (input) => {
    const p = input.probabilities as number[];
    const y = input.outcomes as number[];
    if (!p.length || p.length !== y.length)
      simpleError("outcomes", "Lists must be nonempty and equal length.");
    if (p.some((v) => v < 0 || v > 1) || y.some((v) => v !== 0 && v !== 1))
      simpleError(
        "probabilities",
        "Use probabilities in [0,1] and binary outcomes.",
      );
    return {
      score:
        p.reduce((sum, value, i) => sum + (value - y[i]!) ** 2, 0) / p.length,
    };
  },
});
export type BrierScoreInput = Readonly<typeof example.input>;
export type BrierScoreOutput = Readonly<typeof example.output>;
export const brierScoreTool = tool;
export const runBrierScore = tool.execute;
export default tool;
