import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
} from "../batch49-shared.js";
export type Input = Readonly<{
  readonly callerClinicianOrderedMassMg: number;
  readonly callerClinicianIndependentlyApprovedMassRateMgPerMinute: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "callerClinicianOrderedMassMg",
    label: "Caller clinician ordered mass mg",
    kind: "number",
  },
  {
    id: "callerClinicianIndependentlyApprovedMassRateMgPerMinute",
    label: "Caller clinician independently approved mass rate mg per minute",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  nonnegative(
    input.callerClinicianOrderedMassMg,
    "callerClinicianOrderedMassMg",
  );
  positive(
    input.callerClinicianIndependentlyApprovedMassRateMgPerMinute,
    "callerClinicianIndependentlyApprovedMassRateMgPerMinute",
  );
  return {
    value:
      input.callerClinicianOrderedMassMg /
      input.callerClinicianIndependentlyApprovedMassRateMgPerMinute,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    callerClinicianOrderedMassMg: 10,
    callerClinicianIndependentlyApprovedMassRateMgPerMinute: 5,
  },
  output: { result: { value: 2 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "pharmacy/iv-push-dose-time",
  title: "IV Push Dose Time Calculator",
  description:
    "Reconcile independently approved actual IV push mass/rate duration, no push rate selected or route authorization. All patient/product/route/units and applicable inputs independently clinically established; no dose, route, frequency, eligibility, titration, diagnosis or permission to administer is supplied.",
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
