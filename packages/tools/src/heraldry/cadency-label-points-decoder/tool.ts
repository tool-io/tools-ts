import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, bounded } from "../batch43-shared.js";

export type Input = Readonly<{ readonly observedLabelPointCount: number }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "observedLabelPointCount",
    label: "Observed label point count",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  bounded(input.observedLabelPointCount, "points", 1, 64);
  return { pointCount: input.observedLabelPointCount };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: { observedLabelPointCount: 3 },
  output: { result: { pointCount: 3 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "heraldry/cadency-label-points-decoder",
  title: "Cadency Label Points Count Decoder",
  description:
    "Record independently observed cadency label points; count does not determine birth rank or legitimacy.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculated observation or reference",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
