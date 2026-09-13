import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, positive, bounded } from "../batch49-shared.js";
export type Input = Readonly<{
  readonly actualNominationCount: number;
  readonly callerMatchedNominationMean: number;
  readonly callerMatchedNominationSd: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "actualNominationCount",
    label: "Actual nomination count",
    kind: "number",
  },
  {
    id: "callerMatchedNominationMean",
    label: "Caller matched nomination mean",
    kind: "number",
  },
  {
    id: "callerMatchedNominationSd",
    label: "Caller matched nomination sd",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  bounded(input.actualNominationCount, "actualNominationCount", 0, 1000000);
  positive(input.callerMatchedNominationSd, "callerMatchedNominationSd");
  return {
    value:
      (input.actualNominationCount - input.callerMatchedNominationMean) /
      input.callerMatchedNominationSd,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    actualNominationCount: 5,
    callerMatchedNominationMean: 3,
    callerMatchedNominationSd: 1,
  },
  output: { result: { value: 2 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "psychology/sociometric-status-z-from-nominations",
  title: "Sociometric Status Z From Nominations Calculator",
  description:
    "Actual sociometricnominationzversus independently appropriate group norm, nominations not identity worthiness or universally validated status. Actual independently qualified instrument/cohort/matching units; no diagnosis, causal outcome, validated personal prediction or universal clinical cutoff.",
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
