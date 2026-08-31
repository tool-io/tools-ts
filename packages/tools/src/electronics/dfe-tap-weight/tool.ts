import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import { validateInput, finish, positive } from "../batch32-shared.js";
export type Input = Readonly<{
  readonly observedMainCursor: number;
  readonly observedPostcursors: readonly number[];
  readonly callerMaximumAbsoluteTapWeight: number;
}>;
export type Output = Readonly<{
  readonly idealDecisionFeedbackTapWeights: readonly number[];
  readonly tapIndicesBeyondCallerLimit: readonly number[];
}>;
const inputFields = [
  { id: "observedMainCursor", label: "Observed main cursor", kind: "number" },
  {
    id: "observedPostcursors",
    label: "Observed postcursors",
    kind: "numberList",
  },
  {
    id: "callerMaximumAbsoluteTapWeight",
    label: "Caller maximum absolute tap weight",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(
    input.callerMaximumAbsoluteTapWeight,
    "callerMaximumAbsoluteTapWeight",
  );
  if (
    input.observedMainCursor === 0 ||
    !input.observedPostcursors.length ||
    input.observedPostcursors.length > 128
  )
    simpleError(
      "cursor",
      "Nonzero signed main cursor and 1–128 postcursors required.",
    );
  const taps = input.observedPostcursors.map(
    (v) => -v / input.observedMainCursor,
  );
  return {
    idealDecisionFeedbackTapWeights: taps,
    tapIndicesBeyondCallerLimit: taps.flatMap((v, i) =>
      Math.abs(v) > input.callerMaximumAbsoluteTapWeight ? [i] : [],
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedMainCursor: 2,
  observedPostcursors: [0.5, -0.2],
  callerMaximumAbsoluteTapWeight: 0.5,
} satisfies Input;
export const exampleOutput = {
  idealDecisionFeedbackTapWeights: [-0.25, 0.1],
  tapIndicesBeyondCallerLimit: [],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "electronics/dfe-tap-weight",
  title: "Dfe Tap Weight Calculator",
  description:
    "Derive ideal additive DFE cancellation tap weights from measured main/postcursors under caller weight bound; assumes correct past decisions and excludes error propagation, tap quantization or adaptation.",
  inputs: inputFields,
  outputs: [
    {
      id: "idealDecisionFeedbackTapWeights",
      label: "Ideal decision feedback tap weights",
      kind: "numberList",
    },
    {
      id: "tapIndicesBeyondCallerLimit",
      label: "Tap indices beyond caller limit",
      kind: "numberList",
    },
  ],
  calculate: (value) =>
    calculate({
      observedMainCursor: value.observedMainCursor as number,
      observedPostcursors: value.observedPostcursors as readonly number[],
      callerMaximumAbsoluteTapWeight:
        value.callerMaximumAbsoluteTapWeight as number,
    }),
});
export const run = tool.execute;
export default tool;
