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
  readonly callerClinicianIndependentlyEstablishedTargetConcentrationMgPerLiter: number;
  readonly callerIndependentlyEstablishedDistributionVolumeLiters: number;
  readonly callerClinicianApplicableBioavailabilityFraction: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "callerClinicianIndependentlyEstablishedTargetConcentrationMgPerLiter",
    label:
      "Caller clinician independently established target concentration mg per liter",
    kind: "number",
  },
  {
    id: "callerIndependentlyEstablishedDistributionVolumeLiters",
    label: "Caller independently established distribution volume liters",
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
    input.callerClinicianIndependentlyEstablishedTargetConcentrationMgPerLiter,
    "target",
  );
  positive(input.callerIndependentlyEstablishedDistributionVolumeLiters, "Vd");
  fraction(input.callerClinicianApplicableBioavailabilityFraction, "F");
  positive(input.callerClinicianApplicableBioavailabilityFraction, "F");
  return {
    conditionalLoadingMassScenarioMg:
      (input.callerClinicianIndependentlyEstablishedTargetConcentrationMgPerLiter *
        input.callerIndependentlyEstablishedDistributionVolumeLiters) /
      input.callerClinicianApplicableBioavailabilityFraction,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    callerClinicianIndependentlyEstablishedTargetConcentrationMgPerLiter: 2,
    callerIndependentlyEstablishedDistributionVolumeLiters: 3,
    callerClinicianApplicableBioavailabilityFraction: 0.5,
  },
  output: { result: { conditionalLoadingMassScenarioMg: 12 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "toxicology/loading-dose",
  title: "Loading Dose Calculator",
  description:
    "Conditional Ct\u00d7Vd/Fmass scenario only, all target/distribution/bioavailability independently clinically established. Not choose a loading dose, target, route, timing, eligibility or permit administration.",
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
