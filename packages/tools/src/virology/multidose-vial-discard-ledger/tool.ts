import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import { positive, nonnegative, count, aligned } from "../shared.js";

export type Input = Readonly<{
  readonly vialIds: readonly string[];
  readonly openedDays: readonly number[];
  readonly initialDoses: readonly number[];
  readonly usedDoses: readonly number[];
  readonly discardAfterDays: number;
  readonly evaluationDay: number;
}>;
export type Output = Readonly<{
  readonly usableDoses: readonly number[];
  readonly discardedRemainingDoses: readonly number[];
  readonly totalUsableDoses: number;
}>;
export const calculate = (input: Input): Output => {
  aligned(input.vialIds, input.openedDays, "vialIds");
  aligned(input.vialIds, input.initialDoses, "vialIds");
  aligned(input.vialIds, input.usedDoses, "vialIds");
  positive(input.discardAfterDays, "discardAfterDays");
  nonnegative(input.evaluationDay, "evaluationDay");
  if (new Set(input.vialIds).size !== input.vialIds.length)
    simpleError("vialIds", "Distinct vial records required.");
  input.initialDoses.forEach((v, i) => {
    count(v, "initialDoses");
    count(input.usedDoses[i], "usedDoses");
    nonnegative(input.openedDays[i], "openedDays");
    if (input.usedDoses[i] > v || input.openedDays[i] > input.evaluationDay)
      simpleError(
        "usedDoses",
        "Dose counts and opening days must fit the evaluated ledger.",
      );
  });
  const usableDoses = input.initialDoses.map((v, i) =>
      input.evaluationDay - input.openedDays[i] < input.discardAfterDays
        ? v - input.usedDoses[i]
        : 0,
    ),
    discardedRemainingDoses = input.initialDoses.map((v, i) =>
      input.evaluationDay - input.openedDays[i] >= input.discardAfterDays
        ? v - input.usedDoses[i]
        : 0,
    );
  return {
    usableDoses,
    discardedRemainingDoses,
    totalUsableDoses: usableDoses.reduce((a, b) => a + b, 0),
  };
};
export const exampleInput = {
  vialIds: ["A", "B"],
  openedDays: [0, 2],
  initialDoses: [10, 10],
  usedDoses: [3, 2],
  discardAfterDays: 3,
  evaluationDay: 4,
} satisfies Input;
export const exampleOutput = {
  usableDoses: [0, 8],
  discardedRemainingDoses: [7, 0],
  totalUsableDoses: 8,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "virology/multidose-vial-discard-ledger",
  title: "Multidose Vial Discard Ledger",
  description:
    "Audit remaining vial doses against a caller-provided post-opening discard interval; other storage requirements are not inferred.",
  inputs: [
    { id: "vialIds", label: "Vial ids", kind: "stringList" },
    { id: "openedDays", label: "Opened days", kind: "numberList" },
    { id: "initialDoses", label: "Initial doses", kind: "numberList" },
    { id: "usedDoses", label: "Used doses", kind: "numberList" },
    { id: "discardAfterDays", label: "Discard after days", kind: "number" },
    {
      id: "evaluationDay",
      label: "Evaluation day",
      kind: "number",
      minimum: 0,
    },
  ],
  outputs: [
    { id: "usableDoses", label: "Usable doses", kind: "numberList" },
    {
      id: "discardedRemainingDoses",
      label: "Discarded remaining doses",
      kind: "numberList",
    },
    { id: "totalUsableDoses", label: "Total usable doses", kind: "number" },
  ],
  calculate: (value) =>
    calculate({
      vialIds: value.vialIds as readonly string[],
      openedDays: value.openedDays as readonly number[],
      initialDoses: value.initialDoses as readonly number[],
      usedDoses: value.usedDoses as readonly number[],
      discardAfterDays: value.discardAfterDays as number,
      evaluationDay: value.evaluationDay as number,
    }),
});
export const run = tool.execute;
export default tool;
