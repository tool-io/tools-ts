import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, positive } from "../batch41-shared.js";
export type Input = Readonly<{
  readonly stellarRadiusMeters: number;
  readonly temperatureKelvin: number;
}>;
export type Output = Readonly<{ readonly blackbodyLuminosityWatts: number }>;
const inputFields = [
  { id: "stellarRadiusMeters", label: "Stellar radius meters", kind: "number" },
  { id: "temperatureKelvin", label: "Temperature kelvin", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.stellarRadiusMeters, "stellarRadiusMeters");
  positive(input.temperatureKelvin, "temperatureKelvin");
  return {
    blackbodyLuminosityWatts:
      4 *
      Math.PI *
      input.stellarRadiusMeters ** 2 *
      5.670374419e-8 *
      input.temperatureKelvin ** 4,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  stellarRadiusMeters: 1,
  temperatureKelvin: 100,
} satisfies Input;
export const exampleOutput = {
  blackbodyLuminosityWatts: 71.25602647133556,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "astronomy/stefan-boltzmann-luminosity",
  title: "Stefan-Boltzmann Luminosity Calculator",
  description:
    "Spherical blackbody stellar bolometric luminosity 4πR²σT⁴, distinct from per-area emissive flux. Model only, not an ephemeris, measured stellar identity or observational guarantee.",
  inputs: inputFields,
  outputs: [
    {
      id: "blackbodyLuminosityWatts",
      label: "Blackbody luminosity watts",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      stellarRadiusMeters: value.stellarRadiusMeters as number,
      temperatureKelvin: value.temperatureKelvin as number,
    }),
});
export const run = tool.execute;
export default tool;
