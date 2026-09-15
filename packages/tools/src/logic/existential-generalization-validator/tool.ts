import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  simpleError,
  identifier,
} from "../batch52-shared.js";
export type Input = Readonly<{
  readonly predicateName: string;
  readonly variableName: string;
  readonly constantName: string;
  readonly proposedFormula: string;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "predicateName", label: "Predicate name", kind: "string" },
  { id: "variableName", label: "Variable name", kind: "string" },
  { id: "constantName", label: "Constant name", kind: "string" },
  { id: "proposedFormula", label: "Proposed formula", kind: "string" },
] as const satisfies readonly SimpleField[];
const compute = (i: Input): Readonly<Record<string, unknown>> => {
  identifier(i.predicateName);
  identifier(i.variableName);
  identifier(i.constantName);
  if (i.variableName === i.constantName)
    simpleError("names", "Distinct bound variable and constant.");
  const expected =
    "exists " +
    i.variableName +
    "." +
    i.predicateName +
    "(" +
    i.variableName +
    ")";
  return {
    validUnaryAtomicStep: i.proposedFormula === expected,
    premiseRequired: i.predicateName + "(" + i.constantName + ")",
  };
};
export const calculate = (i: Input): Output => {
  validateInput(i, fields);
  return finish({ result: compute(i) });
};
export const example = {
  input: {
    predicateName: "P",
    variableName: "x",
    constantName: "a",
    proposedFormula: "exists x.P(x)",
  },
  output: { result: { validUnaryAtomicStep: true, premiseRequired: "P(a)" } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "logic/existential-generalization-validator",
  title: "Existential Generalization EG Step Validator (P(a) ⊢ ∃x P(x))",
  description:
    "Check exact existential generalization unary atomic notation against an explicitly declared premise template; no arbitrary formula substitution/capture or proof context inference.",
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
