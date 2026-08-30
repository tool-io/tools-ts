import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import { nonnegative, count, aligned, ordered } from "../shared.js";

export type Input = Readonly<{
  readonly testDays: readonly number[];
  readonly negativeFlags: readonly number[];
  readonly earliestEligibleDay: number;
  readonly requiredConsecutiveNegatives: number;
}>;
export type Output = Readonly<{
  readonly firstEligibleReleaseDay: number;
  readonly criterionMet: boolean;
}>;
export const calculate = (input: Input): Output => {
  aligned(input.testDays, input.negativeFlags, "testDays");
  ordered(input.testDays, "testDays");
  nonnegative(input.earliestEligibleDay, "earliestEligibleDay");
  count(input.requiredConsecutiveNegatives, "requiredConsecutiveNegatives", 1);
  input.testDays.forEach((v) => nonnegative(v, "testDays"));
  if (input.negativeFlags.some((v) => v !== 0 && v !== 1))
    simpleError("negativeFlags", "Binary negative-result flags required.");
  let run = 0,
    firstEligibleReleaseDay = -1;
  for (let i = 0; i < input.testDays.length; i++) {
    run =
      input.testDays[i] >= input.earliestEligibleDay &&
      input.negativeFlags[i] === 1
        ? run + 1
        : 0;
    if (run >= input.requiredConsecutiveNegatives) {
      firstEligibleReleaseDay = input.testDays[i];
      break;
    }
  }
  return {
    firstEligibleReleaseDay,
    criterionMet: firstEligibleReleaseDay >= 0,
  };
};
export const exampleInput = {
  testDays: [2, 4, 6, 8],
  negativeFlags: [0, 1, 1, 1],
  earliestEligibleDay: 4,
  requiredConsecutiveNegatives: 2,
} satisfies Input;
export const exampleOutput = {
  firstEligibleReleaseDay: 6,
  criterionMet: true,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "virology/test-based-isolation-release",
  title: "Test Based Isolation Release",
  description:
    "Find the first day meeting a caller-defined consecutive-negative test policy; not a recommendation to end isolation.",
  inputs: [
    { id: "testDays", label: "Test days", kind: "numberList" },
    { id: "negativeFlags", label: "Negative flags", kind: "numberList" },
    {
      id: "earliestEligibleDay",
      label: "Earliest eligible day",
      kind: "number",
      minimum: 0,
    },
    {
      id: "requiredConsecutiveNegatives",
      label: "Required consecutive negatives",
      kind: "integer",
      minimum: 1,
    },
  ],
  outputs: [
    {
      id: "firstEligibleReleaseDay",
      label: "First eligible release day",
      kind: "number",
    },
    { id: "criterionMet", label: "Criterion met", kind: "boolean" },
  ],
  calculate: (value) =>
    calculate({
      testDays: value.testDays as readonly number[],
      negativeFlags: value.negativeFlags as readonly number[],
      earliestEligibleDay: value.earliestEligibleDay as number,
      requiredConsecutiveNegatives:
        value.requiredConsecutiveNegatives as number,
    }),
});
export const run = tool.execute;
export default tool;
