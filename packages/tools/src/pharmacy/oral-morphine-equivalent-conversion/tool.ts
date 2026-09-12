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
  readonly actualRecordedDrugMassMgPerDay: number;
  readonly callerVerifiedMonitoringOnlyMmeFactor: number;
  readonly callerClinicianVerifiedFactorSource: string;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "actualRecordedDrugMassMgPerDay",
    label: "Actual recorded drug mass mg per day",
    kind: "number",
  },
  {
    id: "callerVerifiedMonitoringOnlyMmeFactor",
    label: "Caller verified monitoring only mme factor",
    kind: "number",
  },
  {
    id: "callerClinicianVerifiedFactorSource",
    label: "Caller clinician verified factor source",
    kind: "string",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  nonnegative(
    input.actualRecordedDrugMassMgPerDay,
    "actualRecordedDrugMassMgPerDay",
  );
  positive(
    input.callerVerifiedMonitoringOnlyMmeFactor,
    "callerVerifiedMonitoringOnlyMmeFactor",
  );
  if (!input.callerClinicianVerifiedFactorSource.trim())
    simpleError(
      "callerClinicianVerifiedFactorSource",
      "Explicit non blank actual context.",
    );
  return {
    value:
      input.actualRecordedDrugMassMgPerDay *
      input.callerVerifiedMonitoringOnlyMmeFactor,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    actualRecordedDrugMassMgPerDay: 10,
    callerVerifiedMonitoringOnlyMmeFactor: 2,
    callerClinicianVerifiedFactorSource:
      "independently-reviewed-source/edition",
  },
  output: { result: { value: 20 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "pharmacy/oral-morphine-equivalent-conversion",
  title: "Oral Morphine Equivalent Conversion Calculator",
  description:
    "Monitoring-only actual recorded Oral Morphine Equivalent Conversion Calculator index using independently applicable named form/route factor, not an equipotent switching dose. Incomplete cross-tolerance, nonlinear relationships and individual risk external. All patient/product/route/units and applicable inputs independently clinically established; no dose, route, frequency, eligibility, titration, diagnosis or permission to administer is supplied.",
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
