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
  readonly callerVeterinarianPrescribedMgPerKgPerAdministration: number;
  readonly verifiedProductMgPerMl: number;
  readonly actualRecordedAdministeredMg: number;
}>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  {
    id: "independentlyMeasuredAnimalMassKg",
    label: "Independently measured animal mass kg",
    kind: "number",
  },
  {
    id: "callerVeterinarianPrescribedMgPerKgPerAdministration",
    label: "Caller veterinarian prescribed mg per kg per administration",
    kind: "number",
  },
  {
    id: "verifiedProductMgPerMl",
    label: "Verified product mg per ml",
    kind: "number",
  },
  {
    id: "actualRecordedAdministeredMg",
    label: "Actual recorded administered mg",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input) => {
  positive(input.independentlyMeasuredAnimalMassKg, "actual-mass");
  positive(
    input.callerVeterinarianPrescribedMgPerKgPerAdministration,
    "independent-prescription",
  );
  positive(input.verifiedProductMgPerMl, "verified-product");
  nonnegative(input.actualRecordedAdministeredMg, "actual-administered");
  const m =
    input.independentlyMeasuredAnimalMassKg *
    input.callerVeterinarianPrescribedMgPerKgPerAdministration;
  return {
    conditionalPrescribedMgPerAdministration: m,
    conditionalProductMlPerAdministration: m / input.verifiedProductMgPerMl,
    signedActualMinusPrescribedMg: input.actualRecordedAdministeredMg - m,
  };
};
export const calculate = (input: Input) => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    independentlyMeasuredAnimalMassKg: 10,
    callerVeterinarianPrescribedMgPerKgPerAdministration: 1,
    verifiedProductMgPerMl: 2,
    actualRecordedAdministeredMg: 8,
  },
  output: {
    result: {
      conditionalPrescribedMgPerAdministration: 10,
      conditionalProductMlPerAdministration: 5,
      signedActualMinusPrescribedMg: -2,
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "veterinary/antibiotic-dose-enrofloxacin-dog",
  title: "Enrofloxacin Dog Dose Calculator",
  description:
    "Pure arithmetic for dog enrofloxacin under an independently veterinarian established per-administration mg/kg prescription and verified compatible product concentration. Actual administered discrepancy retained. No dose defaults, drug selection, route/frequency, dose titration, eligibility, safety certification or permission to administer; species, formulation, contraindications and plan independently verified.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Qualified observation, conditional calculation or reference",
      kind: "object",

      schema: {
        type: "object",
        additionalProperties: false,
        properties: {
          conditionalPrescribedMgPerAdministration: { type: "number" },
          conditionalProductMlPerAdministration: { type: "number" },
          signedActualMinusPrescribedMg: { type: "number" },
        },
        required: [
          "conditionalPrescribedMgPerAdministration",
          "conditionalProductMlPerAdministration",
          "signedActualMinusPrescribedMg",
        ],
      },
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
