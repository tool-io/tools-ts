import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  nonnegative,
  aligned,
  binary,
  mean,
} from "../batch41-shared.js";
export type Input = Readonly<{
  readonly observedWrittenFeedbackMinutes: readonly number[];
  readonly observedMatchedRichMediaFeedbackMinutes: readonly number[];
  readonly independentlyMatchedAssignmentFlags: readonly number[];
}>;
export type Output = Readonly<{
  readonly pairedRichMediaMinusWrittenMinutes: readonly number[];
  readonly knownMeanFeedbackTimeDifferenceMinutes: number;
}>;
const inputFields = [
  {
    id: "observedWrittenFeedbackMinutes",
    label: "Observed written feedback minutes",
    kind: "numberList",
  },
  {
    id: "observedMatchedRichMediaFeedbackMinutes",
    label: "Observed matched rich media feedback minutes",
    kind: "numberList",
  },
  {
    id: "independentlyMatchedAssignmentFlags",
    label: "Independently matched assignment flags",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.observedWrittenFeedbackMinutes.forEach((v) =>
    nonnegative(v, "observedWrittenFeedbackMinutes"),
  );
  input.observedMatchedRichMediaFeedbackMinutes.forEach((v) =>
    nonnegative(v, "observedMatchedRichMediaFeedbackMinutes"),
  );
  binary(
    input.independentlyMatchedAssignmentFlags,
    "independentlyMatchedAssignmentFlags",
  );
  aligned(
    input.observedWrittenFeedbackMinutes,
    input.observedMatchedRichMediaFeedbackMinutes,
    "observedWrittenFeedbackMinutes",
  );
  aligned(
    input.observedWrittenFeedbackMinutes,
    input.independentlyMatchedAssignmentFlags,
    "observedWrittenFeedbackMinutes",
  );
  const d = input.observedWrittenFeedbackMinutes.flatMap((v, i) =>
    input.independentlyMatchedAssignmentFlags[i]
      ? [input.observedMatchedRichMediaFeedbackMinutes[i] - v]
      : [],
  );
  return {
    pairedRichMediaMinusWrittenMinutes: d,
    knownMeanFeedbackTimeDifferenceMinutes: mean(d),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedWrittenFeedbackMinutes: [10, 20],
  observedMatchedRichMediaFeedbackMinutes: [5, 30],
  independentlyMatchedAssignmentFlags: [1, 1],
} satisfies Input;
export const exampleOutput = {
  pairedRichMediaMinusWrittenMinutes: [-5, 10],
  knownMeanFeedbackTimeDifferenceMinutes: 2.5,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "pedagogy/audio-video-feedback-rich-media-efficiency-lookup",
  title: "Audio Video Feedback Rich Media Efficiency Lookup",
  description:
    "Actual matched assignment feedback production time contrast, written to video/audio; not learning quality or universal efficiency. Caller independently verifies learner/context/evidence and reference edition; not causal learning efficacy, disability eligibility or educational certification.",
  inputs: inputFields,
  outputs: [
    {
      id: "pairedRichMediaMinusWrittenMinutes",
      label: "Paired rich media minus written minutes",
      kind: "numberList",
    },
    {
      id: "knownMeanFeedbackTimeDifferenceMinutes",
      label: "Known mean feedback time difference minutes",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      observedWrittenFeedbackMinutes:
        value.observedWrittenFeedbackMinutes as readonly number[],
      observedMatchedRichMediaFeedbackMinutes:
        value.observedMatchedRichMediaFeedbackMinutes as readonly number[],
      independentlyMatchedAssignmentFlags:
        value.independentlyMatchedAssignmentFlags as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
