import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, positive, nonnegative } from "../shared.js";
export type Input = Readonly<{
  readonly transportWaterVolumeM3: number;
  readonly initialOxygenMgPerLiter: number;
  readonly minimumOxygenMgPerLiter: number;
  readonly oxygenSupplyGramsPerHour: number;
  readonly tripHours: number;
  readonly fishOxygenGramsPerKgHour: number;
  readonly callerMaximumDensityKgPerM3: number;
}>;
export type Output = Readonly<{
  readonly oxygenLimitedBiomassKg: number;
  readonly densityLimitedBiomassKg: number;
  readonly governingBiomassKg: number;
  readonly governingDensityKgPerM3: number;
}>;
const inputFields = [
  {
    id: "transportWaterVolumeM3",
    label: "Transport water volume m3",
    kind: "number",
  },
  {
    id: "initialOxygenMgPerLiter",
    label: "Initial oxygen mg per liter",
    kind: "number",
  },
  {
    id: "minimumOxygenMgPerLiter",
    label: "Minimum oxygen mg per liter",
    kind: "number",
  },
  {
    id: "oxygenSupplyGramsPerHour",
    label: "Oxygen supply grams per hour",
    kind: "number",
  },
  { id: "tripHours", label: "Trip hours", kind: "number" },
  {
    id: "fishOxygenGramsPerKgHour",
    label: "Fish oxygen grams per kg hour",
    kind: "number",
  },
  {
    id: "callerMaximumDensityKgPerM3",
    label: "Caller maximum density kg per m3",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.transportWaterVolumeM3, "transportWaterVolumeM3");
  positive(input.tripHours, "tripHours");
  positive(input.fishOxygenGramsPerKgHour, "fishOxygenGramsPerKgHour");
  nonnegative(input.initialOxygenMgPerLiter, "initialOxygenMgPerLiter");
  nonnegative(input.minimumOxygenMgPerLiter, "minimumOxygenMgPerLiter");
  nonnegative(input.oxygenSupplyGramsPerHour, "oxygenSupplyGramsPerHour");
  nonnegative(input.callerMaximumDensityKgPerM3, "callerMaximumDensityKgPerM3");
  const reserve =
      nonnegative(
        input.initialOxygenMgPerLiter - input.minimumOxygenMgPerLiter,
        "initialOxygenMgPerLiter",
      ) * input.transportWaterVolumeM3,
    oxygenLimitedBiomassKg =
      (reserve + input.oxygenSupplyGramsPerHour * input.tripHours) /
      (input.fishOxygenGramsPerKgHour * input.tripHours),
    densityLimitedBiomassKg =
      input.callerMaximumDensityKgPerM3 * input.transportWaterVolumeM3,
    governingBiomassKg = Math.min(
      oxygenLimitedBiomassKg,
      densityLimitedBiomassKg,
    );
  return {
    oxygenLimitedBiomassKg,
    densityLimitedBiomassKg,
    governingBiomassKg,
    governingDensityKgPerM3: governingBiomassKg / input.transportWaterVolumeM3,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  transportWaterVolumeM3: 2,
  initialOxygenMgPerLiter: 10,
  minimumOxygenMgPerLiter: 5,
  oxygenSupplyGramsPerHour: 20,
  tripHours: 2,
  fishOxygenGramsPerKgHour: 0.2,
  callerMaximumDensityKgPerM3: 50,
} satisfies Input;
export const exampleOutput = {
  oxygenLimitedBiomassKg: 125,
  densityLimitedBiomassKg: 100,
  governingBiomassKg: 100,
  governingDensityKgPerM3: 50,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "aquaculture/transportation-density",
  title: "Transportation Density",
  description:
    "Screen finite-trip biomass against stored/supplied oxygen and a caller density cap; no fish welfare guarantee, CO2/ammonia control or live-transport recommendation.",
  inputs: inputFields,
  outputs: [
    {
      id: "oxygenLimitedBiomassKg",
      label: "Oxygen limited biomass kg",
      kind: "number",
    },
    {
      id: "densityLimitedBiomassKg",
      label: "Density limited biomass kg",
      kind: "number",
    },
    { id: "governingBiomassKg", label: "Governing biomass kg", kind: "number" },
    {
      id: "governingDensityKgPerM3",
      label: "Governing density kg per m3",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      transportWaterVolumeM3: value.transportWaterVolumeM3 as number,
      initialOxygenMgPerLiter: value.initialOxygenMgPerLiter as number,
      minimumOxygenMgPerLiter: value.minimumOxygenMgPerLiter as number,
      oxygenSupplyGramsPerHour: value.oxygenSupplyGramsPerHour as number,
      tripHours: value.tripHours as number,
      fishOxygenGramsPerKgHour: value.fishOxygenGramsPerKgHour as number,
      callerMaximumDensityKgPerM3: value.callerMaximumDensityKgPerM3 as number,
    }),
});
export const run = tool.execute;
export default tool;
