import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../core/batch59-shared.js";
export type Input = Readonly<{
  quantifier: string;
  variable: string;
  predicate: string;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "quantifier",
    label: "Quantifier",
    kind: "string",
    enum: ["forall", "exists"],
  },
  { id: "variable", label: "Variable", kind: "string" },
  { id: "predicate", label: "Predicate", kind: "string" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.choice(i.quantifier, ["forall", "exists"]);
  H.check(
    /^[A-Za-z][A-Za-z0-9_]*(?![\s\S])/.test(i.variable) &&
      i.predicate.trim().length > 0,
  );
  return H.finish({
    negatedQuantifier: i.quantifier === "forall" ? "exists" : "forall",
    variable: i.variable,
    negatedPredicate: "not (" + i.predicate + ")",
  });
};
export const example = {
  input: { quantifier: "forall", variable: "x", predicate: "P(x)" },
  output: {
    result: {
      negatedQuantifier: "exists",
      variable: "x",
      negatedPredicate: "not (P(x))",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "philosophy/quantified-statement-negation-rewrite",
  title: "Philosophy: Quantified Statement Negation Rewrite Tool",
  description:
    "Apply the single outer classical quantifier negation rule to an explicitly supplied opaque predicate and bound-variable token; no parser, variable capture or theorem proving.",
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
          negatedPredicate: { type: "string" },
          negatedQuantifier: { type: "string" },
          variable: { type: "string" },
        },
        required: ["negatedPredicate", "negatedQuantifier", "variable"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
