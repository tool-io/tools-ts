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
  readonly callerVeterinarianPrescribedInsulinUnitsPerKgPerAdministration: number;
  readonly verifiedInsulinUnitsPerMl: number;
  readonly actualRecordedAdministeredInsulinUnits: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "independentlyMeasuredAnimalMassKg",
    label: "Independently measured animal mass kg",
    kind: "number",
  },
  {
    id: "callerVeterinarianPrescribedInsulinUnitsPerKgPerAdministration",
    label:
      "Caller veterinarian prescribed insulin units per kg per administration",
    kind: "number",
  },
  {
    id: "verifiedInsulinUnitsPerMl",
    label: "Verified insulin units per ml",
    kind: "number",
  },
  {
    id: "actualRecordedAdministeredInsulinUnits",
    label: "Actual recorded administered insulin units",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  positive(input.independentlyMeasuredAnimalMassKg, "mass");
  positive(
    input.callerVeterinarianPrescribedInsulinUnitsPerKgPerAdministration,
    "independent-prescription",
  );
  positive(input.verifiedInsulinUnitsPerMl, "verified-product");
  nonnegative(input.actualRecordedAdministeredInsulinUnits, "actual");
  const u =
    input.independentlyMeasuredAnimalMassKg *
    input.callerVeterinarianPrescribedInsulinUnitsPerKgPerAdministration;
  return {
    conditionalPrescribedInsulinUnitsPerAdministration: u,
    conditionalVerifiedProductMl: u / input.verifiedInsulinUnitsPerMl,
    signedActualMinusPrescribedInsulinUnits:
      input.actualRecordedAdministeredInsulinUnits - u,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    independentlyMeasuredAnimalMassKg: 10,
    callerVeterinarianPrescribedInsulinUnitsPerKgPerAdministration: 0.1,
    verifiedInsulinUnitsPerMl: 40,
    actualRecordedAdministeredInsulinUnits: 0.8,
  },
  output: {
    result: {
      conditionalPrescribedInsulinUnitsPerAdministration: 1,
      conditionalVerifiedProductMl: 0.025,
      signedActualMinusPrescribedInsulinUnits: -0.2,
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "veterinary/insulin-starting-dose-cat",
  title: "Cat Insulin Starting Dose Calculator",
  description:
    "Pure cat insulin prescription unit/concentration reconciliation. No starting-dose selection, defaults, titration, route/schedule or syringe-mark recommendations. Product strength, syringe compatibility, food/glycemic context and eligibility independently established by veterinarian; no safety approval.",
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
