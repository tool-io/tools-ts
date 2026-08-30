import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  aligned,
  mean,
  variance,
} from "../shared.js";
export type Input = Readonly<{
  readonly movementDistances: readonly number[];
  readonly movementTimesSeconds: readonly number[];
  readonly endpointErrorsAlongAxis: readonly number[];
}>;
export type Output = Readonly<{
  readonly effectiveWidth: number;
  readonly effectiveIndexOfDifficultyBits: number;
  readonly throughputBitsPerSecond: number;
}>;
const inputFields = [
  { id: "movementDistances", label: "Movement distances", kind: "numberList" },
  {
    id: "movementTimesSeconds",
    label: "Movement times seconds",
    kind: "numberList",
  },
  {
    id: "endpointErrorsAlongAxis",
    label: "Endpoint errors along axis",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  aligned(
    input.movementDistances,
    input.movementTimesSeconds,
    "movementDistances",
  );
  aligned(
    input.movementDistances,
    input.endpointErrorsAlongAxis,
    "movementDistances",
  );
  input.movementDistances.forEach((v) => positive(v, "movementDistances"));
  input.movementTimesSeconds.forEach((v) =>
    positive(v, "movementTimesSeconds"),
  );
  const effectiveWidth =
      4.133 *
      positive(
        Math.sqrt(variance(input.endpointErrorsAlongAxis)),
        "endpointErrorsAlongAxis",
      ),
    effectiveIndexOfDifficultyBits = Math.log2(
      1 + mean(input.movementDistances) / effectiveWidth,
    );
  return {
    effectiveWidth,
    effectiveIndexOfDifficultyBits,
    throughputBitsPerSecond:
      effectiveIndexOfDifficultyBits / mean(input.movementTimesSeconds),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  movementDistances: [100, 100, 100],
  movementTimesSeconds: [1, 1, 1],
  endpointErrorsAlongAxis: [-1, 0, 1],
} satisfies Input;
export const exampleOutput = {
  effectiveWidth: 4.133,
  effectiveIndexOfDifficultyBits: 4.655094160711693,
  throughputBitsPerSecond: 4.655094160711693,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "neuroscience/effective-fitts-throughput",
  title: "Fitts Throughput",
  description:
    "Measure effective Fitts throughput from observed movement times and endpoint dispersion (We=4.133·sample SD); distinct from predicting MT with fitted Fitts coefficients.",
  inputs: inputFields,
  outputs: [
    { id: "effectiveWidth", label: "Effective width", kind: "number" },
    {
      id: "effectiveIndexOfDifficultyBits",
      label: "Effective index of difficulty bits",
      kind: "number",
    },
    {
      id: "throughputBitsPerSecond",
      label: "Throughput bits per second",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      movementDistances: value.movementDistances as readonly number[],
      movementTimesSeconds: value.movementTimesSeconds as readonly number[],
      endpointErrorsAlongAxis:
        value.endpointErrorsAlongAxis as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
