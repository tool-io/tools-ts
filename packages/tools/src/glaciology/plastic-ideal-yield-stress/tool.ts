import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import { validateInput, finish, positive, nonnegative } from "../shared.js";
export type Input = Readonly<{
  readonly distancesFromTerminusM: readonly number[];
  readonly yieldStressPa: number;
  readonly iceDensityKgPerM3: number;
  readonly gravityMPerSecondSquared: number;
}>;
export type Output = Readonly<{
  readonly plasticThicknessProfileM: readonly number[];
}>;
const inputFields = [
  {
    id: "distancesFromTerminusM",
    label: "Distances from terminus m",
    kind: "numberList",
  },
  { id: "yieldStressPa", label: "Yield stress pa", kind: "number" },
  { id: "iceDensityKgPerM3", label: "Ice density kg per m3", kind: "number" },
  {
    id: "gravityMPerSecondSquared",
    label: "Gravity m per second squared",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.yieldStressPa, "yieldStressPa");
  positive(input.iceDensityKgPerM3, "iceDensityKgPerM3");
  positive(input.gravityMPerSecondSquared, "gravityMPerSecondSquared");
  input.distancesFromTerminusM.forEach((v) =>
    nonnegative(v, "distancesFromTerminusM"),
  );
  if (!input.distancesFromTerminusM.length)
    simpleError("distancesFromTerminusM", "Nonempty distances required.");
  return {
    plasticThicknessProfileM: input.distancesFromTerminusM.map((x) =>
      Math.sqrt(
        (2 * input.yieldStressPa * x) /
          (input.iceDensityKgPerM3 * input.gravityMPerSecondSquared),
      ),
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  distancesFromTerminusM: [0, 1, 4],
  yieldStressPa: 2,
  iceDensityKgPerM3: 1,
  gravityMPerSecondSquared: 1,
} satisfies Input;
export const exampleOutput = {
  plasticThicknessProfileM: [0, 2, 4],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "glaciology/plastic-ideal-yield-stress",
  title: "Plastic Ideal Yield Stress",
  description:
    "Compute an ideal perfectly plastic flat-bed thickness profile H²=2·tau_y·x/(rho·g); not a Glen steady-state dome or yield-strength determination.",
  inputs: inputFields,
  outputs: [
    {
      id: "plasticThicknessProfileM",
      label: "Plastic thickness profile m",
      kind: "numberList",
    },
  ],
  calculate: (value) =>
    calculate({
      distancesFromTerminusM: value.distancesFromTerminusM as readonly number[],
      yieldStressPa: value.yieldStressPa as number,
      iceDensityKgPerM3: value.iceDensityKgPerM3 as number,
      gravityMPerSecondSquared: value.gravityMPerSecondSquared as number,
    }),
});
export const run = tool.execute;
export default tool;
