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
  sum,
} from "../shared.js";
export type Input = Readonly<{
  readonly measuredBatteryEnergyWh: number;
  readonly callerReservedEnergyWh: number;
  readonly powerWattsByOperatingMode: readonly number[];
  readonly modeDutyFractions: readonly number[];
  readonly powerConversionEfficiency: number;
}>;
export type Output = Readonly<{
  readonly averageBatteryDemandWatts: number;
  readonly modeledUsableRuntimeHours: number;
}>;
const inputFields = [
  {
    id: "measuredBatteryEnergyWh",
    label: "Measured battery energy wh",
    kind: "number",
  },
  {
    id: "callerReservedEnergyWh",
    label: "Caller reserved energy wh",
    kind: "number",
  },
  {
    id: "powerWattsByOperatingMode",
    label: "Power watts by operating mode",
    kind: "numberList",
  },
  { id: "modeDutyFractions", label: "Mode duty fractions", kind: "numberList" },
  {
    id: "powerConversionEfficiency",
    label: "Power conversion efficiency",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.powerConversionEfficiency, "powerConversionEfficiency");
  nonnegative(input.measuredBatteryEnergyWh, "measuredBatteryEnergyWh");
  nonnegative(input.callerReservedEnergyWh, "callerReservedEnergyWh");
  input.powerWattsByOperatingMode.forEach((v) =>
    nonnegative(v, "powerWattsByOperatingMode"),
  );
  fraction(input.powerConversionEfficiency, "powerConversionEfficiency");
  input.modeDutyFractions.forEach((v) => fraction(v, "modeDutyFractions"));
  aligned(
    input.powerWattsByOperatingMode,
    input.modeDutyFractions,
    "powerWattsByOperatingMode",
  );
  if (Math.abs(sum(input.modeDutyFractions) - 1) > 1e-12)
    simpleError("duty", "Mode fractions must sum to one.");
  const p = positive(
    input.powerWattsByOperatingMode.reduce(
      (s, v, i) => s + v * input.modeDutyFractions[i],
      0,
    ) / input.powerConversionEfficiency,
    "power",
  );
  return {
    averageBatteryDemandWatts: p,
    modeledUsableRuntimeHours:
      nonnegative(
        input.measuredBatteryEnergyWh - input.callerReservedEnergyWh,
        "reserve",
      ) / p,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  measuredBatteryEnergyWh: 100,
  callerReservedEnergyWh: 10,
  powerWattsByOperatingMode: [5, 20],
  modeDutyFractions: [0.8, 0.2],
  powerConversionEfficiency: 0.9,
} satisfies Input;
export const exampleOutput = {
  averageBatteryDemandWatts: 8 / 0.9,
  modeledUsableRuntimeHours: 10.125,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "museology/climate-case-battery-runtime",
  title: "Climate Case Battery Runtime Transport Calculator",
  description:
    "Budget climate-case runtime under measured energy, explicit mode duty/conversion loss/reserve; no fixed battery capacity, temperature derating or guaranteed climate control.",
  inputs: inputFields,
  outputs: [
    {
      id: "averageBatteryDemandWatts",
      label: "Average battery demand watts",
      kind: "number",
    },
    {
      id: "modeledUsableRuntimeHours",
      label: "Modeled usable runtime hours",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      measuredBatteryEnergyWh: value.measuredBatteryEnergyWh as number,
      callerReservedEnergyWh: value.callerReservedEnergyWh as number,
      powerWattsByOperatingMode:
        value.powerWattsByOperatingMode as readonly number[],
      modeDutyFractions: value.modeDutyFractions as readonly number[],
      powerConversionEfficiency: value.powerConversionEfficiency as number,
    }),
});
export const run = tool.execute;
export default tool;
