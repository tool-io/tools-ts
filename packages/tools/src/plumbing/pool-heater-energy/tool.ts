import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  fraction,
} from "../batch35-shared.js";
export type Input = Readonly<{
  readonly observedPoolWaterMassKg: number;
  readonly callerWaterHeatCapacityJkgK: number;
  readonly callerTemperatureRiseC: number;
  readonly callerHeatingWindowHours: number;
  readonly observedSimultaneousPoolHeatLossWatts: number;
  readonly callerDeliveredHeaterEfficiency: number;
}>;
export type Output = Readonly<{
  readonly requiredUsefulPoolHeatJ: number;
  readonly requiredGrossPoolHeaterWatts: number;
}>;
const inputFields = [
  {
    id: "observedPoolWaterMassKg",
    label: "Observed pool water mass kg",
    kind: "number",
  },
  {
    id: "callerWaterHeatCapacityJkgK",
    label: "Caller water heat capacity jkg k",
    kind: "number",
  },
  {
    id: "callerTemperatureRiseC",
    label: "Caller temperature rise c",
    kind: "number",
  },
  {
    id: "callerHeatingWindowHours",
    label: "Caller heating window hours",
    kind: "number",
  },
  {
    id: "observedSimultaneousPoolHeatLossWatts",
    label: "Observed simultaneous pool heat loss watts",
    kind: "number",
  },
  {
    id: "callerDeliveredHeaterEfficiency",
    label: "Caller delivered heater efficiency",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.callerWaterHeatCapacityJkgK, "callerWaterHeatCapacityJkgK");
  positive(input.callerHeatingWindowHours, "callerHeatingWindowHours");
  positive(
    input.callerDeliveredHeaterEfficiency,
    "callerDeliveredHeaterEfficiency",
  );
  nonnegative(input.observedPoolWaterMassKg, "observedPoolWaterMassKg");
  nonnegative(input.callerTemperatureRiseC, "callerTemperatureRiseC");
  nonnegative(
    input.observedSimultaneousPoolHeatLossWatts,
    "observedSimultaneousPoolHeatLossWatts",
  );
  fraction(
    input.callerDeliveredHeaterEfficiency,
    "callerDeliveredHeaterEfficiency",
  );
  const useful =
    input.observedPoolWaterMassKg *
    input.callerWaterHeatCapacityJkgK *
    input.callerTemperatureRiseC;
  return {
    requiredUsefulPoolHeatJ: useful,
    requiredGrossPoolHeaterWatts:
      (useful / input.callerHeatingWindowHours / 3600 +
        input.observedSimultaneousPoolHeatLossWatts) /
      input.callerDeliveredHeaterEfficiency,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedPoolWaterMassKg: 1000,
  callerWaterHeatCapacityJkgK: 4200,
  callerTemperatureRiseC: 2,
  callerHeatingWindowHours: 1,
  observedSimultaneousPoolHeatLossWatts: 100,
  callerDeliveredHeaterEfficiency: 0.8,
} satisfies Input;
export const exampleOutput = {
  requiredUsefulPoolHeatJ: 8400000,
  requiredGrossPoolHeaterWatts: 3041.6666666666665,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "plumbing/pool-heater-energy",
  title: "Plumbing Pool Heater Energy Calculator",
  description:
    "Budget actual pool mass warming plus independently observed concurrent losses and caller delivery window/efficiency; evaporation/weather not inferred, no heater/temperature safety approval.",
  inputs: inputFields,
  outputs: [
    {
      id: "requiredUsefulPoolHeatJ",
      label: "Required useful pool heat j",
      kind: "number",
    },
    {
      id: "requiredGrossPoolHeaterWatts",
      label: "Required gross pool heater watts",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      observedPoolWaterMassKg: value.observedPoolWaterMassKg as number,
      callerWaterHeatCapacityJkgK: value.callerWaterHeatCapacityJkgK as number,
      callerTemperatureRiseC: value.callerTemperatureRiseC as number,
      callerHeatingWindowHours: value.callerHeatingWindowHours as number,
      observedSimultaneousPoolHeatLossWatts:
        value.observedSimultaneousPoolHeatLossWatts as number,
      callerDeliveredHeaterEfficiency:
        value.callerDeliveredHeaterEfficiency as number,
    }),
});
export const run = tool.execute;
export default tool;
