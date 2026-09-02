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
  fraction,
} from "../batch41-shared.js";
export type Input = Readonly<{
  readonly stellarTemperatureKelvin: number;
  readonly stellarRadiusSameUnits: number;
  readonly orbitalDistanceSameUnits: number;
  readonly bondAlbedo: number;
  readonly callerReradiationAreaFactor: number;
}>;
export type Output = Readonly<{ readonly blackbodyEquilibriumKelvin: number }>;
const inputFields = [
  {
    id: "stellarTemperatureKelvin",
    label: "Stellar temperature kelvin",
    kind: "number",
  },
  {
    id: "stellarRadiusSameUnits",
    label: "Stellar radius same units",
    kind: "number",
  },
  {
    id: "orbitalDistanceSameUnits",
    label: "Orbital distance same units",
    kind: "number",
  },
  { id: "bondAlbedo", label: "Bond albedo", kind: "number" },
  {
    id: "callerReradiationAreaFactor",
    label: "Caller reradiation area factor",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.stellarTemperatureKelvin, "stellarTemperatureKelvin");
  positive(input.stellarRadiusSameUnits, "stellarRadiusSameUnits");
  positive(input.orbitalDistanceSameUnits, "orbitalDistanceSameUnits");
  positive(input.callerReradiationAreaFactor, "callerReradiationAreaFactor");
  fraction(input.bondAlbedo, "bondAlbedo");
  if (input.orbitalDistanceSameUnits <= input.stellarRadiusSameUnits)
    simpleError("orbit", "External stellar orbit required.");
  return {
    blackbodyEquilibriumKelvin:
      input.stellarTemperatureKelvin *
      Math.sqrt(input.stellarRadiusSameUnits / input.orbitalDistanceSameUnits) *
      ((1 - input.bondAlbedo) / input.callerReradiationAreaFactor) ** 0.25,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  stellarTemperatureKelvin: 1000,
  stellarRadiusSameUnits: 1,
  orbitalDistanceSameUnits: 10,
  bondAlbedo: 0.2,
  callerReradiationAreaFactor: 4,
} satisfies Input;
export const exampleOutput = {
  blackbodyEquilibriumKelvin: 211.47425268811284,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "astronomy/exoplanet-equilibrium-temperature",
  title: "Exoplanet Equilibrium Temperature",
  description:
    "Dec lared absorbed stellar flux reradiation-area convention (4 whole sphere,2 day side,1 sub stellar), unit emissivity, no greenhouse/actual surface temperature. Model only, not an ephemeris, measured stellar identity or observational guarantee.",
  inputs: inputFields,
  outputs: [
    {
      id: "blackbodyEquilibriumKelvin",
      label: "Blackbody equilibrium kelvin",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      stellarTemperatureKelvin: value.stellarTemperatureKelvin as number,
      stellarRadiusSameUnits: value.stellarRadiusSameUnits as number,
      orbitalDistanceSameUnits: value.orbitalDistanceSameUnits as number,
      bondAlbedo: value.bondAlbedo as number,
      callerReradiationAreaFactor: value.callerReradiationAreaFactor as number,
    }),
});
export const run = tool.execute;
export default tool;
