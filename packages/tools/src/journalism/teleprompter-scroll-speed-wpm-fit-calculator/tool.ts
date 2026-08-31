import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  nonnegative,
  positive,
} from "../batch-shared.js";
export type Input = Readonly<{
  readonly callerWordsPerRenderedLine: number;
  readonly renderedLinePitchPixels: number;
  readonly targetDeliveryWordsPerMinute: number;
  readonly observedScrollPixelsPerSecond: number;
}>;
export type Output = Readonly<{
  readonly requiredScrollPixelsPerSecond: number;
  readonly impliedObservedDeliveryWordsPerMinute: number;
  readonly signedObservedMinusRequiredScrollPixelsPerSecond: number;
}>;
const inputFields = [
  {
    id: "callerWordsPerRenderedLine",
    label: "Caller words per rendered line",
    kind: "number",
  },
  {
    id: "renderedLinePitchPixels",
    label: "Rendered line pitch pixels",
    kind: "number",
  },
  {
    id: "targetDeliveryWordsPerMinute",
    label: "Target delivery words per minute",
    kind: "number",
  },
  {
    id: "observedScrollPixelsPerSecond",
    label: "Observed scroll pixels per second",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.callerWordsPerRenderedLine, "callerWordsPerRenderedLine");
  positive(input.renderedLinePitchPixels, "renderedLinePitchPixels");
  positive(input.targetDeliveryWordsPerMinute, "targetDeliveryWordsPerMinute");
  nonnegative(
    input.observedScrollPixelsPerSecond,
    "observedScrollPixelsPerSecond",
  );
  const needed =
    ((input.targetDeliveryWordsPerMinute / input.callerWordsPerRenderedLine) *
      input.renderedLinePitchPixels) /
    60;
  return {
    requiredScrollPixelsPerSecond: needed,
    impliedObservedDeliveryWordsPerMinute:
      (input.observedScrollPixelsPerSecond / input.renderedLinePitchPixels) *
      input.callerWordsPerRenderedLine *
      60,
    signedObservedMinusRequiredScrollPixelsPerSecond:
      input.observedScrollPixelsPerSecond - needed,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerWordsPerRenderedLine: 6,
  renderedLinePitchPixels: 30,
  targetDeliveryWordsPerMinute: 120,
  observedScrollPixelsPerSecond: 8,
} satisfies Input;
export const exampleOutput = {
  requiredScrollPixelsPerSecond: 10,
  impliedObservedDeliveryWordsPerMinute: 96,
  signedObservedMinusRequiredScrollPixelsPerSecond: -2,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "journalism/teleprompter-scroll-speed-wpm-fit-calculator",
  title: "Teleprompter Scroll Speed Wpm Fit Calculator",
  description:
    "Calibrate actual teleprompter pixel scroll against caller measured words/line and line pitch with signed observed mismatch; not a text reading-time alias, speech fluency measure or renderer wrapping prediction.",
  inputs: inputFields,
  outputs: [
    {
      id: "requiredScrollPixelsPerSecond",
      label: "Required scroll pixels per second",
      kind: "number",
    },
    {
      id: "impliedObservedDeliveryWordsPerMinute",
      label: "Implied observed delivery words per minute",
      kind: "number",
    },
    {
      id: "signedObservedMinusRequiredScrollPixelsPerSecond",
      label: "Signed observed minus required scroll pixels per second",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      callerWordsPerRenderedLine: value.callerWordsPerRenderedLine as number,
      renderedLinePitchPixels: value.renderedLinePitchPixels as number,
      targetDeliveryWordsPerMinute:
        value.targetDeliveryWordsPerMinute as number,
      observedScrollPixelsPerSecond:
        value.observedScrollPixelsPerSecond as number,
    }),
});
export const run = tool.execute;
export default tool;
