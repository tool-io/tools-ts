import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  fraction,
} from "../shared.js";
export type Input = Readonly<{
  readonly plannedHarvestYieldTonnesPerHa: number;
  readonly harvestPhosphorusKgPerTonne: number;
  readonly soilBuildPhosphorusKgPerHa: number;
  readonly otherAvailablePhosphorusKgPerHa: number;
  readonly declaredP2O5ToElementalPMassFactor: number;
  readonly productP2O5MassFraction: number;
}>;
export type Output = Readonly<{
  readonly netElementalPhosphorusBudgetKgPerHa: number;
  readonly equivalentP2O5KgPerHa: number;
  readonly modelPhosphorusProductKgPerHa: number;
}>;
const inputFields = [
  {
    id: "plannedHarvestYieldTonnesPerHa",
    label: "Planned harvest yield tonnes per ha",
    kind: "number",
  },
  {
    id: "harvestPhosphorusKgPerTonne",
    label: "Harvest phosphorus kg per tonne",
    kind: "number",
  },
  {
    id: "soilBuildPhosphorusKgPerHa",
    label: "Soil build phosphorus kg per ha",
    kind: "number",
  },
  {
    id: "otherAvailablePhosphorusKgPerHa",
    label: "Other available phosphorus kg per ha",
    kind: "number",
  },
  {
    id: "declaredP2O5ToElementalPMassFactor",
    label: "Declared p2 o5 to elemental p mass factor",
    kind: "number",
  },
  {
    id: "productP2O5MassFraction",
    label: "Product p2 o5 mass fraction",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(
    input.declaredP2O5ToElementalPMassFactor,
    "declaredP2O5ToElementalPMassFactor",
  );
  positive(input.productP2O5MassFraction, "productP2O5MassFraction");
  nonnegative(
    input.plannedHarvestYieldTonnesPerHa,
    "plannedHarvestYieldTonnesPerHa",
  );
  nonnegative(input.harvestPhosphorusKgPerTonne, "harvestPhosphorusKgPerTonne");
  nonnegative(input.soilBuildPhosphorusKgPerHa, "soilBuildPhosphorusKgPerHa");
  nonnegative(
    input.otherAvailablePhosphorusKgPerHa,
    "otherAvailablePhosphorusKgPerHa",
  );
  fraction(
    input.declaredP2O5ToElementalPMassFactor,
    "declaredP2O5ToElementalPMassFactor",
  );
  fraction(input.productP2O5MassFraction, "productP2O5MassFraction");
  const netElementalPhosphorusBudgetKgPerHa = Math.max(
      0,
      input.plannedHarvestYieldTonnesPerHa * input.harvestPhosphorusKgPerTonne +
        input.soilBuildPhosphorusKgPerHa -
        input.otherAvailablePhosphorusKgPerHa,
    ),
    equivalentP2O5KgPerHa =
      netElementalPhosphorusBudgetKgPerHa /
      input.declaredP2O5ToElementalPMassFactor;
  return {
    netElementalPhosphorusBudgetKgPerHa,
    equivalentP2O5KgPerHa,
    modelPhosphorusProductKgPerHa:
      equivalentP2O5KgPerHa / input.productP2O5MassFraction,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  plannedHarvestYieldTonnesPerHa: 5,
  harvestPhosphorusKgPerTonne: 2,
  soilBuildPhosphorusKgPerHa: 5,
  otherAvailablePhosphorusKgPerHa: 3,
  declaredP2O5ToElementalPMassFactor: 0.44,
  productP2O5MassFraction: 0.2,
} satisfies Input;
export const exampleOutput = {
  netElementalPhosphorusBudgetKgPerHa: 12,
  equivalentP2O5KgPerHa: 27.272727272727273,
  modelPhosphorusProductKgPerHa: 136.36363636363637,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "agriculture/fertilizer-requirement-phosphorus",
  title: "Agriculture Fertilizer Requirement Phosphorus",
  description:
    "Account harvest P removal plus caller soil-build budget and credits, explicitly separating elemental P, P2O5 and product mass; distinct from N recovery/uptake balance, without soil-test recommendations.",
  inputs: inputFields,
  outputs: [
    {
      id: "netElementalPhosphorusBudgetKgPerHa",
      label: "Net elemental phosphorus budget kg per ha",
      kind: "number",
    },
    {
      id: "equivalentP2O5KgPerHa",
      label: "Equivalent p2 o5 kg per ha",
      kind: "number",
    },
    {
      id: "modelPhosphorusProductKgPerHa",
      label: "Model phosphorus product kg per ha",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      plannedHarvestYieldTonnesPerHa:
        value.plannedHarvestYieldTonnesPerHa as number,
      harvestPhosphorusKgPerTonne: value.harvestPhosphorusKgPerTonne as number,
      soilBuildPhosphorusKgPerHa: value.soilBuildPhosphorusKgPerHa as number,
      otherAvailablePhosphorusKgPerHa:
        value.otherAvailablePhosphorusKgPerHa as number,
      declaredP2O5ToElementalPMassFactor:
        value.declaredP2O5ToElementalPMassFactor as number,
      productP2O5MassFraction: value.productP2O5MassFraction as number,
    }),
});
export const run = tool.execute;
export default tool;
