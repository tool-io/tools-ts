import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../core/batch59-shared.js";
export type Input = Readonly<{
  variables: readonly string[];
  exponents: readonly number[];
  variable: string;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "variables", label: "Variables", kind: "stringList" },
  { id: "exponents", label: "Exponents", kind: "numberList" },
  { id: "variable", label: "Variable", kind: "string" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.check(
    i.variables.length === i.exponents.length &&
      new Set(i.variables).size === i.variables.length &&
      i.variables.every((v) => v.length > 0),
  );
  i.exponents.forEach((x) => H.int(x, 0, 1000000));
  const j = i.variables.indexOf(i.variable);
  return H.finish({ exponent: j < 0 ? 0 : i.exponents[j], present: j >= 0 });
};
export const example = {
  input: { variables: ["x", "y"], exponents: [2, 3], variable: "z" },
  output: { result: { exponent: 0, present: false } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "algebra/monomial-variable-degree-label",
  title: "Algebra: Monomial Variable Degree Label Tool",
  description:
    "Read the exponent of one named variable from an explicit unique variable/exponent monomial map, preserving absent-variable zero.",
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
          exponent: { type: "number" },
          present: { type: "boolean" },
        },
        required: ["exponent", "present"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
