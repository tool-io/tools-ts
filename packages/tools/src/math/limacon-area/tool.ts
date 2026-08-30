import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import { validateInput, finish, nonnegative } from "../batch-shared.js";
export type Input = Readonly<{
  readonly radialOffset: number;
  readonly cosineAmplitude: number;
}>;
export type Output = Readonly<{
  readonly tracedPolarArea: number;
  readonly hasInnerLoop: boolean;
}>;
const inputFields = [
  { id: "radialOffset", label: "Radial offset", kind: "number" },
  { id: "cosineAmplitude", label: "Cosine amplitude", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  nonnegative(input.radialOffset, "radialOffset");
  nonnegative(input.cosineAmplitude, "cosineAmplitude");
  if (input.radialOffset === 0 && input.cosineAmplitude === 0)
    simpleError("curve", "Nonzero limacon required.");
  return {
    tracedPolarArea:
      Math.PI * (input.radialOffset ** 2 + input.cosineAmplitude ** 2 / 2),
    hasInnerLoop: input.cosineAmplitude > input.radialOffset,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  radialOffset: 2,
  cosineAmplitude: 1,
} satisfies Input;
export const exampleOutput = {
  tracedPolarArea: 14.137166941154069,
  hasInnerLoop: false,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "math/limacon-area",
  title: "Limacon Area Calculator",
  description:
    "Compute one 0–2π polar trace area for r=a+b cos θ; when b>a inner/outer loops are both counted by polar integral, not a geometric union area.",
  inputs: inputFields,
  outputs: [
    { id: "tracedPolarArea", label: "Traced polar area", kind: "number" },
    { id: "hasInnerLoop", label: "Has inner loop", kind: "boolean" },
  ],
  calculate: (value) =>
    calculate({
      radialOffset: value.radialOffset as number,
      cosineAmplitude: value.cosineAmplitude as number,
    }),
});
export const run = tool.execute;
export default tool;
