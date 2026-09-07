import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, nonnegative } from "../batch36-shared.js";
export type Input = Readonly<{ readonly callerBtkBarrierZ: readonly number[] }>;
export type Output = Readonly<{
  readonly zeroEnergyBtkAndreevProbabilities: readonly number[];
}>;
const inputFields = [
  {
    id: "callerBtkBarrierZ",
    label: "Caller btk barrier z",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.callerBtkBarrierZ.forEach((v) => nonnegative(v, "callerBtkBarrierZ"));
  return {
    zeroEnergyBtkAndreevProbabilities: input.callerBtkBarrierZ.map(
      (z) => 1 / (1 + 2 * z * z) ** 2,
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = { callerBtkBarrierZ: [0, 1, 2] } satisfies Input;
export const exampleOutput = {
  zeroEnergyBtkAndreevProbabilities: [
    1, 0.1111111111111111, 0.012345679012345678,
  ],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "semiconductor/andreev-reflection-probability",
  title: "Semiconductor Andreev Reflection Probability Calculator",
  description:
    "Evaluate zero-energy ideal single-channel BTK Andreev probability 1/(1+2Z²)², not normal transparency 1/(1+Z²), finite-energy/temperature or topological test.",
  inputs: inputFields,
  outputs: [
    {
      id: "zeroEnergyBtkAndreevProbabilities",
      label: "Zero energy btk andreev probabilities",
      kind: "numberList",
    },
  ],
  calculate: (value) =>
    calculate({
      callerBtkBarrierZ: value.callerBtkBarrierZ as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
