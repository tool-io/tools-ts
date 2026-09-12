import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  simpleError,
  positive,
  nonnegative,
} from "../batch49-shared.js";
export type Input = Readonly<{
  readonly actualVerifiedBodyMassKg: number;
  readonly callerClinicianPrescribedMassMgPerKgPerAdministration: number;
  readonly callerVerifiedProductConcentrationMgPerMl: number;
  readonly actualRecordedAdministeredVolumeMl: number;
  readonly callerVerifiedPrescriptionAndProductContext: string;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "actualVerifiedBodyMassKg",
    label: "Actual verified body mass kg",
    kind: "number",
  },
  {
    id: "callerClinicianPrescribedMassMgPerKgPerAdministration",
    label: "Caller clinician prescribed mass mg per kg per administration",
    kind: "number",
  },
  {
    id: "callerVerifiedProductConcentrationMgPerMl",
    label: "Caller verified product concentration mg per ml",
    kind: "number",
  },
  {
    id: "actualRecordedAdministeredVolumeMl",
    label: "Actual recorded administered volume ml",
    kind: "number",
  },
  {
    id: "callerVerifiedPrescriptionAndProductContext",
    label: "Caller verified prescription and product context",
    kind: "string",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  positive(input.actualVerifiedBodyMassKg, "kg");
  nonnegative(
    input.callerClinicianPrescribedMassMgPerKgPerAdministration,
    "actualprescription",
  );
  positive(input.callerVerifiedProductConcentrationMgPerMl, "product");
  nonnegative(input.actualRecordedAdministeredVolumeMl, "recorded");
  if (!input.callerVerifiedPrescriptionAndProductContext.trim())
    simpleError("context", "Actual clinician order and product context.");
  const m =
      input.actualVerifiedBodyMassKg *
      input.callerClinicianPrescribedMassMgPerKgPerAdministration,
    v = m / input.callerVerifiedProductConcentrationMgPerMl;
  return {
    orderedMassMg: m,
    orderedProductVolumeMl: v,
    signedRecordedMinusOrderedVolumeMl:
      input.actualRecordedAdministeredVolumeMl - v,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    actualVerifiedBodyMassKg: 10,
    callerClinicianPrescribedMassMgPerKgPerAdministration: 2,
    callerVerifiedProductConcentrationMgPerMl: 5,
    actualRecordedAdministeredVolumeMl: 5,
    callerVerifiedPrescriptionAndProductContext:
      "Alteplase Stroke Dose Calculator; actual patient/form/route/prescription independently verified",
  },
  output: {
    result: {
      orderedMassMg: 20,
      orderedProductVolumeMl: 4,
      signedRecordedMinusOrderedVolumeMl: 1,
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "pharmacy/alteplase-mg-kg-stroke",
  title: "Alteplase Stroke Dose Calculator",
  description:
    "Pure independently established Alteplase Stroke Dose Calculator prescription/product ledger. All actual drug/route/indication, per-administration mass, maxima, eligibility and schedule externally clinician-established. No dose default, suggested regimen, clinical permission or safety determination; recorded discrepancy signed.",
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
