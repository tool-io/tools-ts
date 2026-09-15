import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, cnfCounts } from "../batch52-shared.js";
export type Input = Readonly<{ readonly expression: string }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "expression", label: "Expression", kind: "string" },
] as const satisfies readonly SimpleField[];
const compute = (i: Input): Readonly<Record<string, unknown>> => {
  return cnfCounts(i.expression);
};
export const calculate = (i: Input): Output => {
  validateInput(i, fields);
  return finish({ result: compute(i) });
};
export const example = {
  input: { expression: "(A&B)|C" },
  output: {
    result: { clauseCount: 2, literalCount: 4, distributionEvents: 1 },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "logic/cnf-conversion-steps-counter",
  title: "Conjunctive Normal Form CNF Conversion Steps Counter",
  description:
    "Bounded classical propositional !,&,| parser/NNF/CNF conversion; counts distributive Cartesian merge events, not a universal proof-step metric; <=256 clauses, <=4096 literals.",
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
