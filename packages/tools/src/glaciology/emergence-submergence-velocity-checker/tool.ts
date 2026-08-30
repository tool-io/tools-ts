import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import { validateInput, finish } from "../shared.js";
export type Input = Readonly<{
  readonly horizontalVelocityMPerYear: readonly number[];
  readonly surfaceElevationGradient: readonly number[];
  readonly verticalVelocityMPerYear: number;
}>;
export type Output = Readonly<{ readonly emergenceVelocityMPerYear: number }>;
const inputFields = [
  {
    id: "horizontalVelocityMPerYear",
    label: "Horizontal velocity m per year",
    kind: "numberList",
  },
  {
    id: "surfaceElevationGradient",
    label: "Surface elevation gradient",
    kind: "numberList",
  },
  {
    id: "verticalVelocityMPerYear",
    label: "Vertical velocity m per year",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  if (
    input.horizontalVelocityMPerYear.length !== 2 ||
    input.surfaceElevationGradient.length !== 2
  )
    simpleError(
      "horizontalVelocityMPerYear",
      "Two horizontal components required.",
    );
  return {
    emergenceVelocityMPerYear:
      input.verticalVelocityMPerYear -
      input.horizontalVelocityMPerYear.reduce(
        (s, v, i) => s + v * input.surfaceElevationGradient[i],
        0,
      ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  horizontalVelocityMPerYear: [10, 20],
  surfaceElevationGradient: [0.1, 0.2],
  verticalVelocityMPerYear: 3,
} satisfies Input;
export const exampleOutput = { emergenceVelocityMPerYear: -2 } satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "glaciology/emergence-submergence-velocity-checker",
  title: "Emergence Submergence Velocity Checker",
  description:
    "Evaluate emergence w−u·grad(surface) in a fixed local horizontal/vertical frame; positive means emerging and negative submerging, without coordinate transformation or balance inference.",
  inputs: inputFields,
  outputs: [
    {
      id: "emergenceVelocityMPerYear",
      label: "Emergence velocity m per year",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      horizontalVelocityMPerYear:
        value.horizontalVelocityMPerYear as readonly number[],
      surfaceElevationGradient:
        value.surfaceElevationGradient as readonly number[],
      verticalVelocityMPerYear: value.verticalVelocityMPerYear as number,
    }),
});
export const run = tool.execute;
export default tool;
