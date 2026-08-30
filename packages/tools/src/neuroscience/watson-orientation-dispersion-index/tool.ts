import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import { validateInput, finish, nonnegative } from "../shared.js";
export type Input = Readonly<{
  readonly watsonKappaValues: readonly number[];
}>;
export type Output = Readonly<{
  readonly orientationDispersionIndexes: readonly number[];
}>;
const inputFields = [
  { id: "watsonKappaValues", label: "Watson kappa values", kind: "numberList" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  if (!input.watsonKappaValues.length)
    simpleError(
      "watsonKappaValues",
      "Nonempty fitted Watson concentration values required.",
    );
  input.watsonKappaValues.forEach((v) => nonnegative(v, "watsonKappaValues"));
  return {
    orientationDispersionIndexes: input.watsonKappaValues.map(
      (v) => (2 / Math.PI) * Math.atan2(1, v),
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = { watsonKappaValues: [0, 1] } satisfies Input;
export const exampleOutput = {
  orientationDispersionIndexes: [1, 0.5],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "neuroscience/watson-orientation-dispersion-index",
  title: "Orientation Dispersion Index",
  description:
    "Convert nonnegative fitted Watson concentration κ to ODI=(2/π)atan(1/κ), with κ=0 mapped to one; fitting or validating a neurite model is not performed.",
  inputs: inputFields,
  outputs: [
    {
      id: "orientationDispersionIndexes",
      label: "Orientation dispersion indexes",
      kind: "numberList",
    },
  ],
  calculate: (value) =>
    calculate({
      watsonKappaValues: value.watsonKappaValues as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
