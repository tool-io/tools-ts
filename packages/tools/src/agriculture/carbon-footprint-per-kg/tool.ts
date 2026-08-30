import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  aligned,
} from "../shared.js";
export type Input = Readonly<{
  readonly processActivityQuantities: readonly number[];
  readonly declaredEmissionFactorsKgCo2ePerUnit: readonly number[];
  readonly independentlyAccountedNetCarbonStorageKgCo2e: number;
  readonly marketableProductMassKg: number;
}>;
export type Output = Readonly<{
  readonly grossDeclaredEmissionsKgCo2e: number;
  readonly netDeclaredEmissionsKgCo2e: number;
  readonly netDeclaredFootprintKgCo2ePerKg: number;
}>;
const inputFields = [
  {
    id: "processActivityQuantities",
    label: "Process activity quantities",
    kind: "numberList",
  },
  {
    id: "declaredEmissionFactorsKgCo2ePerUnit",
    label: "Declared emission factors kg co2e per unit",
    kind: "numberList",
  },
  {
    id: "independentlyAccountedNetCarbonStorageKgCo2e",
    label: "Independently accounted net carbon storage kg co2e",
    kind: "number",
  },
  {
    id: "marketableProductMassKg",
    label: "Marketable product mass kg",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.marketableProductMassKg, "marketableProductMassKg");
  input.processActivityQuantities.forEach((v) =>
    nonnegative(v, "processActivityQuantities"),
  );
  input.declaredEmissionFactorsKgCo2ePerUnit.forEach((v) =>
    nonnegative(v, "declaredEmissionFactorsKgCo2ePerUnit"),
  );
  aligned(
    input.processActivityQuantities,
    input.declaredEmissionFactorsKgCo2ePerUnit,
    "processActivityQuantities",
  );
  const grossDeclaredEmissionsKgCo2e = input.processActivityQuantities.reduce(
      (s, v, i) => s + v * input.declaredEmissionFactorsKgCo2ePerUnit[i],
      0,
    ),
    netDeclaredEmissionsKgCo2e =
      grossDeclaredEmissionsKgCo2e -
      input.independentlyAccountedNetCarbonStorageKgCo2e;
  return {
    grossDeclaredEmissionsKgCo2e,
    netDeclaredEmissionsKgCo2e,
    netDeclaredFootprintKgCo2ePerKg:
      netDeclaredEmissionsKgCo2e / input.marketableProductMassKg,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  processActivityQuantities: [10, 20],
  declaredEmissionFactorsKgCo2ePerUnit: [2, 0.5],
  independentlyAccountedNetCarbonStorageKgCo2e: 5,
  marketableProductMassKg: 5,
} satisfies Input;
export const exampleOutput = {
  grossDeclaredEmissionsKgCo2e: 30,
  netDeclaredEmissionsKgCo2e: 25,
  netDeclaredFootprintKgCo2ePerKg: 5,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "agriculture/carbon-footprint-per-kg",
  title: "Agriculture Carbon Footprint Per Kg",
  description:
    "Aggregate caller activity/emission factors and independently accounted signed net storage per marketable product mass; accounting boundary/time horizon are caller declared, not verified life-cycle claims or offsets.",
  inputs: inputFields,
  outputs: [
    {
      id: "grossDeclaredEmissionsKgCo2e",
      label: "Gross declared emissions kg co2e",
      kind: "number",
    },
    {
      id: "netDeclaredEmissionsKgCo2e",
      label: "Net declared emissions kg co2e",
      kind: "number",
    },
    {
      id: "netDeclaredFootprintKgCo2ePerKg",
      label: "Net declared footprint kg co2e per kg",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      processActivityQuantities:
        value.processActivityQuantities as readonly number[],
      declaredEmissionFactorsKgCo2ePerUnit:
        value.declaredEmissionFactorsKgCo2ePerUnit as readonly number[],
      independentlyAccountedNetCarbonStorageKgCo2e:
        value.independentlyAccountedNetCarbonStorageKgCo2e as number,
      marketableProductMassKg: value.marketableProductMassKg as number,
    }),
});
export const run = tool.execute;
export default tool;
