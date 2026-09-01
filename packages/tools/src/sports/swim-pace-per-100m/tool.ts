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
  readonly observedSwimSegmentMeters: readonly number[];
  readonly observedSegmentSeconds: readonly number[];
}>;
export type Output = Readonly<{
  readonly observedSecondsPer100mBySegment: readonly number[];
  readonly pooledSwimSecondsPer100m: number;
}>;
const inputFields = [
  {
    id: "observedSwimSegmentMeters",
    label: "Observed swim segment meters",
    kind: "numberList",
  },
  {
    id: "observedSegmentSeconds",
    label: "Observed segment seconds",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.observedSwimSegmentMeters.forEach((v) =>
    positive(v, "observedSwimSegmentMeters"),
  );
  input.observedSegmentSeconds.forEach((v) =>
    positive(v, "observedSegmentSeconds"),
  );
  aligned(
    input.observedSwimSegmentMeters,
    input.observedSegmentSeconds,
    "observedSwimSegmentMeters",
  );
  return {
    observedSecondsPer100mBySegment: input.observedSegmentSeconds.map(
      (v, i) => (100 * v) / input.observedSwimSegmentMeters[i],
    ),
    pooledSwimSecondsPer100m:
      (100 * sum(input.observedSegmentSeconds)) /
      sum(input.observedSwimSegmentMeters),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedSwimSegmentMeters: [100, 200],
  observedSegmentSeconds: [120, 300],
} satisfies Input;
export const exampleOutput = {
  observedSecondsPer100mBySegment: [120, 150],
  pooledSwimSecondsPer100m: 140,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "sports/swim-pace-per-100m",
  title: "Swim Pace Per 100m Calculator",
  description:
    "Pool independently measured unequal swim segment distances/times and retain individual 100m pace; not unweighted segment-pace averaging or SWOLF.",
  inputs: inputFields,
  outputs: [
    {
      id: "observedSecondsPer100mBySegment",
      label: "Observed seconds per100m by segment",
      kind: "numberList",
    },
    {
      id: "pooledSwimSecondsPer100m",
      label: "Pooled swim seconds per100m",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      observedSwimSegmentMeters:
        value.observedSwimSegmentMeters as readonly number[],
      observedSegmentSeconds: value.observedSegmentSeconds as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
