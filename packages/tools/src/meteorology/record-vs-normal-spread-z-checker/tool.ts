import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, positive } from "../batch39-shared.js";
export type Input = Readonly<{
  readonly observedRecordValue: number;
  readonly callerMatchedNormalMean: number;
  readonly callerMatchedNormalSD: number;
}>;
export type Output = Readonly<{ readonly signedRecordZ: number }>;
const inputFields = [
  { id: "observedRecordValue", label: "Observed record value", kind: "number" },
  {
    id: "callerMatchedNormalMean",
    label: "Caller matched normal mean",
    kind: "number",
  },
  {
    id: "callerMatchedNormalSD",
    label: "Caller matched normal s d",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.callerMatchedNormalSD, "callerMatchedNormalSD");
  return {
    signedRecordZ:
      (input.observedRecordValue - input.callerMatchedNormalMean) /
      input.callerMatchedNormalSD,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedRecordValue: 15,
  callerMatchedNormalMean: 10,
  callerMatchedNormalSD: 2,
} satisfies Input;
export const exampleOutput = { signedRecordZ: 2.5 } satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "meteorology/record-vs-normal-spread-z-checker",
  title: "Record vs Normal Spread Z Checker",
  description:
    "Record deviation/independent matched normal SD; not tail probability for maxima or normality assumption. Caller independently establishes matching units, evidence, method edition and applicability; output is not compliance, diagnosis, work-safety approval, geological identity or validated hazard prediction.",
  inputs: inputFields,
  outputs: [{ id: "signedRecordZ", label: "Signed record z", kind: "number" }],
  calculate: (value) =>
    calculate({
      observedRecordValue: value.observedRecordValue as number,
      callerMatchedNormalMean: value.callerMatchedNormalMean as number,
      callerMatchedNormalSD: value.callerMatchedNormalSD as number,
    }),
});
export const run = tool.execute;
export default tool;
