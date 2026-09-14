import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  bounded,
  simpleError,
} from "../batch52-shared.js";
export type Input = Readonly<{
  readonly piercedCount: number;
  readonly inspectedCount: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "piercedCount", label: "Pierced count", kind: "number" },
  { id: "inspectedCount", label: "Inspected count", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (i: Input): Readonly<Record<string, unknown>> => {
  bounded(i.piercedCount, "pierced", 0, 1000000000);
  bounded(i.inspectedCount, "inspected", 1, 1000000000);
  if (i.piercedCount > i.inspectedCount)
    simpleError("count", "Pierced exceeds inspected.");
  return { piercedPercent: (100 * i.piercedCount) / i.inspectedCount };
};
export const calculate = (i: Input): Output => {
  validateInput(i, fields);
  return finish({ result: compute(i) });
};
export const example = {
  input: { piercedCount: 5, inspectedCount: 100 },
  output: { result: { piercedPercent: 5 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "sericulture/pierced-cocoon-percent-loss",
  title: "Pierced Cocoon Percent Loss Calculator",
  description:
    "Observed pierced-cocoon fraction; not financial loss or automatic grading.",
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
