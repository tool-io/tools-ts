import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  aligned,
  sum,
} from "../batch35-shared.js";
export type Input = Readonly<{
  readonly observedWaterLevelDropsMm: readonly number[];
  readonly observedElapsedMinutes: readonly number[];
}>;
export type Output = Readonly<{
  readonly observedPercolationMinutesPerCm: readonly number[];
  readonly pooledPercolationMinutesPerCm: number;
}>;
const inputFields = [
  {
    id: "observedWaterLevelDropsMm",
    label: "Observed water level drops mm",
    kind: "numberList",
  },
  {
    id: "observedElapsedMinutes",
    label: "Observed elapsed minutes",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.observedWaterLevelDropsMm.forEach((v) =>
    positive(v, "observedWaterLevelDropsMm"),
  );
  input.observedElapsedMinutes.forEach((v) =>
    positive(v, "observedElapsedMinutes"),
  );
  aligned(
    input.observedWaterLevelDropsMm,
    input.observedElapsedMinutes,
    "observedWaterLevelDropsMm",
  );
  return {
    observedPercolationMinutesPerCm: input.observedElapsedMinutes.map(
      (v, i) => (v / input.observedWaterLevelDropsMm[i]) * 10,
    ),
    pooledPercolationMinutesPerCm:
      (sum(input.observedElapsedMinutes) /
        sum(input.observedWaterLevelDropsMm)) *
      10,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedWaterLevelDropsMm: [20, 30],
  observedElapsedMinutes: [10, 30],
} satisfies Input;
export const exampleOutput = {
  observedPercolationMinutesPerCm: [5, 10],
  pooledPercolationMinutesPerCm: 8,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "plumbing/percolation-rate",
  title: "Plumbing Percolation Rate Calculator",
  description:
    "Calibrate actual timed infiltration-level drops with explicit mm→cm rate and pooled exposure; no automatic soil classification or septic permit.",
  inputs: inputFields,
  outputs: [
    {
      id: "observedPercolationMinutesPerCm",
      label: "Observed percolation minutes per cm",
      kind: "numberList",
    },
    {
      id: "pooledPercolationMinutesPerCm",
      label: "Pooled percolation minutes per cm",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      observedWaterLevelDropsMm:
        value.observedWaterLevelDropsMm as readonly number[],
      observedElapsedMinutes: value.observedElapsedMinutes as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
