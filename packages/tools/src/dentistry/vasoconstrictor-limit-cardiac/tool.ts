import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  sum,
} from "../batch47-shared.js";
export type Input = Readonly<{
  readonly actualRecordedVasoconstrictorMgByInjection: readonly number[];
  readonly callerClinicianEstablishedApplicableReviewCeilingMg: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "actualRecordedVasoconstrictorMgByInjection",
    label: "Actual recorded vasoconstrictor mg by injection",
    kind: "numberList",
  },
  {
    id: "callerClinicianEstablishedApplicableReviewCeilingMg",
    label: "Caller clinician established applicable review ceiling mg",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  input.actualRecordedVasoconstrictorMgByInjection.forEach((v) =>
    nonnegative(v, "recorded-dose"),
  );
  positive(
    input.callerClinicianEstablishedApplicableReviewCeilingMg,
    "review-ceiling",
  );
  const t = sum(input.actualRecordedVasoconstrictorMgByInjection);
  return {
    observedAdministeredVasoconstrictorMg: t,
    signedRemainingCallerCeilingMg:
      input.callerClinicianEstablishedApplicableReviewCeilingMg - t,
    exceedsCallerCeiling:
      t > input.callerClinicianEstablishedApplicableReviewCeilingMg,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    actualRecordedVasoconstrictorMgByInjection: [0.01, 0.02],
    callerClinicianEstablishedApplicableReviewCeilingMg: 0.04,
  },
  output: {
    result: {
      observedAdministeredVasoconstrictorMg: 0.03,
      signedRemainingCallerCeilingMg: 0.01,
      exceedsCallerCeiling: false,
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "dentistry/vasoconstrictor-limit-cardiac",
  title: "Cardiac Vasoconstrictor Limit Checker",
  description:
    "Actual vasoconstrictor inventory against independently clinician-established cardiac-context review ceiling. No universal cardiac maximum, no safety certification below threshold or dosing advice.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Qualified observation, conditional calculation or reference",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
