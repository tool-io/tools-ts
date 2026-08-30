import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly ms1TimeMs: number;
  readonly ms2TimeMs: number;
  readonly topN: number;
  readonly maximumCycleMs: number;
}>;
export type Output = Readonly<{
  readonly cycleTimeMs: number;
  readonly remainingBudgetMs: number;
  readonly withinBudget: boolean;
}>;
export const calculate = (input: Input): Output => {
  if (
    input.ms1TimeMs < 0 ||
    input.ms2TimeMs < 0 ||
    !Number.isSafeInteger(input.topN) ||
    input.topN < 0 ||
    input.maximumCycleMs <= 0
  )
    simpleError("topN", "Nonnegative times and integer top-N required.");
  const cycleTimeMs = input.ms1TimeMs + input.ms2TimeMs * input.topN;
  return {
    cycleTimeMs,
    remainingBudgetMs: input.maximumCycleMs - cycleTimeMs,
    withinBudget: cycleTimeMs <= input.maximumCycleMs,
  };
};
export const exampleInput = {
  ms1TimeMs: 100,
  ms2TimeMs: 50,
  topN: 4,
  maximumCycleMs: 350,
} satisfies Input;
export const exampleOutput = {
  cycleTimeMs: 300,
  remainingBudgetMs: 50,
  withinBudget: true,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "metabolomics/dda-cycle-budget",
  title: "DDA Cycle Budget",
  description: "Calculate top-N DDA scan-cycle time and remaining budget.",
  inputs: [
    { id: "ms1TimeMs", kind: "number", label: "Ms 1 time ms" },
    { id: "ms2TimeMs", kind: "number", label: "Ms 2 time ms" },
    { id: "topN", kind: "number", label: "Top n" },
    { id: "maximumCycleMs", kind: "number", label: "Maximum cycle ms" },
  ],
  outputs: [
    { id: "cycleTimeMs", kind: "number", label: "Cycle time ms" },
    { id: "remainingBudgetMs", kind: "number", label: "Remaining budget ms" },
    { id: "withinBudget", kind: "boolean", label: "Within budget" },
  ],
  calculate: (value) =>
    calculate({
      ms1TimeMs: value.ms1TimeMs as number,
      ms2TimeMs: value.ms2TimeMs as number,
      topN: value.topN as number,
      maximumCycleMs: value.maximumCycleMs as number,
    }),
});
export const run = tool.execute;
export default tool;
