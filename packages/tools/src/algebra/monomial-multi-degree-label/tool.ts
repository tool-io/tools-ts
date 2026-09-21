import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../core/batch59-shared.js";
export type Input = Readonly<{
  variables: readonly string[];
  exponents: readonly number[];
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "variables", label: "Variables", kind: "stringList" },
  { id: "exponents", label: "Exponents", kind: "numberList" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.check(
    i.variables.length === i.exponents.length &&
      new Set(i.variables).size === i.variables.length,
  );
  i.variables.forEach((v) =>
    H.check(/^[A-Za-z][A-Za-z0-9_]{0,31}(?![\s\S])/.test(v)),
  );
  i.exponents.forEach((x) => H.int(x, 0, 1000000));
  return H.finish({
    label: i.variables.map((v, j) => v + "^" + i.exponents[j]).join(" "),
    multidegree: i.exponents,
  });
};
export const example = {
  input: { variables: ["x", "y"], exponents: [2, 0] },
  output: { result: { label: "x^2 y^0", multidegree: [2, 0] } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "algebra/monomial-multi-degree-label",
  title: "Algebra: Monomial Multi Degree Label Tool",
  description:
    "Format an explicit monomial multidegree preserving variable order and zero exponents; no symbolic parser.",
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
          label: { type: "string" },
          multidegree: { type: "array", items: { type: "number" } },
        },
        required: ["label", "multidegree"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
