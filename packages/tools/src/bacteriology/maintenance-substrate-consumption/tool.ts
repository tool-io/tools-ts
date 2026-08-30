import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";
import { positive, nonnegative } from "../shared.js";

export type Input = Readonly<{
  readonly specificGrowthRatePerHour: number;
  readonly biomassYieldGramsPerGram: number;
  readonly maintenanceGramsPerGramHour: number;
  readonly biomassGramsPerLiter: number;
}>;
export type Output = Readonly<{
  readonly specificConsumptionGramsPerGramHour: number;
  readonly volumetricConsumptionGramsPerLiterHour: number;
}>;
export const calculate = (input: Input): Output => {
  nonnegative(input.specificGrowthRatePerHour, "specificGrowthRatePerHour");
  positive(input.biomassYieldGramsPerGram, "biomassYieldGramsPerGram");
  nonnegative(input.maintenanceGramsPerGramHour, "maintenanceGramsPerGramHour");
  nonnegative(input.biomassGramsPerLiter, "biomassGramsPerLiter");
  const specificConsumptionGramsPerGramHour =
    input.specificGrowthRatePerHour / input.biomassYieldGramsPerGram +
    input.maintenanceGramsPerGramHour;
  return {
    specificConsumptionGramsPerGramHour,
    volumetricConsumptionGramsPerLiterHour:
      specificConsumptionGramsPerGramHour * input.biomassGramsPerLiter,
  };
};
export const exampleInput = {
  specificGrowthRatePerHour: 0.2,
  biomassYieldGramsPerGram: 0.5,
  maintenanceGramsPerGramHour: 0.02,
  biomassGramsPerLiter: 10,
} satisfies Input;
export const exampleOutput = {
  specificConsumptionGramsPerGramHour: 0.42,
  volumetricConsumptionGramsPerLiterHour: 4.2,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "bacteriology/maintenance-substrate-consumption",
  title: "Maintenance Substrate Consumption",
  description:
    "Compute substrate uptake from growth yield plus maintenance and scale it by biomass concentration.",
  inputs: [
    {
      id: "specificGrowthRatePerHour",
      label: "Specific growth rate per hour",
      kind: "number",
      minimum: 0,
    },
    {
      id: "biomassYieldGramsPerGram",
      label: "Biomass yield grams per gram",
      kind: "number",
    },
    {
      id: "maintenanceGramsPerGramHour",
      label: "Maintenance grams per gram hour",
      kind: "number",
      minimum: 0,
    },
    {
      id: "biomassGramsPerLiter",
      label: "Biomass grams per liter",
      kind: "number",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "specificConsumptionGramsPerGramHour",
      label: "Specific consumption grams per gram hour",
      kind: "number",
    },
    {
      id: "volumetricConsumptionGramsPerLiterHour",
      label: "Volumetric consumption grams per liter hour",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      specificGrowthRatePerHour: value.specificGrowthRatePerHour as number,
      biomassYieldGramsPerGram: value.biomassYieldGramsPerGram as number,
      maintenanceGramsPerGramHour: value.maintenanceGramsPerGramHour as number,
      biomassGramsPerLiter: value.biomassGramsPerLiter as number,
    }),
});
export const run = tool.execute;
export default tool;
