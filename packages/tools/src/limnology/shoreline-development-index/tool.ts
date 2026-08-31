import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import { validateInput, finish, positive } from "../batch32-shared.js";
export type Input = Readonly<{
  readonly observedShorelineLengthM: number;
  readonly lakeSurfaceAreaM2: number;
}>;
export type Output = Readonly<{
  readonly shorelineDevelopmentIndex: number;
  readonly equivalentCirclePerimeterM: number;
}>;
const inputFields = [
  {
    id: "observedShorelineLengthM",
    label: "Observed shoreline length m",
    kind: "number",
  },
  { id: "lakeSurfaceAreaM2", label: "Lake surface area m2", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.observedShorelineLengthM, "observedShorelineLengthM");
  positive(input.lakeSurfaceAreaM2, "lakeSurfaceAreaM2");
  const circle = 2 * Math.sqrt(Math.PI * input.lakeSurfaceAreaM2);
  if (input.observedShorelineLengthM < circle * (1 - 1e-10))
    simpleError(
      "shoreline",
      "Supplied shoreline violates planar minimum circle perimeter; measurement scopes must match.",
    );
  return {
    shorelineDevelopmentIndex: input.observedShorelineLengthM / circle,
    equivalentCirclePerimeterM: circle,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedShorelineLengthM: 12.566370614359172,
  lakeSurfaceAreaM2: 3.141592653589793,
} satisfies Input;
export const exampleOutput = {
  shorelineDevelopmentIndex: 2,
  equivalentCirclePerimeterM: 6.283185307179586,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "limnology/shoreline-development-index",
  title: "Shoreline Development Index Calculator",
  description:
    "Normalize actual same-resolution planar shoreline to equal-area circle; depends on shoreline resolution/islands and excludes GIS/geodesy measurement or ecological complexity guarantees.",
  inputs: inputFields,
  outputs: [
    {
      id: "shorelineDevelopmentIndex",
      label: "Shoreline development index",
      kind: "number",
    },
    {
      id: "equivalentCirclePerimeterM",
      label: "Equivalent circle perimeter m",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      observedShorelineLengthM: value.observedShorelineLengthM as number,
      lakeSurfaceAreaM2: value.lakeSurfaceAreaM2 as number,
    }),
});
export const run = tool.execute;
export default tool;
