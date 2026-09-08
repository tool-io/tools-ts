import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, nonnegative } from "../batch46-shared.js";
export type Input = Readonly<{
  readonly independentlyEstablishedPleaYears: number;
  readonly independentlyEstablishedTrialYears: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "independentlyEstablishedPleaYears",
    label: "Independently established plea years",
    kind: "number",
  },
  {
    id: "independentlyEstablishedTrialYears",
    label: "Independently established trial years",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  nonnegative(input.independentlyEstablishedPleaYears, "plea");
  nonnegative(input.independentlyEstablishedTrialYears, "trial");
  return {
    signedSentenceDifferentialYears:
      input.independentlyEstablishedTrialYears -
      input.independentlyEstablishedPleaYears,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    independentlyEstablishedPleaYears: 2,
    independentlyEstablishedTrialYears: 5,
  },
  output: { result: { signedSentenceDifferentialYears: 3 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "criminology/plea-bargain-trial-penalty-differential-years-lookup",
  title: "Plea Bargain Trial Penalty Differential Years Lookup",
  description:
    "Actual independently established matched plea/trial sentence scenario difference. Not sentencing prediction, causal trial penalty or legal advice to plead.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculated observation or qualified reference",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
