import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../core/batch59-shared.js";
export type Input = Readonly<{
  beforeReset: number;
  afterReset: number;
  resetBaseline: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "beforeReset", label: "Before reset", kind: "integer" },
  { id: "afterReset", label: "After reset", kind: "integer" },
  { id: "resetBaseline", label: "Reset baseline", kind: "integer" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  [i.beforeReset, i.afterReset, i.resetBaseline].forEach((x) =>
    H.int(x, 0, 1000000000),
  );
  H.check(i.afterReset >= i.resetBaseline);
  return H.finish({
    postResetIncrement: i.afterReset - i.resetBaseline,
    combinedRecordedCount: i.beforeReset + i.afterReset - i.resetBaseline,
  });
};
export const example = {
  input: { beforeReset: 100, afterReset: 30, resetBaseline: 10 },
  output: { result: { postResetIncrement: 20, combinedRecordedCount: 120 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "health/step-counter-single-reset-offset",
  title: "Health: Step Counter Single Reset Offset Tool",
  description:
    "Reconcile one explicitly declared step-counter reset with a supplied baseline; does not infer steps missed during the reset or recommend activity.",
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
          combinedRecordedCount: { type: "number" },
          postResetIncrement: { type: "number" },
        },
        required: ["combinedRecordedCount", "postResetIncrement"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
