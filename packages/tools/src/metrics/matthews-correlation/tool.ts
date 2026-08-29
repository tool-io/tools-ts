import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const example = {
  input: {
    truePositive: 1,
    trueNegative: 1,
    falsePositive: 0,
    falseNegative: 0,
  },
  output: { coefficient: 1 },
} satisfies ToolExample<Record<string, unknown>, Record<string, unknown>>;
export const tool = createSimpleTool({
  id: "metrics/matthews-correlation",
  title: "Matthews Correlation Coefficient Calculator",
  description:
    "Compute binary-classification MCC from TP, TN, FP, FN. An undefined zero-denominator case is rejected rather than silently scored as zero.",
  inputs: [
    { id: "truePositive", kind: "integer", label: "true Positive", minimum: 0 },
    { id: "trueNegative", kind: "integer", label: "true Negative", minimum: 0 },
    {
      id: "falsePositive",
      kind: "integer",
      label: "false Positive",
      minimum: 0,
    },
    {
      id: "falseNegative",
      kind: "integer",
      label: "false Negative",
      minimum: 0,
    },
  ],
  outputs: [{ id: "coefficient", kind: "number", label: "coefficient" }],
  calculate: (input) => {
    const tp = input.truePositive as number,
      tn = input.trueNegative as number,
      fp = input.falsePositive as number,
      fn = input.falseNegative as number;
    const denominator = Math.sqrt(
      (tp + fp) * (tp + fn) * (tn + fp) * (tn + fn),
    );
    if (!(denominator > 0) || !Number.isFinite(denominator))
      simpleError(
        "truePositive",
        "MCC is undefined for these confusion counts.",
      );
    return { coefficient: (tp * tn - fp * fn) / denominator };
  },
});
export type MatthewsCorrelationInput = Readonly<typeof example.input>;
export type MatthewsCorrelationOutput = Readonly<typeof example.output>;
export const matthewsCorrelationTool = tool;
export const runMatthewsCorrelation = tool.execute;
export default tool;
