import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../core/batch59-shared.js";
export type Input = Readonly<{
  actual: number;
  lower: number;
  upper: number;
  alpha: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "actual", label: "Actual", kind: "number" },
  { id: "lower", label: "Lower", kind: "number" },
  { id: "upper", label: "Upper", kind: "number" },
  { id: "alpha", label: "Alpha", kind: "number" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.check(i.lower <= i.upper && i.alpha > 0 && i.alpha < 1);
  const lp = (2 / i.alpha) * Math.max(0, i.lower - i.actual),
    up = (2 / i.alpha) * Math.max(0, i.actual - i.upper);
  return H.finish({
    width: i.upper - i.lower,
    lowerPenalty: lp,
    upperPenalty: up,
    score: i.upper - i.lower + lp + up,
  });
};
export const example = {
  input: { actual: 0, lower: 1, upper: 3, alpha: 0.2 },
  output: {
    result: { width: 2, lowerPenalty: 10, upperPenalty: 0, score: 12 },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "metrics/interval-score-observation",
  title: "Metrics: Interval Score Observation Tool",
  description:
    "Score one central (1-alpha) predictive interval using the interval width and two outside penalties; no calibration inference.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculated result",
      kind: "object",
      schema: {
        type: "object",
        additionalProperties: false,
        properties: {
          lowerPenalty: { type: "number" },
          score: { type: "number" },
          upperPenalty: { type: "number" },
          width: { type: "number" },
        },
        required: ["lowerPenalty", "score", "upperPenalty", "width"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
