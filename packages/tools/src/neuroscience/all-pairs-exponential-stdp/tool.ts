import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import { validateInput, finish, positive, nonnegative } from "../shared.js";
export type Input = Readonly<{
  readonly presynapticTimesMs: readonly number[];
  readonly postsynapticTimesMs: readonly number[];
  readonly potentiationAmplitude: number;
  readonly depressionAmplitude: number;
  readonly potentiationTauMs: number;
  readonly depressionTauMs: number;
}>;
export type Output = Readonly<{
  readonly pairLagsMs: readonly number[];
  readonly pairWeightChanges: readonly number[];
  readonly summedWeightChange: number;
}>;
const inputFields = [
  {
    id: "presynapticTimesMs",
    label: "Presynaptic times ms",
    kind: "numberList",
  },
  {
    id: "postsynapticTimesMs",
    label: "Postsynaptic times ms",
    kind: "numberList",
  },
  {
    id: "potentiationAmplitude",
    label: "Potentiation amplitude",
    kind: "number",
  },
  { id: "depressionAmplitude", label: "Depression amplitude", kind: "number" },
  { id: "potentiationTauMs", label: "Potentiation tau ms", kind: "number" },
  { id: "depressionTauMs", label: "Depression tau ms", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  if (
    !input.presynapticTimesMs.length ||
    !input.postsynapticTimesMs.length ||
    input.presynapticTimesMs.length * input.postsynapticTimesMs.length > 100000
  )
    simpleError(
      "presynapticTimesMs",
      "Nonempty bounded all-to-all spike pairs required.",
    );
  for (const row of [input.presynapticTimesMs, input.postsynapticTimesMs])
    if (row.some((v, i) => i > 0 && v <= row[i - 1]))
      simpleError(
        "presynapticTimesMs",
        "Distinct increasing spike times required within each train.",
      );
  nonnegative(input.potentiationAmplitude, "potentiationAmplitude");
  nonnegative(input.depressionAmplitude, "depressionAmplitude");
  positive(input.potentiationTauMs, "potentiationTauMs");
  positive(input.depressionTauMs, "depressionTauMs");
  const pairLagsMs = input.presynapticTimesMs.flatMap((pre) =>
      input.postsynapticTimesMs.map((post) => post - pre),
    ),
    pairWeightChanges = pairLagsMs.map((dt) =>
      dt > 0
        ? input.potentiationAmplitude * Math.exp(-dt / input.potentiationTauMs)
        : dt < 0
          ? -input.depressionAmplitude * Math.exp(dt / input.depressionTauMs)
          : 0,
    );
  return {
    pairLagsMs,
    pairWeightChanges,
    summedWeightChange: pairWeightChanges.reduce((a, b) => a + b, 0),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  presynapticTimesMs: [0],
  postsynapticTimesMs: [10],
  potentiationAmplitude: 0.1,
  depressionAmplitude: 0.2,
  potentiationTauMs: 10,
  depressionTauMs: 20,
} satisfies Input;
export const exampleOutput = {
  pairLagsMs: [10],
  pairWeightChanges: [0.036787944117144235],
  summedWeightChange: 0.036787944117144235,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "neuroscience/all-pairs-exponential-stdp",
  title: "STDP Weight Change",
  description:
    "Evaluate additive exponential STDP for explicitly all-to-all spike pairs, post−pre lag; simultaneous spikes contribute zero, and weight saturation/multiplicative rules are excluded.",
  inputs: inputFields,
  outputs: [
    { id: "pairLagsMs", label: "Pair lags ms", kind: "numberList" },
    {
      id: "pairWeightChanges",
      label: "Pair weight changes",
      kind: "numberList",
    },
    { id: "summedWeightChange", label: "Summed weight change", kind: "number" },
  ],
  calculate: (value) =>
    calculate({
      presynapticTimesMs: value.presynapticTimesMs as readonly number[],
      postsynapticTimesMs: value.postsynapticTimesMs as readonly number[],
      potentiationAmplitude: value.potentiationAmplitude as number,
      depressionAmplitude: value.depressionAmplitude as number,
      potentiationTauMs: value.potentiationTauMs as number,
      depressionTauMs: value.depressionTauMs as number,
    }),
});
export const run = tool.execute;
export default tool;
