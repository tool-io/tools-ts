import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  matchedBsa,
  nonnegative,
} from "../batch49-shared.js";
export type Input = Readonly<{
  readonly actualHeightCm: number;
  readonly actualWeightKg: number;
  readonly callerClinicianPrescribedMassPerSquareMeter: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "actualHeightCm",
    label: "Actual height in centimeters",
    kind: "number",
  },
  { id: "actualWeightKg", label: "Actual weight in kilograms", kind: "number" },
  {
    id: "callerClinicianPrescribedMassPerSquareMeter",
    label: "Caller clinician prescribed mass per square meter",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  nonnegative(
    input.callerClinicianPrescribedMassPerSquareMeter,
    "callerClinicianPrescribedMassPerSquareMeter",
  );
  return {
    value:
      matchedBsa(input.actualHeightCm, input.actualWeightKg, "dubois") *
      input.callerClinicianPrescribedMassPerSquareMeter,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    actualHeightCm: 180,
    actualWeightKg: 80,
    callerClinicianPrescribedMassPerSquareMeter: 3,
  },
  output: { result: { value: 5.989263066825135 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "pharmacy/bsa-dubois-dose",
  title: "DuBois BSA Dose Calculator",
  description:
    "Calculate DuBois BSA from actual height cm and weight kg using the existing named BSA calculation, then multiply by an actual independently clinician-prescribed mass per square meter. Drug/protocol, indication, route, frequency, maxima and eligibility are external; no dose is selected or permission to administer supplied.",
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
