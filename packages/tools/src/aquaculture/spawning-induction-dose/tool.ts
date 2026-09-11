import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, nonnegative } from "../batch50-shared.js";
export type Input = Readonly<{
  readonly actualVerifiedAnimalBiomassKg: number;
  readonly callerVeterinarianPrescribedProductMassPerKg: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "actualVerifiedAnimalBiomassKg",
    label: "Actual verified animal biomass kg",
    kind: "number",
  },
  {
    id: "callerVeterinarianPrescribedProductMassPerKg",
    label: "Caller veterinarian prescribed product mass per kg",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  nonnegative(
    input.actualVerifiedAnimalBiomassKg,
    "actualVerifiedAnimalBiomassKg",
  );
  nonnegative(
    input.callerVeterinarianPrescribedProductMassPerKg,
    "callerVeterinarianPrescribedProductMassPerKg",
  );
  return {
    value:
      input.actualVerifiedAnimalBiomassKg *
      input.callerVeterinarianPrescribedProductMassPerKg,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    actualVerifiedAnimalBiomassKg: 10,
    callerVeterinarianPrescribedProductMassPerKg: 2,
  },
  output: { result: { value: 20 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "aquaculture/spawning-induction-dose",
  title: "Spawning Induction Dose Calculator",
  description:
    "Ledger actual biomass\u00d7independently veterinarian directed spawning product mass/kg, no drug/product/route/frequency/dose selected or administration permission.",
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
