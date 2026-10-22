import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../css/batch55-shared.js";
export type Input = Readonly<{
  successes: readonly number[];
  totals: readonly number[];
}>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  { id: "successes", label: "successes", kind: "numberList" },
  { id: "totals", label: "totals", kind: "numberList" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input) => {
  H.validate(i, fields);
  H.check(i.successes.length === i.totals.length);
  i.totals.forEach((x) => H.int(x));
  i.successes.forEach((x, j) => H.int(x, 0, i.totals[j]));
  return H.finish({
    failures: i.successes.map((x, j) => i.totals[j] - x),
    rates: i.successes.map((x, j) => (i.totals[j] ? x / i.totals[j] : null)),
  });
};
export const example = {
  input: { successes: [2, 0], totals: [3, 0] },
  output: { result: { failures: [1, 0], rates: [0.6666666666666666, null] } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  discovery: {
    aliases: ["Success Count Complement Table"],
    collections: ["data", "learn"],
    fields: ["statistics"],
    keywords: [],
  },
  id: "statistics/success-count-complement-table",
  title: "Success Count Complement Table",
  description:
    "Compute bounded observed success-count complements and rates, with null for zero-trial evidence; no inference of failure mechanisms or confidence intervals.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Explicit bounded result",
      kind: "object",
      schema: {
        type: "object",
        additionalProperties: false,
        properties: {
          failures: { type: "array", items: { type: "number" } },
          rates: {
            type: "array",
            items: { anyOf: [{ type: "number" }, { type: "null" }] },
          },
        },
        required: ["failures", "rates"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
