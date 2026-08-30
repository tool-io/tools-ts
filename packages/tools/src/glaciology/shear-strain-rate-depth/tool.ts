import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  nonnegative,
  aligned,
  ordered,
} from "../shared.js";
export type Input = Readonly<{
  readonly depthsBelowSurfaceM: readonly number[];
  readonly horizontalVelocitiesMPerYear: readonly number[];
}>;
export type Output = Readonly<{
  readonly intervalTensorShearRatesPerYear: readonly number[];
}>;
const inputFields = [
  {
    id: "depthsBelowSurfaceM",
    label: "Depths below surface m",
    kind: "numberList",
  },
  {
    id: "horizontalVelocitiesMPerYear",
    label: "Horizontal velocities m per year",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.depthsBelowSurfaceM.forEach((v) =>
    nonnegative(v, "depthsBelowSurfaceM"),
  );
  aligned(
    input.depthsBelowSurfaceM,
    input.horizontalVelocitiesMPerYear,
    "depthsBelowSurfaceM",
  );
  ordered(input.depthsBelowSurfaceM, "depthsBelowSurfaceM");
  return {
    intervalTensorShearRatesPerYear: input.depthsBelowSurfaceM
      .slice(1)
      .map(
        (z, i) =>
          -(
            input.horizontalVelocitiesMPerYear[i + 1] -
            input.horizontalVelocitiesMPerYear[i]
          ) /
          (2 * (z - input.depthsBelowSurfaceM[i])),
      ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  depthsBelowSurfaceM: [0, 10, 30],
  horizontalVelocitiesMPerYear: [20, 10, 0],
} satisfies Input;
export const exampleOutput = {
  intervalTensorShearRatesPerYear: [0.5, 0.25],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "glaciology/shear-strain-rate-depth",
  title: "Shear Strain Rate Depth",
  description:
    "Estimate epsilon_xz=half du/dz with z positive upward from depths increasing downward and negligible dw/dx; distinct from along-flow normal strain or a constitutive Glen prediction.",
  inputs: inputFields,
  outputs: [
    {
      id: "intervalTensorShearRatesPerYear",
      label: "Interval tensor shear rates per year",
      kind: "numberList",
    },
  ],
  calculate: (value) =>
    calculate({
      depthsBelowSurfaceM: value.depthsBelowSurfaceM as readonly number[],
      horizontalVelocitiesMPerYear:
        value.horizontalVelocitiesMPerYear as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
