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
  aligned,
  binary,
} from "../batch36-shared.js";
export type Input = Readonly<{
  readonly observedPcmRetentionSeconds: readonly number[];
  readonly retentionFailureObservedFlags: readonly number[];
}>;
export type Output = Readonly<{
  readonly observedFailedRetentionSeconds: readonly number[];
  readonly rightCensoredRetentionLowerBoundsSeconds: readonly number[];
  readonly minimumObservedFailureRetentionSeconds: number;
}>;
const inputFields = [
  {
    id: "observedPcmRetentionSeconds",
    label: "Observed pcm retention seconds",
    kind: "numberList",
  },
  {
    id: "retentionFailureObservedFlags",
    label: "Retention failure observed flags",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.observedPcmRetentionSeconds.forEach((v) =>
    positive(v, "observedPcmRetentionSeconds"),
  );
  binary(input.retentionFailureObservedFlags, "retentionFailureObservedFlags");
  aligned(
    input.observedPcmRetentionSeconds,
    input.retentionFailureObservedFlags,
    "observedPcmRetentionSeconds",
  );
  const failures = input.observedPcmRetentionSeconds.filter(
    (_, i) => input.retentionFailureObservedFlags[i],
  );
  if (!failures.length)
    simpleError(
      "failures",
      "At least one observed failure required for failure minimum; right-censored samples remain separate.",
    );
  return {
    observedFailedRetentionSeconds: failures,
    rightCensoredRetentionLowerBoundsSeconds:
      input.observedPcmRetentionSeconds.filter(
        (_, i) => !input.retentionFailureObservedFlags[i],
      ),
    minimumObservedFailureRetentionSeconds: Math.min(...failures),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedPcmRetentionSeconds: [100, 200, 50],
  retentionFailureObservedFlags: [1, 0, 1],
} satisfies Input;
export const exampleOutput = {
  observedFailedRetentionSeconds: [100, 50],
  rightCensoredRetentionLowerBoundsSeconds: [200],
  minimumObservedFailureRetentionSeconds: 50,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "semiconductor/pcm-retention-time",
  title: "Semiconductor PCM Retention Time Calculator",
  description:
    "Summarize actual PCM retention failure times separately from right-censored test durations; not treating still-retained samples as failures or universal Arrhenius lifetime prediction.",
  inputs: inputFields,
  outputs: [
    {
      id: "observedFailedRetentionSeconds",
      label: "Observed failed retention seconds",
      kind: "numberList",
    },
    {
      id: "rightCensoredRetentionLowerBoundsSeconds",
      label: "Right censored retention lower bounds seconds",
      kind: "numberList",
    },
    {
      id: "minimumObservedFailureRetentionSeconds",
      label: "Minimum observed failure retention seconds",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      observedPcmRetentionSeconds:
        value.observedPcmRetentionSeconds as readonly number[],
      retentionFailureObservedFlags:
        value.retentionFailureObservedFlags as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
