import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import { validateInput, finish, positive } from "../shared.js";
export type Input = Readonly<{
  readonly clastDiameterM: number;
  readonly clastDensityKgPerM3: number;
  readonly fluidDensityKgPerM3: number;
  readonly gravityMPerSecondSquared: number;
  readonly constantDragCoefficient: number;
  readonly fluidDynamicViscosityPaSeconds: number;
}>;
export type Output = Readonly<{
  readonly terminalSettlingSpeedMPerSecond: number;
  readonly modelReynoldsNumber: number;
}>;
const inputFields = [
  { id: "clastDiameterM", label: "Clast diameter m", kind: "number" },
  {
    id: "clastDensityKgPerM3",
    label: "Clast density kg per m3",
    kind: "number",
  },
  {
    id: "fluidDensityKgPerM3",
    label: "Fluid density kg per m3",
    kind: "number",
  },
  {
    id: "gravityMPerSecondSquared",
    label: "Gravity m per second squared",
    kind: "number",
  },
  {
    id: "constantDragCoefficient",
    label: "Constant drag coefficient",
    kind: "number",
  },
  {
    id: "fluidDynamicViscosityPaSeconds",
    label: "Fluid dynamic viscosity pa seconds",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.clastDiameterM, "clastDiameterM");
  positive(input.clastDensityKgPerM3, "clastDensityKgPerM3");
  positive(input.fluidDensityKgPerM3, "fluidDensityKgPerM3");
  positive(input.gravityMPerSecondSquared, "gravityMPerSecondSquared");
  positive(input.constantDragCoefficient, "constantDragCoefficient");
  positive(
    input.fluidDynamicViscosityPaSeconds,
    "fluidDynamicViscosityPaSeconds",
  );
  if (input.clastDensityKgPerM3 <= input.fluidDensityKgPerM3)
    simpleError("clastDensityKgPerM3", "A denser settling clast is required.");
  const terminalSettlingSpeedMPerSecond = Math.sqrt(
    (4 *
      (input.clastDensityKgPerM3 - input.fluidDensityKgPerM3) *
      input.clastDiameterM *
      input.gravityMPerSecondSquared) /
      (3 * input.fluidDensityKgPerM3 * input.constantDragCoefficient),
  );
  return {
    terminalSettlingSpeedMPerSecond,
    modelReynoldsNumber:
      (input.fluidDensityKgPerM3 *
        terminalSettlingSpeedMPerSecond *
        input.clastDiameterM) /
      input.fluidDynamicViscosityPaSeconds,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  clastDiameterM: 0.01,
  clastDensityKgPerM3: 2000,
  fluidDensityKgPerM3: 1,
  gravityMPerSecondSquared: 10,
  constantDragCoefficient: 1,
  fluidDynamicViscosityPaSeconds: 0.001,
} satisfies Input;
export const exampleOutput = {
  terminalSettlingSpeedMPerSecond: 16.3258486252119,
  modelReynoldsNumber: 163.258486252119,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "volcanology/clast-terminal-velocity-lithic",
  title: "Clast Terminal Velocity Lithic",
  description:
    "Balance spherical-clast buoyant weight against caller constant quadratic drag and report Reynolds number for applicability review; not a Stokes viscous law, nonspherical drag solver or hazard trajectory.",
  inputs: inputFields,
  outputs: [
    {
      id: "terminalSettlingSpeedMPerSecond",
      label: "Terminal settling speed m per second",
      kind: "number",
    },
    {
      id: "modelReynoldsNumber",
      label: "Model reynolds number",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      clastDiameterM: value.clastDiameterM as number,
      clastDensityKgPerM3: value.clastDensityKgPerM3 as number,
      fluidDensityKgPerM3: value.fluidDensityKgPerM3 as number,
      gravityMPerSecondSquared: value.gravityMPerSecondSquared as number,
      constantDragCoefficient: value.constantDragCoefficient as number,
      fluidDynamicViscosityPaSeconds:
        value.fluidDynamicViscosityPaSeconds as number,
    }),
});
export const run = tool.execute;
export default tool;
