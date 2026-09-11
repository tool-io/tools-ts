import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
} from "../batch47-shared.js";
export type Input = Readonly<{
  readonly independentlyMeasuredAnimalMassKg: number;
  readonly callerVeterinarianPrescribedMlPerKgPerHour: number;
  readonly actualRecordedDeliveredMl: number;
  readonly actualDeliveryElapsedHours: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "independentlyMeasuredAnimalMassKg",
    label: "Independently measured animal mass kg",
    kind: "number",
  },
  {
    id: "callerVeterinarianPrescribedMlPerKgPerHour",
    label: "Caller veterinarian prescribed ml per kg per hour",
    kind: "number",
  },
  {
    id: "actualRecordedDeliveredMl",
    label: "Actual recorded delivered ml",
    kind: "number",
  },
  {
    id: "actualDeliveryElapsedHours",
    label: "Actual delivery elapsed hours",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  positive(input.independentlyMeasuredAnimalMassKg, "mass");
  positive(
    input.callerVeterinarianPrescribedMlPerKgPerHour,
    "independent-prescription",
  );
  nonnegative(input.actualRecordedDeliveredMl, "actual-volume");
  positive(input.actualDeliveryElapsedHours, "time");
  const p =
      input.independentlyMeasuredAnimalMassKg *
      input.callerVeterinarianPrescribedMlPerKgPerHour,
    a = input.actualRecordedDeliveredMl / input.actualDeliveryElapsedHours;
  return {
    conditionalPrescribedMlPerHour: p,
    actualObservedMlPerHour: a,
    signedObservedMinusPrescribedMlPerHour: a - p,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    independentlyMeasuredAnimalMassKg: 10,
    callerVeterinarianPrescribedMlPerKgPerHour: 2,
    actualRecordedDeliveredMl: 30,
    actualDeliveryElapsedHours: 1,
  },
  output: {
    result: {
      conditionalPrescribedMlPerHour: 20,
      actualObservedMlPerHour: 30,
      signedObservedMinusPrescribedMlPerHour: 10,
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "veterinary/fluid-rate-ml-hr-shock",
  title: "Shock Fluid Rate mL/hr Calculator",
  description:
    "Actual actual shock-fluid delivery versus independent veterinarian plan. Weight\u00d7explicit independent prescription versus actual recorded delivered volume/time. No universal shock bolus, maintenance default, fluid composition, patient eligibility or safe infusion approval.",
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
