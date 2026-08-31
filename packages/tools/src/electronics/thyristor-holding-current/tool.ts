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
} from "../batch32-shared.js";
export type Input = Readonly<{
  readonly postGateRemovalCurrentSamplesA: readonly number[];
  readonly callerHoldingCurrentA: number;
  readonly initiallyLatched: boolean;
}>;
export type Output = Readonly<{
  readonly idealRemainingLatchedFlags: readonly number[];
  readonly firstBelowHoldingSampleIndex: number;
}>;
const inputFields = [
  {
    id: "postGateRemovalCurrentSamplesA",
    label: "Post gate removal current samples a",
    kind: "numberList",
  },
  {
    id: "callerHoldingCurrentA",
    label: "Caller holding current a",
    kind: "number",
  },
  { id: "initiallyLatched", label: "Initially latched", kind: "boolean" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.callerHoldingCurrentA, "callerHoldingCurrentA");
  input.postGateRemovalCurrentSamplesA.forEach((v) =>
    nonnegative(v, "postGateRemovalCurrentSamplesA"),
  );
  if (!input.postGateRemovalCurrentSamplesA.length)
    simpleError("waveform", "Observed post-gate-removal waveform required.");
  let latched = input.initiallyLatched,
    first = -1;
  const flags = input.postGateRemovalCurrentSamplesA.map((v, i) => {
    if (latched && v < input.callerHoldingCurrentA) {
      latched = false;
      first = i;
    }
    return latched ? 1 : 0;
  });
  return {
    idealRemainingLatchedFlags: flags,
    firstBelowHoldingSampleIndex: first,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  postGateRemovalCurrentSamplesA: [0.2, 0.15, 0.05, 0.2],
  callerHoldingCurrentA: 0.1,
  initiallyLatched: true,
} satisfies Input;
export const exampleOutput = {
  idealRemainingLatchedFlags: [1, 1, 0, 0],
  firstBelowHoldingSampleIndex: 2,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "electronics/thyristor-holding-current",
  title: "Thyristor Holding Current Calculator",
  description:
    "Screen measured post-gate-removal thyristor current against caller holding threshold, not relatching automatically when current recovers; ideal sampled threshold model excludes turnoff/recovery time and circuit safety.",
  inputs: inputFields,
  outputs: [
    {
      id: "idealRemainingLatchedFlags",
      label: "Ideal remaining latched flags",
      kind: "numberList",
    },
    {
      id: "firstBelowHoldingSampleIndex",
      label: "First below holding sample index",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      postGateRemovalCurrentSamplesA:
        value.postGateRemovalCurrentSamplesA as readonly number[],
      callerHoldingCurrentA: value.callerHoldingCurrentA as number,
      initiallyLatched: value.initiallyLatched as boolean,
    }),
});
export const run = tool.execute;
export default tool;
