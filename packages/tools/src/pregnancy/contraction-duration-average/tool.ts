import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  simpleError,
  aligned,
  mean,
  strictlyIncreasing,
} from "../batch47-shared.js";
export type Input = Readonly<{
  readonly independentlyRecordedContractionOnsetsSeconds: readonly number[];
  readonly independentlyRecordedContractionEndsSeconds: readonly number[];
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "independentlyRecordedContractionOnsetsSeconds",
    label: "Independently recorded contraction onsets seconds",
    kind: "numberList",
  },
  {
    id: "independentlyRecordedContractionEndsSeconds",
    label: "Independently recorded contraction ends seconds",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  aligned(
    input.independentlyRecordedContractionOnsetsSeconds,
    input.independentlyRecordedContractionEndsSeconds,
    "events",
  );
  strictlyIncreasing(
    input.independentlyRecordedContractionOnsetsSeconds,
    "onsets",
    2,
  );
  const d = input.independentlyRecordedContractionEndsSeconds.map(
    (v, i) => v - input.independentlyRecordedContractionOnsetsSeconds[i],
  );
  if (
    d.some((v) => v < 0) ||
    input.independentlyRecordedContractionEndsSeconds.some(
      (v, i) =>
        i + 1 < input.independentlyRecordedContractionOnsetsSeconds.length &&
        v > input.independentlyRecordedContractionOnsetsSeconds[i + 1],
    )
  )
    simpleError(
      "events",
      "Actual paired chronological nonoverlapping event boundaries.",
    );
  return {
    observedContractionDurationsSeconds: d,
    observedMeanContractionDurationSeconds: mean(d),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    independentlyRecordedContractionOnsetsSeconds: [0, 300],
    independentlyRecordedContractionEndsSeconds: [60, 380],
  },
  output: {
    result: {
      observedContractionDurationsSeconds: [60, 80],
      observedMeanContractionDurationSeconds: 70,
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "pregnancy/contraction-duration-average",
  title: "Average Contraction Duration Calculator",
  description:
    "Actual paired onset/end contraction durations and mean; independently identified nonoverlapping events required. Not onset frequency, labour diagnosis or a universal pattern threshold.",
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
