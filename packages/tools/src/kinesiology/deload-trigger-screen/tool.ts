import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly recoveryScore: number;
  readonly minimumRecoveryScore: number;
  readonly recentLoad: number;
  readonly maximumLoad: number;
}>;
export type Output = Readonly<{
  readonly triggerCount: number;
  readonly deloadSuggested: boolean;
}>;
export const calculate = (input: Input): Output => {
  if (
    input.minimumRecoveryScore < 0 ||
    input.maximumLoad < 0 ||
    input.recoveryScore < 0 ||
    input.recentLoad < 0
  )
    simpleError(
      "recentLoad",
      "Nonnegative recovery scores and training loads required.",
    );
  const triggerCount =
    Number(input.recoveryScore < input.minimumRecoveryScore) +
    Number(input.recentLoad > input.maximumLoad);
  return { triggerCount, deloadSuggested: triggerCount > 0 };
};
export const exampleInput = {
  recoveryScore: 3,
  minimumRecoveryScore: 5,
  recentLoad: 120,
  maximumLoad: 100,
} satisfies Input;
export const exampleOutput = {
  triggerCount: 2,
  deloadSuggested: true,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "kinesiology/deload-trigger-screen",
  title: "Deload Trigger Screen",
  description:
    "Flag caller-defined recovery or load conditions for a deload discussion.",
  inputs: [
    { id: "recoveryScore", label: "Recovery score", kind: "number" },
    {
      id: "minimumRecoveryScore",
      label: "Minimum recovery score",
      kind: "number",
    },
    { id: "recentLoad", label: "Recent load", kind: "number" },
    { id: "maximumLoad", label: "Maximum load", kind: "number" },
  ],
  outputs: [
    { id: "triggerCount", label: "Trigger count", kind: "number" },
    { id: "deloadSuggested", label: "Deload suggested", kind: "boolean" },
  ],
  calculate: (value) =>
    calculate({
      recoveryScore: value.recoveryScore as number,
      minimumRecoveryScore: value.minimumRecoveryScore as number,
      recentLoad: value.recentLoad as number,
      maximumLoad: value.maximumLoad as number,
    }),
});
export const run = tool.execute;
export default tool;
