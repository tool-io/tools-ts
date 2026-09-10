import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  mean,
  strictlyIncreasing,
} from "../batch47-shared.js";
export type Input = Readonly<{
  readonly independentlyRecordedContractionOnsetsMinutes: readonly number[];
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "independentlyRecordedContractionOnsetsMinutes",
    label: "Independently recorded contraction onsets minutes",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  strictlyIncreasing(
    input.independentlyRecordedContractionOnsetsMinutes,
    "onsets",
    2,
  );
  const g = input.independentlyRecordedContractionOnsetsMinutes
    .slice(1)
    .map((v, i) => v - input.independentlyRecordedContractionOnsetsMinutes[i]);
  return {
    observedOnsetIntervalsMinutes: g,
    observedMeanOnsetIntervalMinutes: mean(g),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: { independentlyRecordedContractionOnsetsMinutes: [0, 5, 11] },
  output: {
    result: {
      observedOnsetIntervalsMinutes: [5, 6],
      observedMeanOnsetIntervalMinutes: 5.5,
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "pregnancy/contraction-frequency",
  title: "Contraction Frequency Calculator",
  description:
    "Actual sequential onset-to-onset contraction intervals, not contraction duration, clinical labour diagnosis, labour stage or instruction to delay care.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Qualified observation, conditional calculation or reference",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
