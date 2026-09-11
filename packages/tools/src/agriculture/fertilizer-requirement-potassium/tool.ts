import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  fraction,
} from "../batch50-shared.js";
export type Input = Readonly<{
  readonly callerAgronomistPrescribedPotassiumMassKgPerHectare: number;
  readonly actualQualifiedTreatmentHectares: number;
  readonly callerVerifiedProductElementalPotassiumMassFraction: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "callerAgronomistPrescribedPotassiumMassKgPerHectare",
    label: "Caller agronomist prescribed potassium mass kg per hectare",
    kind: "number",
  },
  {
    id: "actualQualifiedTreatmentHectares",
    label: "Actual qualified treatment hectares",
    kind: "number",
  },
  {
    id: "callerVerifiedProductElementalPotassiumMassFraction",
    label: "Caller verified product elemental potassium mass fraction",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  nonnegative(
    input.callerAgronomistPrescribedPotassiumMassKgPerHectare,
    "callerAgronomistPrescribedPotassiumMassKgPerHectare",
  );
  nonnegative(
    input.actualQualifiedTreatmentHectares,
    "actualQualifiedTreatmentHectares",
  );
  fraction(
    input.callerVerifiedProductElementalPotassiumMassFraction,
    "callerVerifiedProductElementalPotassiumMassFraction",
  );
  positive(
    input.callerVerifiedProductElementalPotassiumMassFraction,
    "fraction",
  );
  return {
    value:
      (input.callerAgronomistPrescribedPotassiumMassKgPerHectare *
        input.actualQualifiedTreatmentHectares) /
      input.callerVerifiedProductElementalPotassiumMassFraction,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    callerAgronomistPrescribedPotassiumMassKgPerHectare: 10,
    actualQualifiedTreatmentHectares: 2,
    callerVerifiedProductElementalPotassiumMassFraction: 0.5,
  },
  output: { result: { value: 40 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "agriculture/fertilizer-requirement-potassium",
  title: "Agriculture Fertilizer Requirement Potassium Calculator",
  description:
    "Ledgerqualifiedagronomist prescribedELEMENTALKkg/ha\u00d7actualha/productelementalKfraction, not choose nutrient needs, N/P/K2Oconversionor safe application rate.",
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
