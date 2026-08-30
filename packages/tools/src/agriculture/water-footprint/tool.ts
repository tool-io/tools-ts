import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, positive, nonnegative } from "../shared.js";
export type Input = Readonly<{
  readonly consumedBlueWaterM3: number;
  readonly consumedGreenWaterM3: number;
  readonly leachedPollutantMassKg: number;
  readonly callerMaximumPollutantKgPerM3: number;
  readonly naturalBackgroundPollutantKgPerM3: number;
  readonly marketableProductTonnes: number;
}>;
export type Output = Readonly<{
  readonly modelGreyDilutionWaterM3: number;
  readonly declaredTotalWaterFootprintM3PerTonne: number;
  readonly blueGreenConsumptionM3PerTonne: number;
}>;
const inputFields = [
  {
    id: "consumedBlueWaterM3",
    label: "Consumed blue water m3",
    kind: "number",
  },
  {
    id: "consumedGreenWaterM3",
    label: "Consumed green water m3",
    kind: "number",
  },
  {
    id: "leachedPollutantMassKg",
    label: "Leached pollutant mass kg",
    kind: "number",
  },
  {
    id: "callerMaximumPollutantKgPerM3",
    label: "Caller maximum pollutant kg per m3",
    kind: "number",
  },
  {
    id: "naturalBackgroundPollutantKgPerM3",
    label: "Natural background pollutant kg per m3",
    kind: "number",
  },
  {
    id: "marketableProductTonnes",
    label: "Marketable product tonnes",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(
    input.callerMaximumPollutantKgPerM3,
    "callerMaximumPollutantKgPerM3",
  );
  positive(input.marketableProductTonnes, "marketableProductTonnes");
  nonnegative(input.consumedBlueWaterM3, "consumedBlueWaterM3");
  nonnegative(input.consumedGreenWaterM3, "consumedGreenWaterM3");
  nonnegative(input.leachedPollutantMassKg, "leachedPollutantMassKg");
  nonnegative(
    input.naturalBackgroundPollutantKgPerM3,
    "naturalBackgroundPollutantKgPerM3",
  );
  const delta = positive(
      input.callerMaximumPollutantKgPerM3 -
        input.naturalBackgroundPollutantKgPerM3,
      "pollutantConcentrationDifference",
    ),
    modelGreyDilutionWaterM3 = input.leachedPollutantMassKg / delta;
  return {
    modelGreyDilutionWaterM3,
    declaredTotalWaterFootprintM3PerTonne:
      (input.consumedBlueWaterM3 +
        input.consumedGreenWaterM3 +
        modelGreyDilutionWaterM3) /
      input.marketableProductTonnes,
    blueGreenConsumptionM3PerTonne:
      (input.consumedBlueWaterM3 + input.consumedGreenWaterM3) /
      input.marketableProductTonnes,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  consumedBlueWaterM3: 100,
  consumedGreenWaterM3: 200,
  leachedPollutantMassKg: 3,
  callerMaximumPollutantKgPerM3: 0.02,
  naturalBackgroundPollutantKgPerM3: 0.01,
  marketableProductTonnes: 2,
} satisfies Input;
export const exampleOutput = {
  modelGreyDilutionWaterM3: 300,
  declaredTotalWaterFootprintM3PerTonne: 300,
  blueGreenConsumptionM3PerTonne: 150,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "agriculture/water-footprint",
  title: "Agriculture Water Footprint",
  description:
    "Report declared blue/green consumption plus caller concentration-based grey dilution equivalent per product tonne; grey water is a model pollution metric, not actual withdrawn/consumed water or a discharge permission.",
  inputs: inputFields,
  outputs: [
    {
      id: "modelGreyDilutionWaterM3",
      label: "Model grey dilution water m3",
      kind: "number",
    },
    {
      id: "declaredTotalWaterFootprintM3PerTonne",
      label: "Declared total water footprint m3 per tonne",
      kind: "number",
    },
    {
      id: "blueGreenConsumptionM3PerTonne",
      label: "Blue green consumption m3 per tonne",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      consumedBlueWaterM3: value.consumedBlueWaterM3 as number,
      consumedGreenWaterM3: value.consumedGreenWaterM3 as number,
      leachedPollutantMassKg: value.leachedPollutantMassKg as number,
      callerMaximumPollutantKgPerM3:
        value.callerMaximumPollutantKgPerM3 as number,
      naturalBackgroundPollutantKgPerM3:
        value.naturalBackgroundPollutantKgPerM3 as number,
      marketableProductTonnes: value.marketableProductTonnes as number,
    }),
});
export const run = tool.execute;
export default tool;
