import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  simpleError,
  bounded,
} from "../batch50-shared.js";
export type Input = Readonly<{
  readonly actualEligibleBallotsCast: number;
  readonly actualRegisteredEligibleVoters: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "actualEligibleBallotsCast",
    label: "Actual eligible ballots cast",
    kind: "number",
  },
  {
    id: "actualRegisteredEligibleVoters",
    label: "Actual registered eligible voters",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  bounded(
    input.actualEligibleBallotsCast,
    "actualEligibleBallotsCast",
    0,
    1000000,
  );
  bounded(
    input.actualRegisteredEligibleVoters,
    "actualRegisteredEligibleVoters",
    1,
    1000000,
  );
  if (input.actualEligibleBallotsCast > input.actualRegisteredEligibleVoters)
    simpleError("counts", "Actualsubset≤denominator.");
  return {
    value:
      (100 * input.actualEligibleBallotsCast) /
      input.actualRegisteredEligibleVoters,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: { actualEligibleBallotsCast: 2, actualRegisteredEligibleVoters: 4 },
  output: { result: { value: 50.0 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "sociology/voter-turnout-rate",
  title: "Voter Turnout Rate Calculator",
  description:
    "Actual declared registered-voter turnout. Independently matched complete reference population/period/definition; not automated person classification, causal effect, safety or individual identity.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Actual calculation or qualified reference",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
