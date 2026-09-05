import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, bounded } from "../batch43-shared.js";

export type Input = Readonly<{ readonly descendingPilePoints: number }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "descendingPilePoints",
    label: "Descending pile points",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  bounded(input.descendingPilePoints, "annotatedcount", 0, 64);
  return { observedCount: input.descendingPilePoints };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: { descendingPilePoints: 3 },
  output: { result: { observedCount: 3 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "heraldry/pile-descending-points-counter",
  title: "Pile Number of Descending Points Counter",
  description:
    "Record independently observed descendingPilePointscount; no species, pose, authenticity or normative drawing inference.",
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
