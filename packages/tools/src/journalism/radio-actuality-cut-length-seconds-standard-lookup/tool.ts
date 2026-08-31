import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import {
  validateInput,
  finish,
  nonnegative,
  aligned,
} from "../batch-shared.js";
export type Input = Readonly<{
  readonly sourceCutInSeconds: readonly number[];
  readonly sourceCutOutSeconds: readonly number[];
  readonly callerMinimumActualitySeconds: number;
  readonly callerMaximumActualitySeconds: number;
}>;
export type Output = Readonly<{
  readonly observedActualityDurationsSeconds: readonly number[];
  readonly tooShortCutIndices: readonly number[];
  readonly tooLongCutIndices: readonly number[];
}>;
const inputFields = [
  {
    id: "sourceCutInSeconds",
    label: "Source cut in seconds",
    kind: "numberList",
  },
  {
    id: "sourceCutOutSeconds",
    label: "Source cut out seconds",
    kind: "numberList",
  },
  {
    id: "callerMinimumActualitySeconds",
    label: "Caller minimum actuality seconds",
    kind: "number",
  },
  {
    id: "callerMaximumActualitySeconds",
    label: "Caller maximum actuality seconds",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.sourceCutInSeconds.forEach((v) => nonnegative(v, "sourceCutInSeconds"));
  input.sourceCutOutSeconds.forEach((v) =>
    nonnegative(v, "sourceCutOutSeconds"),
  );
  nonnegative(
    input.callerMinimumActualitySeconds,
    "callerMinimumActualitySeconds",
  );
  nonnegative(
    input.callerMaximumActualitySeconds,
    "callerMaximumActualitySeconds",
  );
  aligned(
    input.sourceCutInSeconds,
    input.sourceCutOutSeconds,
    "sourceCutInSeconds",
  );
  if (input.callerMaximumActualitySeconds < input.callerMinimumActualitySeconds)
    simpleError("policy", "Ordered caller radio-cut duration bounds required.");
  const durations = input.sourceCutOutSeconds.map((v, i) => {
    if (v < input.sourceCutInSeconds[i])
      simpleError("cuts", "Out point must follow in point.");
    return v - input.sourceCutInSeconds[i];
  });
  return {
    observedActualityDurationsSeconds: durations,
    tooShortCutIndices: durations.flatMap((v, i) =>
      v < input.callerMinimumActualitySeconds ? [i] : [],
    ),
    tooLongCutIndices: durations.flatMap((v, i) =>
      v > input.callerMaximumActualitySeconds ? [i] : [],
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  sourceCutInSeconds: [10, 50],
  sourceCutOutSeconds: [20, 80],
  callerMinimumActualitySeconds: 5,
  callerMaximumActualitySeconds: 20,
} satisfies Input;
export const exampleOutput = {
  observedActualityDurationsSeconds: [10, 30],
  tooShortCutIndices: [],
  tooLongCutIndices: [1],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "journalism/radio-actuality-cut-length-seconds-standard-lookup",
  title: "Radio Actuality Cut Length Seconds Standard Lookup",
  description:
    "Audit actual radio source edit in/out intervals under explicit caller duration bounds; no static industry cut length, source file decoding, cue quality or total-package runtime substitution.",
  inputs: inputFields,
  outputs: [
    {
      id: "observedActualityDurationsSeconds",
      label: "Observed actuality durations seconds",
      kind: "numberList",
    },
    {
      id: "tooShortCutIndices",
      label: "Too short cut indices",
      kind: "numberList",
    },
    {
      id: "tooLongCutIndices",
      label: "Too long cut indices",
      kind: "numberList",
    },
  ],
  calculate: (value) =>
    calculate({
      sourceCutInSeconds: value.sourceCutInSeconds as readonly number[],
      sourceCutOutSeconds: value.sourceCutOutSeconds as readonly number[],
      callerMinimumActualitySeconds:
        value.callerMinimumActualitySeconds as number,
      callerMaximumActualitySeconds:
        value.callerMaximumActualitySeconds as number,
    }),
});
export const run = tool.execute;
export default tool;
