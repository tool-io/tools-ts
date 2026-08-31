import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, planckXY } from "../batch-shared.js";
export type Input = Readonly<{ readonly blackbodyTemperatureKelvin: number }>;
export type Output = Readonly<{ readonly approximateCieXy: readonly number[] }>;
const inputFields = [
  {
    id: "blackbodyTemperatureKelvin",
    label: "Blackbody temperature kelvin",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  return { approximateCieXy: planckXY(input.blackbodyTemperatureKelvin) };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  blackbodyTemperatureKelvin: 4000,
} satisfies Input;
export const exampleOutput = {
  approximateCieXy: [0.3805283390625, 0.37673356643812816],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "color/blackbody-kelvin-to-xy-chromaticity-approx",
  title: "Blackbody Kelvin to xy Chromaticity Approx",
  description:
    "Use bounded piecewise polynomial Planckian-locus xy approximation for 1667–25000 K; not spectral integration, measured lamp chromaticity, daylight locus or exact correlated color temperature.",
  inputs: inputFields,
  outputs: [
    { id: "approximateCieXy", label: "Approximate cie xy", kind: "numberList" },
  ],
  calculate: (value) =>
    calculate({
      blackbodyTemperatureKelvin: value.blackbodyTemperatureKelvin as number,
    }),
});
export const run = tool.execute;
export default tool;
