import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, bounded } from "../batch52-shared.js";
export type Input = Readonly<{
  readonly domainSize: number;
  readonly falsePredicateInstances: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "domainSize", label: "Domain size", kind: "number" },
  {
    id: "falsePredicateInstances",
    label: "False predicate instances",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (i: Input): Readonly<Record<string, unknown>> => {
  bounded(i.domainSize, "size", 0, 1000000000);
  bounded(i.falsePredicateInstances, "counterexamples", 0, i.domainSize);
  return {
    universalSatisfied: i.falsePredicateInstances === 0,
    vacuouslySatisfied: i.domainSize === 0,
  };
};
export const calculate = (i: Input): Output => {
  validateInput(i, fields);
  return finish({ result: compute(i) });
};
export const example = {
  input: { domainSize: 0, falsePredicateInstances: 0 },
  output: { result: { universalSatisfied: true, vacuouslySatisfied: true } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "logic/vacuous-truth-empty-domain-checker",
  title: "Vacuous Truth Empty Domain Universal Checker",
  description:
    "Classical universal truth from complete finite domain/counterexample counts; empty domain allowed explicitly, no natural-language truth inference.",
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
