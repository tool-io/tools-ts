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
  mean,
} from "../shared.js";
export type Input = Readonly<{
  readonly reactionTimesMs: readonly number[];
  readonly validCueFlags: readonly number[];
  readonly correctFlags: readonly number[];
  readonly minimumReactionTimeMs: number;
  readonly maximumReactionTimeMs: number;
}>;
export type Output = Readonly<{
  readonly validMeanMs: number;
  readonly invalidMeanMs: number;
  readonly cueingBenefitMs: number;
  readonly includedTrialIndexes: readonly number[];
}>;
const inputFields = [
  { id: "reactionTimesMs", label: "Reaction times ms", kind: "numberList" },
  { id: "validCueFlags", label: "Valid cue flags", kind: "numberList" },
  { id: "correctFlags", label: "Correct flags", kind: "numberList" },
  {
    id: "minimumReactionTimeMs",
    label: "Minimum reaction time ms",
    kind: "number",
  },
  {
    id: "maximumReactionTimeMs",
    label: "Maximum reaction time ms",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  aligned(input.reactionTimesMs, input.validCueFlags, "reactionTimesMs");
  aligned(input.reactionTimesMs, input.correctFlags, "reactionTimesMs");
  nonnegative(input.minimumReactionTimeMs, "minimumReactionTimeMs");
  if (input.maximumReactionTimeMs < input.minimumReactionTimeMs)
    simpleError(
      "maximumReactionTimeMs",
      "Ordered plausible RT bounds required.",
    );
  [input.validCueFlags, input.correctFlags].forEach((row) =>
    row.forEach((v) => {
      if (v !== 0 && v !== 1) simpleError("flags", "Binary flags required.");
    }),
  );
  input.reactionTimesMs.forEach((v) => nonnegative(v, "reactionTimesMs"));
  const includedTrialIndexes = input.reactionTimesMs.flatMap((v, i) =>
      input.correctFlags[i] &&
      v >= input.minimumReactionTimeMs &&
      v <= input.maximumReactionTimeMs
        ? [i]
        : [],
    ),
    validMeanMs = mean(
      includedTrialIndexes
        .filter((i) => input.validCueFlags[i] === 1)
        .map((i) => input.reactionTimesMs[i]),
    ),
    invalidMeanMs = mean(
      includedTrialIndexes
        .filter((i) => input.validCueFlags[i] === 0)
        .map((i) => input.reactionTimesMs[i]),
    );
  return {
    validMeanMs,
    invalidMeanMs,
    cueingBenefitMs: invalidMeanMs - validMeanMs,
    includedTrialIndexes,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  reactionTimesMs: [200, 250, 300, 400],
  validCueFlags: [1, 1, 0, 0],
  correctFlags: [1, 0, 1, 1],
  minimumReactionTimeMs: 100,
  maximumReactionTimeMs: 500,
} satisfies Input;
export const exampleOutput = {
  validMeanMs: 200,
  invalidMeanMs: 350,
  cueingBenefitMs: 150,
  includedTrialIndexes: [0, 2, 3],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "neuroscience/correct-trial-posner-cueing-effect",
  title: "Posner Cueing Effect",
  description:
    "Measure invalid-minus-valid Posner cueing benefit after correct-trial and caller-supplied RT-window exclusions; both conditions must remain observed.",
  inputs: inputFields,
  outputs: [
    { id: "validMeanMs", label: "Valid mean ms", kind: "number" },
    { id: "invalidMeanMs", label: "Invalid mean ms", kind: "number" },
    { id: "cueingBenefitMs", label: "Cueing benefit ms", kind: "number" },
    {
      id: "includedTrialIndexes",
      label: "Included trial indexes",
      kind: "numberList",
    },
  ],
  calculate: (value) =>
    calculate({
      reactionTimesMs: value.reactionTimesMs as readonly number[],
      validCueFlags: value.validCueFlags as readonly number[],
      correctFlags: value.correctFlags as readonly number[],
      minimumReactionTimeMs: value.minimumReactionTimeMs as number,
      maximumReactionTimeMs: value.maximumReactionTimeMs as number,
    }),
});
export const run = tool.execute;
export default tool;
