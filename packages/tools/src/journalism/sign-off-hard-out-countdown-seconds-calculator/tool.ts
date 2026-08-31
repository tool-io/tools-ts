import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  instant,
  nonnegative,
  sum,
} from "../batch-shared.js";
export type Input = Readonly<{
  readonly currentUtc: string;
  readonly hardOutUtc: string;
  readonly remainingSignOffComponentSeconds: readonly number[];
}>;
export type Output = Readonly<{
  readonly signedSecondsUntilHardOut: number;
  readonly estimatedRemainingSignOffSeconds: number;
  readonly signedHardOutSlackSeconds: number;
  readonly hardOutAlreadyPassed: boolean;
}>;
const inputFields = [
  { id: "currentUtc", label: "Current utc", kind: "string" },
  { id: "hardOutUtc", label: "Hard out utc", kind: "string" },
  {
    id: "remainingSignOffComponentSeconds",
    label: "Remaining sign off component seconds",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.remainingSignOffComponentSeconds.forEach((v) =>
    nonnegative(v, "remainingSignOffComponentSeconds"),
  );
  const time = (instant(input.hardOutUtc) - instant(input.currentUtc)) / 1000,
    remaining = sum(input.remainingSignOffComponentSeconds);
  return {
    signedSecondsUntilHardOut: time,
    estimatedRemainingSignOffSeconds: remaining,
    signedHardOutSlackSeconds: time - remaining,
    hardOutAlreadyPassed: time < 0,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  currentUtc: "2025-01-01T11:59:30Z",
  hardOutUtc: "2025-01-01T12:00:00Z",
  remainingSignOffComponentSeconds: [10, 15],
} satisfies Input;
export const exampleOutput = {
  signedSecondsUntilHardOut: 30,
  estimatedRemainingSignOffSeconds: 25,
  signedHardOutSlackSeconds: 5,
  hardOutAlreadyPassed: false,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "journalism/sign-off-hard-out-countdown-seconds-calculator",
  title: "Sign Off Hard Out Countdown Seconds Calculator",
  description:
    "Audit actual UTC hard-out countdown against caller remaining signoff estimates, preserving negative deadline/slack; not full package runtime, automatic transmission stop or live delivery guarantee.",
  inputs: inputFields,
  outputs: [
    {
      id: "signedSecondsUntilHardOut",
      label: "Signed seconds until hard out",
      kind: "number",
    },
    {
      id: "estimatedRemainingSignOffSeconds",
      label: "Estimated remaining sign off seconds",
      kind: "number",
    },
    {
      id: "signedHardOutSlackSeconds",
      label: "Signed hard out slack seconds",
      kind: "number",
    },
    {
      id: "hardOutAlreadyPassed",
      label: "Hard out already passed",
      kind: "boolean",
    },
  ],
  calculate: (value) =>
    calculate({
      currentUtc: value.currentUtc as string,
      hardOutUtc: value.hardOutUtc as string,
      remainingSignOffComponentSeconds:
        value.remainingSignOffComponentSeconds as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
