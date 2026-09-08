import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
} from "../batch46-shared.js";
export type Input = Readonly<{
  readonly callerMeasuredUsableSublimationPowerWattsPerSquareMeter: number;
  readonly callerVerifiedCo2LatentHeatJoulesPerKg: number;
  readonly callerVerifiedFrostDensityKgPerCubicMeter: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "callerMeasuredUsableSublimationPowerWattsPerSquareMeter",
    label: "Caller measured usable sublimation power watts per square meter",
    kind: "number",
  },
  {
    id: "callerVerifiedCo2LatentHeatJoulesPerKg",
    label: "Caller verified co2 latent heat joules per kg",
    kind: "number",
  },
  {
    id: "callerVerifiedFrostDensityKgPerCubicMeter",
    label: "Caller verified frost density kg per cubic meter",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  nonnegative(
    input.callerMeasuredUsableSublimationPowerWattsPerSquareMeter,
    "power",
  );
  positive(input.callerVerifiedCo2LatentHeatJoulesPerKg, "latent");
  positive(input.callerVerifiedFrostDensityKgPerCubicMeter, "density");
  return {
    conditionalSublimationThicknessMmPerDay:
      (input.callerMeasuredUsableSublimationPowerWattsPerSquareMeter *
        86400000) /
      (input.callerVerifiedCo2LatentHeatJoulesPerKg *
        input.callerVerifiedFrostDensityKgPerCubicMeter),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    callerMeasuredUsableSublimationPowerWattsPerSquareMeter: 10,
    callerVerifiedCo2LatentHeatJoulesPerKg: 100000,
    callerVerifiedFrostDensityKgPerCubicMeter: 1000,
  },
  output: { result: { conditionalSublimationThicknessMmPerDay: 8.64 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "astrobiology/mars-co2-frost-sublimation-rate-calculator",
  title: "Mars Seasonal CO2 Frost Sublimation Rate mm/day Calculator",
  description:
    "Conditional energy-limited CO2frost sublimation thickness using independently matched usable heat, latent heat and density. No actual seasonal radiative/thermal balance, condensation or Martian weather inferred.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculated observation or qualified reference",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
