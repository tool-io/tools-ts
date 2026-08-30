import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import { validateInput, finish, positive } from "../shared.js";

export type Input = Readonly<{
  readonly horizontalTemperatureGradientKPerM: readonly number[];
  readonly horizontalWindGradientPerSecond: readonly (readonly number[])[];
}>;
export type Output = Readonly<{
  readonly horizontalKinematicFrontogenesisKPerMPerSecond: number;
  readonly relativeGradientGrowthPerSecond: number;
}>;
const inputFields = [
  {
    id: "horizontalTemperatureGradientKPerM",
    label: "Horizontal temperature gradient k per m",
    kind: "numberList",
  },
  {
    id: "horizontalWindGradientPerSecond",
    label: "Horizontal wind gradient per second",
    kind: "matrix",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  if (
    input.horizontalTemperatureGradientKPerM.length !== 2 ||
    input.horizontalWindGradientPerSecond.length !== 2 ||
    input.horizontalWindGradientPerSecond.some((r) => r.length !== 2)
  )
    simpleError(
      "gradients",
      "Two-component gradient and 2x2 [du/dx,du/dy;dv/dx,dv/dy] required.",
    );
  const [x, y] = input.horizontalTemperatureGradientKPerM,
    m = positive(Math.hypot(x, y), "temperatureGradient"),
    a = input.horizontalWindGradientPerSecond,
    q = -(x * x * a[0][0] + x * y * (a[0][1] + a[1][0]) + y * y * a[1][1]);
  return {
    horizontalKinematicFrontogenesisKPerMPerSecond: q / m,
    relativeGradientGrowthPerSecond: q / (m * m),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  horizontalTemperatureGradientKPerM: [0.001, 0],
  horizontalWindGradientPerSecond: [
    [0.0001, 0],
    [0, 0.0002],
  ],
} satisfies Input;
export const exampleOutput = {
  horizontalKinematicFrontogenesisKPerMPerSecond: -1e-7,
  relativeGradientGrowthPerSecond: -0.0001,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "meteorology/frontogenesis-function-2d",
  title: "Frontogenesis Function 2D",
  description:
    "Compute 2D adiabatic kinematic material growth of temperature-gradient magnitude from caller local velocity-gradient tensor; no vertical tilting/diabatic term, coordinates or front forecast.",
  inputs: inputFields,
  outputs: [
    {
      id: "horizontalKinematicFrontogenesisKPerMPerSecond",
      label: "Horizontal kinematic frontogenesis k per m per second",
      kind: "number",
    },
    {
      id: "relativeGradientGrowthPerSecond",
      label: "Relative gradient growth per second",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      horizontalTemperatureGradientKPerM:
        value.horizontalTemperatureGradientKPerM as readonly number[],
      horizontalWindGradientPerSecond:
        value.horizontalWindGradientPerSecond as readonly (readonly number[])[],
    }),
});
export const run = tool.execute;
export default tool;
