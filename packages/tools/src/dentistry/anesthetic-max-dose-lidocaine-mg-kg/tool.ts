import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
} from "../batch47-shared.js";
export type Input = Readonly<{
  readonly independentlyMeasuredWeightKg: number;
  readonly callerClinicianEstablishedApplicableMgPerKgCeiling: number;
  readonly callerClinicianEstablishedAbsoluteCeilingMg: number;
  readonly actualAlreadyAdministeredMg: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "independentlyMeasuredWeightKg",
    label: "Independently measured weight kg",
    kind: "number",
  },
  {
    id: "callerClinicianEstablishedApplicableMgPerKgCeiling",
    label: "Caller clinician established applicable mg per kg ceiling",
    kind: "number",
  },
  {
    id: "callerClinicianEstablishedAbsoluteCeilingMg",
    label: "Caller clinician established absolute ceiling mg",
    kind: "number",
  },
  {
    id: "actualAlreadyAdministeredMg",
    label: "Actual already administered mg",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  positive(input.independentlyMeasuredWeightKg, "weight");
  positive(
    input.callerClinicianEstablishedApplicableMgPerKgCeiling,
    "clinical-ceiling",
  );
  positive(
    input.callerClinicianEstablishedAbsoluteCeilingMg,
    "absolute-ceiling",
  );
  nonnegative(input.actualAlreadyAdministeredMg, "administered");
  const m = Math.min(
    input.independentlyMeasuredWeightKg *
      input.callerClinicianEstablishedApplicableMgPerKgCeiling,
    input.callerClinicianEstablishedAbsoluteCeilingMg,
  );
  return {
    conditionalCallerCeilingMg: m,
    signedRemainingToCallerCeilingMg: m - input.actualAlreadyAdministeredMg,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    independentlyMeasuredWeightKg: 60,
    callerClinicianEstablishedApplicableMgPerKgCeiling: 1,
    callerClinicianEstablishedAbsoluteCeilingMg: 50,
    actualAlreadyAdministeredMg: 10,
  },
  output: {
    result: {
      conditionalCallerCeilingMg: 50,
      signedRemainingToCallerCeilingMg: 40,
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "dentistry/anesthetic-max-dose-lidocaine-mg-kg",
  title: "Max Lidocaine Dose mg/kg Calculator",
  description:
    "Conditional lidocaine arithmetic min(weight\u00d7independently established mg/kgceiling, independently established absolute ceiling), less already administered inventory. No dosage defaults, clinical eligibility, safety/maximum-dose recommendation or authorization; formulation, age, comorbidity, interactions and additive anesthetic toxicity reviewed by clinician.",
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
