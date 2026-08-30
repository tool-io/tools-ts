import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly offTargetMismatchCounts: readonly number[];
  readonly maximumRiskMismatchCount: number;
}>;
export type Output = Readonly<{
  readonly offTargetCount: number;
  readonly highRiskOffTargetCount: number;
  readonly minimumMismatchCount: number;
  readonly highRiskOffTargetPresent: boolean;
}>;

export const calculate = (input: Input): Output => {
  if (
    input.offTargetMismatchCounts.length === 0 ||
    input.offTargetMismatchCounts.some(
      (value) => !Number.isSafeInteger(value) || value < 0,
    )
  )
    simpleError(
      "offTargetMismatchCounts",
      "Mismatch counts must be nonempty nonnegative integers.",
      "invalid_counts",
    );
  const highRiskOffTargetCount = input.offTargetMismatchCounts.filter(
    (value) => value <= input.maximumRiskMismatchCount,
  ).length;
  return {
    offTargetCount: input.offTargetMismatchCounts.length,
    highRiskOffTargetCount,
    minimumMismatchCount: Math.min(...input.offTargetMismatchCounts),
    highRiskOffTargetPresent: highRiskOffTargetCount > 0,
  };
};

export const exampleInput = {
  offTargetMismatchCounts: [1, 3, 5, 2],
  maximumRiskMismatchCount: 2,
} satisfies Input;
export const exampleOutput = {
  offTargetCount: 4,
  highRiskOffTargetCount: 2,
  minimumMismatchCount: 1,
  highRiskOffTargetPresent: true,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  calculate: (input) =>
    calculate({
      offTargetMismatchCounts:
        input.offTargetMismatchCounts as readonly number[],
      maximumRiskMismatchCount: input.maximumRiskMismatchCount as number,
    }),
  description:
    "Count CRISPR epigenome-editing off-targets by mismatch risk threshold.",
  id: "epigenetics/crispr-off-target-count",
  inputs: [
    {
      id: "offTargetMismatchCounts",
      label: "Off-target mismatch counts",
      kind: "numberList",
    },
    {
      id: "maximumRiskMismatchCount",
      label: "Maximum risky mismatch count",
      kind: "integer",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "offTargetCount",
      label: "Off-target count",
      kind: "integer",
      minimum: 0,
    },
    {
      id: "highRiskOffTargetCount",
      label: "High-risk off-target count",
      kind: "integer",
      minimum: 0,
    },
    {
      id: "minimumMismatchCount",
      label: "Minimum mismatch count",
      kind: "integer",
      minimum: 0,
    },
    {
      id: "highRiskOffTargetPresent",
      label: "High-risk off-target present",
      kind: "boolean",
    },
  ],
  title: "CRISPR Off-Target Count",
});

export const run = tool.execute;
export default tool;
