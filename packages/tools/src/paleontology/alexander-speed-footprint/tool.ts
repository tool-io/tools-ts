import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, positive } from "../shared.js";
export type Input = Readonly<{
  readonly measuredStrideLengthM: number;
  readonly estimatedHipHeightM: number;
  readonly gravityMPerSecondSquared: number;
}>;
export type Output = Readonly<{
  readonly alexanderModelSpeedMPerSecond: number;
  readonly dimensionlessStrideLength: number;
}>;
const inputFields = [
  {
    id: "measuredStrideLengthM",
    label: "Measured stride length m",
    kind: "number",
  },
  {
    id: "estimatedHipHeightM",
    label: "Estimated hip height m",
    kind: "number",
  },
  {
    id: "gravityMPerSecondSquared",
    label: "Gravity m per second squared",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.measuredStrideLengthM, "measuredStrideLengthM");
  positive(input.estimatedHipHeightM, "estimatedHipHeightM");
  positive(input.gravityMPerSecondSquared, "gravityMPerSecondSquared");
  return {
    alexanderModelSpeedMPerSecond:
      0.25 *
      Math.sqrt(input.gravityMPerSecondSquared) *
      input.measuredStrideLengthM ** 1.67 *
      input.estimatedHipHeightM ** -1.17,
    dimensionlessStrideLength:
      input.measuredStrideLengthM / input.estimatedHipHeightM,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  measuredStrideLengthM: 2,
  estimatedHipHeightM: 1,
  gravityMPerSecondSquared: 1,
} satisfies Input;
export const exampleOutput = {
  alexanderModelSpeedMPerSecond: 0.7955364837549186,
  dimensionlessStrideLength: 2,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "paleontology/alexander-speed-footprint",
  title: "Alexander Footprint Speed Estimator",
  description:
    "Evaluate Alexander’s published footprint-stride speed approximation with explicit estimated hip height; stride is successive same-foot spacing, not step length, and model does not prove gait or actual speed.",
  inputs: inputFields,
  outputs: [
    {
      id: "alexanderModelSpeedMPerSecond",
      label: "Alexander model speed m per second",
      kind: "number",
    },
    {
      id: "dimensionlessStrideLength",
      label: "Dimensionless stride length",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      measuredStrideLengthM: value.measuredStrideLengthM as number,
      estimatedHipHeightM: value.estimatedHipHeightM as number,
      gravityMPerSecondSquared: value.gravityMPerSecondSquared as number,
    }),
});
export const run = tool.execute;
export default tool;
