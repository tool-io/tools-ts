import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../css/batch55-shared.js";
export type Input = Readonly<{
  values: readonly number[];
  minimum: number;
  maximum: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "values", label: "values", kind: "numberList" },
  { id: "minimum", label: "minimum", kind: "number" },
  { id: "maximum", label: "maximum", kind: "number" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.check(i.maximum >= i.minimum);
  return H.finish({
    values: i.values.map((x) => Math.max(i.minimum, Math.min(i.maximum, x))),
    changed: i.values.flatMap((x, j) =>
      x < i.minimum || x > i.maximum ? [j] : [],
    ),
  });
};
export const example = {
  input: { values: [0, 2, 9], minimum: 1, maximum: 5 },
  output: { result: { values: [1, 2, 5], changed: [0, 2] } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "statistics/winsorize-explicit-cutoffs",
  title: "Winsorize Explicit Cutoffs",
  description:
    "Winsorize finite observations at explicit inclusive numeric cutoffs, retaining original changed indexes; does not estimate population tail cutoffs.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit bounded result", kind: "object" }],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
