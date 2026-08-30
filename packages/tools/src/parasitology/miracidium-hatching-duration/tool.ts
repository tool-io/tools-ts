import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import { nonnegative } from "../shared.js";

export type Input = Readonly<{
  readonly exposureStartMinutes: number;
  readonly hatchingTimesMinutes: readonly number[];
}>;
export type Output = Readonly<{
  readonly hatchingDelaysMinutes: readonly number[];
  readonly medianDelayMinutes: number;
}>;
export const calculate = (input: Input): Output => {
  nonnegative(input.exposureStartMinutes, "exposureStartMinutes");
  if (
    !input.hatchingTimesMinutes.length ||
    input.hatchingTimesMinutes.some((v) => v < input.exposureStartMinutes)
  )
    simpleError(
      "hatchingTimesMinutes",
      "Observed hatching times must follow exposure start.",
    );
  const hatchingDelaysMinutes = input.hatchingTimesMinutes.map(
      (v) => v - input.exposureStartMinutes,
    ),
    sorted = [...hatchingDelaysMinutes].sort((a, b) => a - b),
    n = sorted.length;
  return {
    hatchingDelaysMinutes,
    medianDelayMinutes:
      n % 2 ? sorted[(n - 1) / 2] : (sorted[n / 2 - 1] + sorted[n / 2]) / 2,
  };
};
export const exampleInput = {
  exposureStartMinutes: 10,
  hatchingTimesMinutes: [15, 20, 30],
} satisfies Input;
export const exampleOutput = {
  hatchingDelaysMinutes: [5, 10, 20],
  medianDelayMinutes: 10,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "parasitology/miracidium-hatching-duration",
  title: "Miracidium Hatching Duration",
  description:
    "Summarize observed miracidium hatching delays after a supplied water-exposure start time.",
  inputs: [
    {
      id: "exposureStartMinutes",
      label: "Exposure start minutes",
      kind: "number",
    },
    {
      id: "hatchingTimesMinutes",
      label: "Hatching times minutes",
      kind: "numberList",
    },
  ],
  outputs: [
    {
      id: "hatchingDelaysMinutes",
      label: "Hatching delays minutes",
      kind: "numberList",
    },
    { id: "medianDelayMinutes", label: "Median delay minutes", kind: "number" },
  ],
  calculate: (value) =>
    calculate({
      exposureStartMinutes: value.exposureStartMinutes as number,
      hatchingTimesMinutes: value.hatchingTimesMinutes as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
