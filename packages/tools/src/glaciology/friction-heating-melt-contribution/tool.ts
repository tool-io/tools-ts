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
  readonly basalTractionPa: number;
  readonly slidingSpeedMPerYear: number;
  readonly secondsPerYear: number;
  readonly heatToIceFraction: number;
  readonly iceDensityKgPerM3: number;
  readonly latentHeatJPerKg: number;
}>;
export type Output = Readonly<{
  readonly frictionHeatFluxWattsPerM2: number;
  readonly iceMeltMetersPerYear: number;
}>;
const inputFields = [
  { id: "basalTractionPa", label: "Basal traction pa", kind: "number" },
  {
    id: "slidingSpeedMPerYear",
    label: "Sliding speed m per year",
    kind: "number",
  },
  { id: "secondsPerYear", label: "Seconds per year", kind: "number" },
  { id: "heatToIceFraction", label: "Heat to ice fraction", kind: "number" },
  { id: "iceDensityKgPerM3", label: "Ice density kg per m3", kind: "number" },
  { id: "latentHeatJPerKg", label: "Latent heat j per kg", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.secondsPerYear, "secondsPerYear");
  positive(input.iceDensityKgPerM3, "iceDensityKgPerM3");
  positive(input.latentHeatJPerKg, "latentHeatJPerKg");
  nonnegative(input.basalTractionPa, "basalTractionPa");
  nonnegative(input.slidingSpeedMPerYear, "slidingSpeedMPerYear");
  fraction(input.heatToIceFraction, "heatToIceFraction");
  const frictionHeatFluxWattsPerM2 =
    (input.basalTractionPa * input.slidingSpeedMPerYear) / input.secondsPerYear;
  return {
    frictionHeatFluxWattsPerM2,
    iceMeltMetersPerYear:
      (frictionHeatFluxWattsPerM2 *
        input.secondsPerYear *
        input.heatToIceFraction) /
      (input.iceDensityKgPerM3 * input.latentHeatJPerKg),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  basalTractionPa: 100000,
  slidingSpeedMPerYear: 30,
  secondsPerYear: 30000000,
  heatToIceFraction: 0.5,
  iceDensityKgPerM3: 900,
  latentHeatJPerKg: 300000,
} satisfies Input;
export const exampleOutput = {
  frictionHeatFluxWattsPerM2: 0.1,
  iceMeltMetersPerYear: 0.005555555555555556,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "glaciology/friction-heating-melt-contribution",
  title: "Friction Heating Melt Contribution",
  description:
    "Balance basal traction×sliding power and caller heat partition to ice melt at pressure melting; not geothermal heating or a sliding-speed prediction.",
  inputs: inputFields,
  outputs: [
    {
      id: "frictionHeatFluxWattsPerM2",
      label: "Friction heat flux watts per m2",
      kind: "number",
    },
    {
      id: "iceMeltMetersPerYear",
      label: "Ice melt meters per year",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      basalTractionPa: value.basalTractionPa as number,
      slidingSpeedMPerYear: value.slidingSpeedMPerYear as number,
      secondsPerYear: value.secondsPerYear as number,
      heatToIceFraction: value.heatToIceFraction as number,
      iceDensityKgPerM3: value.iceDensityKgPerM3 as number,
      latentHeatJPerKg: value.latentHeatJPerKg as number,
    }),
});
export const run = tool.execute;
export default tool;
