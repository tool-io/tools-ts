import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, positive } from "../batch41-shared.js";
export type Input = Readonly<{
  readonly luminosityWatts: number;
  readonly temperatureKelvin: number;
}>;
export type Output = Readonly<{ readonly blackbodyRadiusMeters: number }>;
const inputFields = [
  { id: "luminosityWatts", label: "Luminosity watts", kind: "number" },
  { id: "temperatureKelvin", label: "Temperature kelvin", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.luminosityWatts, "luminosityWatts");
  positive(input.temperatureKelvin, "temperatureKelvin");
  return {
    blackbodyRadiusMeters:
      Math.sqrt(input.luminosityWatts / (4 * Math.PI * 5.670374419e-8)) /
      input.temperatureKelvin ** 2,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  luminosityWatts: 71.25602647133556,
  temperatureKelvin: 100,
} satisfies Input;
export const exampleOutput = { blackbodyRadiusMeters: 1 } satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "astronomy/star-radius-from-luminosity-temperature",
  title: "Star Radius From Luminosity and Temperature",
  description:
    "Infer spherical effective blackbody radius from independently supplied bolometric luminosity/temperature. Model only, not an ephemeris, measured stellar identity or observational guarantee.",
  inputs: inputFields,
  outputs: [
    {
      id: "blackbodyRadiusMeters",
      label: "Blackbody radius meters",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      luminosityWatts: value.luminosityWatts as number,
      temperatureKelvin: value.temperatureKelvin as number,
    }),
});
export const run = tool.execute;
export default tool;
