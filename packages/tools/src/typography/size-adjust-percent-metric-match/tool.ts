import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, positive } from "../batch52-shared.js";
export type Input = Readonly<{
  readonly targetMetricRatio: number;
  readonly fallbackMetricRatio: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "targetMetricRatio", label: "Target metric ratio", kind: "number" },
  { id: "fallbackMetricRatio", label: "Fallback metric ratio", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (i: Input): Readonly<Record<string, unknown>> => {
  positive(i.targetMetricRatio, "target");
  positive(i.fallbackMetricRatio, "fallback");
  return {
    sizeAdjustPercent: (100 * i.targetMetricRatio) / i.fallbackMetricRatio,
  };
};
export const calculate = (i: Input): Output => {
  validateInput(i, fields);
  return finish({ result: compute(i) });
};
export const example = {
  input: { targetMetricRatio: 0.5, fallbackMetricRatio: 0.4 },
  output: { result: { sizeAdjustPercent: 125 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "typography/size-adjust-percent-metric-match",
  title: "size-adjust Percent Metric Match",
  description:
    "CSS size-adjust percent to match independently measured normalized font metrics; not guaranteed identical layout.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculation or explicitly qualified result",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
