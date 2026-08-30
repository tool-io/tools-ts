import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
} from "../batch-shared.js";
export type Input = Readonly<{
  readonly apertureSemiAxes: readonly number[];
  readonly height: number;
}>;
export type Output = Readonly<{ readonly paraboloidVolume: number }>;
const inputFields = [
  { id: "apertureSemiAxes", label: "Aperture semi axes", kind: "numberList" },
  { id: "height", label: "Height", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.apertureSemiAxes.forEach((v) => positive(v, "apertureSemiAxes"));
  nonnegative(input.height, "height");
  if (input.apertureSemiAxes.length !== 2)
    simpleError("axes", "Two elliptical aperture semiaxes required.");
  return {
    paraboloidVolume:
      (Math.PI *
        input.apertureSemiAxes[0] *
        input.apertureSemiAxes[1] *
        input.height) /
      2,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  apertureSemiAxes: [2, 3],
  height: 4,
} satisfies Input;
export const exampleOutput = {
  paraboloidVolume: 37.69911184307752,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "math/paraboloid-volume",
  title: "Paraboloid Volume Calculator",
  description:
    "Compute volume under an elliptical paraboloid from measured aperture semiaxes and height; one half of aperture area times height, not cone/cylinder volume.",
  inputs: inputFields,
  outputs: [
    { id: "paraboloidVolume", label: "Paraboloid volume", kind: "number" },
  ],
  calculate: (value) =>
    calculate({
      apertureSemiAxes: value.apertureSemiAxes as readonly number[],
      height: value.height as number,
    }),
});
export const run = tool.execute;
export default tool;
