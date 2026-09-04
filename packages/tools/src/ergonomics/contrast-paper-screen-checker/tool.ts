import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
} from "../batch39-shared.js";
export type Input = Readonly<{
  readonly observedPaperLuminance: number;
  readonly observedScreenLuminance: number;
  readonly callerMaxAbsoluteLogRatio: number;
}>;
export type Output = Readonly<{
  readonly signedPaperScreenLogRatio: number;
  readonly callerContrastReview: boolean;
}>;
const inputFields = [
  {
    id: "observedPaperLuminance",
    label: "Observed paper luminance",
    kind: "number",
  },
  {
    id: "observedScreenLuminance",
    label: "Observed screen luminance",
    kind: "number",
  },
  {
    id: "callerMaxAbsoluteLogRatio",
    label: "Caller max absolute log ratio",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.observedPaperLuminance, "observedPaperLuminance");
  positive(input.observedScreenLuminance, "observedScreenLuminance");
  nonnegative(input.callerMaxAbsoluteLogRatio, "callerMaxAbsoluteLogRatio");
  const r = Math.log(
    input.observedPaperLuminance / input.observedScreenLuminance,
  );
  return {
    signedPaperScreenLogRatio: r,
    callerContrastReview: Math.abs(r) > input.callerMaxAbsoluteLogRatio,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedPaperLuminance: 100,
  observedScreenLuminance: 200,
  callerMaxAbsoluteLogRatio: 1,
} satisfies Input;
export const exampleOutput = {
  signedPaperScreenLogRatio: -0.6931471805599453,
  callerContrastReview: false,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "ergonomics/contrast-paper-screen-checker",
  title: "Contrast Ratio Paper-Screen Reading Comfort Checker",
  description:
    "Signed paper/screen luminance transition log-ratio against explicit caller comfort policy, not WCAG text contrast or glare diagnosis. Caller independently establishes matching units, evidence, method edition and applicability; output is not compliance, diagnosis, work-safety approval, geological identity or validated hazard prediction.",
  inputs: inputFields,
  outputs: [
    {
      id: "signedPaperScreenLogRatio",
      label: "Signed paper screen log ratio",
      kind: "number",
    },
    {
      id: "callerContrastReview",
      label: "Caller contrast review",
      kind: "boolean",
    },
  ],
  calculate: (value) =>
    calculate({
      observedPaperLuminance: value.observedPaperLuminance as number,
      observedScreenLuminance: value.observedScreenLuminance as number,
      callerMaxAbsoluteLogRatio: value.callerMaxAbsoluteLogRatio as number,
    }),
});
export const run = tool.execute;
export default tool;
