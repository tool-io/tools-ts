import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, pick, identifier } from "../batch52-shared.js";
export type Input = Readonly<{
  readonly negatedQuantifier: string;
  readonly variableName: string;
  readonly predicateName: string;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "negatedQuantifier", label: "Negated quantifier", kind: "string" },
  { id: "variableName", label: "Variable name", kind: "string" },
  { id: "predicateName", label: "Predicate name", kind: "string" },
] as const satisfies readonly SimpleField[];
const compute = (i: Input): Readonly<Record<string, unknown>> => {
  pick(i.negatedQuantifier, { forall: 0, exists: 1 }, "quantifier");
  identifier(i.variableName);
  identifier(i.predicateName);
  return {
    rewrittenFormula:
      (i.negatedQuantifier === "forall" ? "exists " : "forall ") +
      i.variableName +
      ".!" +
      i.predicateName +
      "(" +
      i.variableName +
      ")",
  };
};
export const calculate = (i: Input): Output => {
  validateInput(i, fields);
  return finish({ result: compute(i) });
};
export const example = {
  input: { negatedQuantifier: "forall", variableName: "x", predicateName: "P" },
  output: { result: { rewrittenFormula: "exists x.!P(x)" } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "logic/quantifier-negation-push-rewriter",
  title: "Quantifier Negation Push-Through Rewriter (¬∀→∃¬)",
  description:
    "Classical quantifier-negation duality for one explicitly declared unary atomic predicate only; not arbitrary capture-avoiding formula parsing.",
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
