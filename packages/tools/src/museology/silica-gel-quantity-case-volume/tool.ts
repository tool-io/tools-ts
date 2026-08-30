import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, positive, nonnegative } from "../shared.js";
export type Input = Readonly<{
  readonly initialHeadspaceMoistureLoadGrams: number;
  readonly forecastIngressMoistureGrams: number;
  readonly callerReserveMoistureGrams: number;
  readonly calibratedUsableGelSorptionGramsPerKg: number;
}>;
export type Output = Readonly<{ readonly requiredConditionedGelKg: number }>;
const inputFields = [
  {
    id: "initialHeadspaceMoistureLoadGrams",
    label: "Initial headspace moisture load grams",
    kind: "number",
  },
  {
    id: "forecastIngressMoistureGrams",
    label: "Forecast ingress moisture grams",
    kind: "number",
  },
  {
    id: "callerReserveMoistureGrams",
    label: "Caller reserve moisture grams",
    kind: "number",
  },
  {
    id: "calibratedUsableGelSorptionGramsPerKg",
    label: "Calibrated usable gel sorption grams per kg",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(
    input.calibratedUsableGelSorptionGramsPerKg,
    "calibratedUsableGelSorptionGramsPerKg",
  );
  nonnegative(
    input.initialHeadspaceMoistureLoadGrams,
    "initialHeadspaceMoistureLoadGrams",
  );
  nonnegative(
    input.forecastIngressMoistureGrams,
    "forecastIngressMoistureGrams",
  );
  nonnegative(input.callerReserveMoistureGrams, "callerReserveMoistureGrams");
  return {
    requiredConditionedGelKg:
      (input.initialHeadspaceMoistureLoadGrams +
        input.forecastIngressMoistureGrams +
        input.callerReserveMoistureGrams) /
      input.calibratedUsableGelSorptionGramsPerKg,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  initialHeadspaceMoistureLoadGrams: 10,
  forecastIngressMoistureGrams: 20,
  callerReserveMoistureGrams: 5,
  calibratedUsableGelSorptionGramsPerKg: 10,
} satisfies Input;
export const exampleOutput = { requiredConditionedGelKg: 3.5 } satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "museology/silica-gel-quantity-case-volume",
  title: "Silica Gel Conditioner Quantity per Case Volume Calculator",
  description:
    "Size conditioned gel from separately estimated headspace/ingress/reserve moisture and measured usable sorption capacity, not a fixed kg per m³ or achievable RH guarantee.",
  inputs: inputFields,
  outputs: [
    {
      id: "requiredConditionedGelKg",
      label: "Required conditioned gel kg",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      initialHeadspaceMoistureLoadGrams:
        value.initialHeadspaceMoistureLoadGrams as number,
      forecastIngressMoistureGrams:
        value.forecastIngressMoistureGrams as number,
      callerReserveMoistureGrams: value.callerReserveMoistureGrams as number,
      calibratedUsableGelSorptionGramsPerKg:
        value.calibratedUsableGelSorptionGramsPerKg as number,
    }),
});
export const run = tool.execute;
export default tool;
