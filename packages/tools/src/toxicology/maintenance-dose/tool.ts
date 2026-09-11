import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  fraction,
} from "../batch48-shared.js";
export type Input = Readonly<{
  readonly callerClinicianEstablishedTargetConcentrationMgPerLiter: number;
  readonly callerIndependentClearanceLitersPerHour: number;
  readonly callerClinicianEstablishedIntervalHours: number;
  readonly callerClinicianApplicableBioavailabilityFraction: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "callerClinicianEstablishedTargetConcentrationMgPerLiter",
    label: "Caller clinician established target concentration mg per liter",
    kind: "number",
  },
  {
    id: "callerIndependentClearanceLitersPerHour",
    label: "Caller independent clearance liters per hour",
    kind: "number",
  },
  {
    id: "callerClinicianEstablishedIntervalHours",
    label: "Caller clinician established interval hours",
    kind: "number",
  },
  {
    id: "callerClinicianApplicableBioavailabilityFraction",
    label: "Caller clinician applicable bioavailability fraction",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  nonnegative(
    input.callerClinicianEstablishedTargetConcentrationMgPerLiter,
    "target",
  );
  positive(input.callerIndependentClearanceLitersPerHour, "CL");
  positive(input.callerClinicianEstablishedIntervalHours, "interval");
  fraction(input.callerClinicianApplicableBioavailabilityFraction, "F");
  positive(input.callerClinicianApplicableBioavailabilityFraction, "F");
  return {
    conditionalMaintenanceMassScenarioMgPerInterval:
      (input.callerClinicianEstablishedTargetConcentrationMgPerLiter *
        input.callerIndependentClearanceLitersPerHour *
        input.callerClinicianEstablishedIntervalHours) /
      input.callerClinicianApplicableBioavailabilityFraction,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    callerClinicianEstablishedTargetConcentrationMgPerLiter: 2,
    callerIndependentClearanceLitersPerHour: 3,
    callerClinicianEstablishedIntervalHours: 4,
    callerClinicianApplicableBioavailabilityFraction: 0.5,
  },
  output: { result: { conditionalMaintenanceMassScenarioMgPerInterval: 48 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "toxicology/maintenance-dose",
  title: "Maintenance Dose Calculator",
  description:
    "Conditional steady-state averageCt\u00d7CL\u00d7interval/Fmass bookkeeping. Every parameter independently clinician-established; not dose/target/interval selection, prescription, peak/trough guarantee or safety approval.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Qualified observed calculation or explicit reference",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
