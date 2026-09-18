import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../css/batch55-shared.js";
export type Input = Readonly<{
  values: readonly number[];
  lower: number;
  upper: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "values", label: "values", kind: "numberList" },
  { id: "lower", label: "lower", kind: "number" },
  { id: "upper", label: "upper", kind: "number" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.check(i.upper >= i.lower);
  return H.finish({
    classes: i.values.map((x) =>
      x < i.lower ? "below" : x > i.upper ? "above" : "within",
    ),
  });
};
export const example = {
  input: { values: [0, 2, 4], lower: 1, upper: 3 },
  output: { result: { classes: ["below", "within", "above"] } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "statistics/robust-cutoff-classification-table",
  title: "Explicit Robust Cutoff Classification Table",
  description:
    "Classify observations against explicitly supplied inclusive robust-screen cutoffs; does not estimate robust cutoffs or establish outliers, errors or diagnosis.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit bounded result", kind: "object" }],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
