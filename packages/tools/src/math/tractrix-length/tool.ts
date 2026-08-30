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
  readonly tractrixScale: number;
  readonly startParameter: number;
  readonly endParameter: number;
}>;
export type Output = Readonly<{ readonly tractrixSegmentLength: number }>;
const inputFields = [
  { id: "tractrixScale", label: "Tractrix scale", kind: "number" },
  { id: "startParameter", label: "Start parameter", kind: "number" },
  { id: "endParameter", label: "End parameter", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.tractrixScale, "tractrixScale");
  nonnegative(input.startParameter, "startParameter");
  nonnegative(input.endParameter, "endParameter");
  if (input.endParameter < input.startParameter || input.endParameter > 100)
    simpleError(
      "parameters",
      "Ordered tractrix parameters in [0,100] required.",
    );
  const delta = input.endParameter - input.startParameter;
  return {
    tractrixSegmentLength:
      input.tractrixScale *
      Math.log1p(
        2 * Math.sinh(delta / 2) ** 2 +
          Math.tanh(input.startParameter) * Math.sinh(delta),
      ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  tractrixScale: 2,
  startParameter: 0,
  endParameter: 1,
} satisfies Input;
export const exampleOutput = {
  tractrixSegmentLength: 0.8675616609660542,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "math/tractrix-length",
  title: "Tractrix Length Calculator",
  description:
    "Compute finite tractrix segment x=a(t−tanh t), y=a sech t over nonnegative t from a log-cosh primitive; whole asymptotic tractrix has infinite length.",
  inputs: inputFields,
  outputs: [
    {
      id: "tractrixSegmentLength",
      label: "Tractrix segment length",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      tractrixScale: value.tractrixScale as number,
      startParameter: value.startParameter as number,
      endParameter: value.endParameter as number,
    }),
});
export const run = tool.execute;
export default tool;
