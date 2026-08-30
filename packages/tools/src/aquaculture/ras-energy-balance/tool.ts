import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  fraction,
  aligned,
} from "../shared.js";
export type Input = Readonly<{
  readonly equipmentPowersKw: readonly number[];
  readonly dailyOperatingHours: readonly number[];
  readonly heatToWaterFractions: readonly number[];
  readonly waterHeatLossKwhPerDay: number;
  readonly heatRecoveryKwhPerDay: number;
  readonly heaterCop: number;
}>;
export type Output = Readonly<{
  readonly equipmentElectricityKwhPerDay: number;
  readonly equipmentHeatToWaterKwhPerDay: number;
  readonly heaterElectricityKwhPerDay: number;
  readonly totalElectricityKwhPerDay: number;
  readonly heatSurplusKwhPerDay: number;
}>;
const inputFields = [
  { id: "equipmentPowersKw", label: "Equipment powers kw", kind: "numberList" },
  {
    id: "dailyOperatingHours",
    label: "Daily operating hours",
    kind: "numberList",
  },
  {
    id: "heatToWaterFractions",
    label: "Heat to water fractions",
    kind: "numberList",
  },
  {
    id: "waterHeatLossKwhPerDay",
    label: "Water heat loss kwh per day",
    kind: "number",
  },
  {
    id: "heatRecoveryKwhPerDay",
    label: "Heat recovery kwh per day",
    kind: "number",
  },
  { id: "heaterCop", label: "Heater cop", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.heaterCop, "heaterCop");
  input.equipmentPowersKw.forEach((v) => nonnegative(v, "equipmentPowersKw"));
  input.dailyOperatingHours.forEach((v) =>
    nonnegative(v, "dailyOperatingHours"),
  );
  nonnegative(input.waterHeatLossKwhPerDay, "waterHeatLossKwhPerDay");
  nonnegative(input.heatRecoveryKwhPerDay, "heatRecoveryKwhPerDay");
  input.heatToWaterFractions.forEach((v) =>
    fraction(v, "heatToWaterFractions"),
  );
  aligned(
    input.equipmentPowersKw,
    input.dailyOperatingHours,
    "equipmentPowersKw",
  );
  aligned(
    input.equipmentPowersKw,
    input.heatToWaterFractions,
    "equipmentPowersKw",
  );
  if (input.dailyOperatingHours.some((v) => v > 24))
    simpleError(
      "dailyOperatingHours",
      "Operating hours cannot exceed 24 per day.",
    );
  const equipmentElectricityKwhPerDay = input.equipmentPowersKw.reduce(
      (s, v, i) => s + v * input.dailyOperatingHours[i],
      0,
    ),
    equipmentHeatToWaterKwhPerDay = input.equipmentPowersKw.reduce(
      (s, v, i) =>
        s + v * input.dailyOperatingHours[i] * input.heatToWaterFractions[i],
      0,
    ),
    heatBalance =
      equipmentHeatToWaterKwhPerDay +
      input.heatRecoveryKwhPerDay -
      input.waterHeatLossKwhPerDay,
    heaterElectricityKwhPerDay = Math.max(0, -heatBalance) / input.heaterCop;
  return {
    equipmentElectricityKwhPerDay,
    equipmentHeatToWaterKwhPerDay,
    heaterElectricityKwhPerDay,
    totalElectricityKwhPerDay:
      equipmentElectricityKwhPerDay + heaterElectricityKwhPerDay,
    heatSurplusKwhPerDay: Math.max(0, heatBalance),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  equipmentPowersKw: [2, 3, 1],
  dailyOperatingHours: [24, 12, 4],
  heatToWaterFractions: [1, 0.5, 0],
  waterHeatLossKwhPerDay: 70,
  heatRecoveryKwhPerDay: 5,
  heaterCop: 3,
} satisfies Input;
export const exampleOutput = {
  equipmentElectricityKwhPerDay: 88,
  equipmentHeatToWaterKwhPerDay: 66,
  heaterElectricityKwhPerDay: 0,
  totalElectricityKwhPerDay: 88,
  heatSurplusKwhPerDay: 1,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "aquaculture/ras-energy-balance",
  title: "RAS Energy Balance",
  description:
    "Combine equipment electric use and heat-to-water fractions with heat losses/recovery and heater COP; excludes cooling energy, transient temperatures and double-counted heat-recovery electricity.",
  inputs: inputFields,
  outputs: [
    {
      id: "equipmentElectricityKwhPerDay",
      label: "Equipment electricity kwh per day",
      kind: "number",
    },
    {
      id: "equipmentHeatToWaterKwhPerDay",
      label: "Equipment heat to water kwh per day",
      kind: "number",
    },
    {
      id: "heaterElectricityKwhPerDay",
      label: "Heater electricity kwh per day",
      kind: "number",
    },
    {
      id: "totalElectricityKwhPerDay",
      label: "Total electricity kwh per day",
      kind: "number",
    },
    {
      id: "heatSurplusKwhPerDay",
      label: "Heat surplus kwh per day",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      equipmentPowersKw: value.equipmentPowersKw as readonly number[],
      dailyOperatingHours: value.dailyOperatingHours as readonly number[],
      heatToWaterFractions: value.heatToWaterFractions as readonly number[],
      waterHeatLossKwhPerDay: value.waterHeatLossKwhPerDay as number,
      heatRecoveryKwhPerDay: value.heatRecoveryKwhPerDay as number,
      heaterCop: value.heaterCop as number,
    }),
});
export const run = tool.execute;
export default tool;
