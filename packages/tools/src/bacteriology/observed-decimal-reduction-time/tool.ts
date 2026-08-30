import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import { positive } from "../shared.js";

export type Input = Readonly<{
  readonly initialViableCount: number;
  readonly finalViableCount: number;
  readonly elapsedMinutes: number;
}>;
export type Output = Readonly<{
  readonly observedLog10Reduction: number;
  readonly decimalReductionMinutes: number;
}>;
export const calculate = (input: Input): Output => {
  positive(input.initialViableCount, "initialViableCount");
  positive(input.finalViableCount, "finalViableCount");
  positive(input.elapsedMinutes, "elapsedMinutes");
  if (input.finalViableCount >= input.initialViableCount)
    simpleError(
      "finalViableCount",
      "Positive decreasing viable counts required; zero endpoints are censored, not logarithms.",
    );
  const observedLog10Reduction =
    Math.log10(input.initialViableCount) - Math.log10(input.finalViableCount);
  return {
    observedLog10Reduction,
    decimalReductionMinutes: input.elapsedMinutes / observedLog10Reduction,
  };
};
export const exampleInput = {
  initialViableCount: 100000,
  finalViableCount: 100,
  elapsedMinutes: 6,
} satisfies Input;
export const exampleOutput = {
  observedLog10Reduction: 3,
  decimalReductionMinutes: 2,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "bacteriology/observed-decimal-reduction-time",
  title: "Observed Decimal Reduction Time",
  description:
    "Estimate a measured D value from positive viable counts and exposure time under log-linear death assumptions.",
  inputs: [
    { id: "initialViableCount", label: "Initial viable count", kind: "number" },
    { id: "finalViableCount", label: "Final viable count", kind: "number" },
    { id: "elapsedMinutes", label: "Elapsed minutes", kind: "number" },
  ],
  outputs: [
    {
      id: "observedLog10Reduction",
      label: "Observed log 10 reduction",
      kind: "number",
    },
    {
      id: "decimalReductionMinutes",
      label: "Decimal reduction minutes",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      initialViableCount: value.initialViableCount as number,
      finalViableCount: value.finalViableCount as number,
      elapsedMinutes: value.elapsedMinutes as number,
    }),
});
export const run = tool.execute;
export default tool;
