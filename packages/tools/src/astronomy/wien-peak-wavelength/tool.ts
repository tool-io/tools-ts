import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, positive } from "../batch41-shared.js";
export type Input = Readonly<{ readonly blackbodyTemperatureKelvin: number }>;
export type Output = Readonly<{ readonly wavelengthRadiancePeakNm: number }>;
const inputFields = [
  {
    id: "blackbodyTemperatureKelvin",
    label: "Blackbody temperature kelvin",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.blackbodyTemperatureKelvin, "blackbodyTemperatureKelvin");
  return {
    wavelengthRadiancePeakNm: 2.897771955e6 / input.blackbodyTemperatureKelvin,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  blackbodyTemperatureKelvin: 5000,
} satisfies Input;
export const exampleOutput = {
  wavelengthRadiancePeakNm: 579.554391,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "astronomy/wien-peak-wavelength",
  title: "Wien Peak Wavelength Calculator",
  description:
    "Wien displacement wavelength-radiance peak B_lambda, not frequency-radiance peak converted to wavelength. Model only, not an ephemeris, measured stellar identity or observational guarantee.",
  inputs: inputFields,
  outputs: [
    {
      id: "wavelengthRadiancePeakNm",
      label: "Wavelength radiance peak nm",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      blackbodyTemperatureKelvin: value.blackbodyTemperatureKelvin as number,
    }),
});
export const run = tool.execute;
export default tool;
