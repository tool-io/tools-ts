import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, atom, literal } from "../batch52-shared.js";
export type Input = Readonly<{
  readonly goalAtom: string;
  readonly assumedLiteral: string;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "goalAtom", label: "Goal atom", kind: "string" },
  { id: "assumedLiteral", label: "Assumed literal", kind: "string" },
] as const satisfies readonly SimpleField[];
const compute = (i: Input): Readonly<Record<string, unknown>> => {
  atom(i.goalAtom);
  literal(i.assumedLiteral);
  return {
    matchesNegatedGoalAssumption: i.assumedLiteral === "!" + i.goalAtom,
    contradictionOrProofEstablished: false,
  };
};
export const calculate = (i: Input): Output => {
  validateInput(i, fields);
  return finish({ result: compute(i) });
};
export const example = {
  input: { goalAtom: "P", assumedLiteral: "!P" },
  output: {
    result: {
      matchesNegatedGoalAssumption: true,
      contradictionOrProofEstablished: false,
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "logic/indirect-proof-neggoal-validator",
  title: "Indirect Proof Negated Goal Assumption Validator",
  description:
    "Check an atomic classical indirect-proof initial assumption against negated goal; does not establish contradiction or validate proof completion.",
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
