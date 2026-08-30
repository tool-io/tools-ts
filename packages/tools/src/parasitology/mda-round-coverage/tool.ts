import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import { count, fraction, aligned } from "../shared.js";

export type Input = Readonly<{
  readonly roundTreatedCounts: readonly number[];
  readonly roundEligibleCounts: readonly number[];
  readonly minimumCoverageFraction: number;
}>;
export type Output = Readonly<{
  readonly roundCoveragePercent: readonly number[];
  readonly roundsMeetingTarget: number;
  readonly pooledCoveragePercent: number;
}>;
export const calculate = (input: Input): Output => {
  aligned(
    input.roundTreatedCounts,
    input.roundEligibleCounts,
    "roundTreatedCounts",
  );
  fraction(input.minimumCoverageFraction, "minimumCoverageFraction");
  input.roundEligibleCounts.forEach((v, i) => {
    count(v, "roundEligibleCounts", 1);
    count(input.roundTreatedCounts[i], "roundTreatedCounts");
    if (input.roundTreatedCounts[i] > v)
      simpleError(
        "roundTreatedCounts",
        "Treated count cannot exceed eligible count.",
      );
  });
  const roundCoveragePercent = input.roundTreatedCounts.map(
    (v, i) => (100 * v) / input.roundEligibleCounts[i],
  );
  return {
    roundCoveragePercent,
    roundsMeetingTarget: roundCoveragePercent.filter(
      (v) => v >= 100 * input.minimumCoverageFraction,
    ).length,
    pooledCoveragePercent:
      (100 * input.roundTreatedCounts.reduce((a, b) => a + b, 0)) /
      input.roundEligibleCounts.reduce((a, b) => a + b, 0),
  };
};
export const exampleInput = {
  roundTreatedCounts: [80, 90],
  roundEligibleCounts: [100, 100],
  minimumCoverageFraction: 0.85,
} satisfies Input;
export const exampleOutput = {
  roundCoveragePercent: [80, 90],
  roundsMeetingTarget: 1,
  pooledCoveragePercent: 85,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "parasitology/mda-round-coverage",
  title: "MDA Round Coverage",
  description:
    "Summarize mass-treatment coverage over rounds and count rounds meeting a caller target.",
  inputs: [
    {
      id: "roundTreatedCounts",
      label: "Round treated counts",
      kind: "numberList",
    },
    {
      id: "roundEligibleCounts",
      label: "Round eligible counts",
      kind: "numberList",
    },
    {
      id: "minimumCoverageFraction",
      label: "Minimum coverage fraction",
      kind: "number",
    },
  ],
  outputs: [
    {
      id: "roundCoveragePercent",
      label: "Round coverage percent",
      kind: "numberList",
    },
    {
      id: "roundsMeetingTarget",
      label: "Rounds meeting target",
      kind: "number",
    },
    {
      id: "pooledCoveragePercent",
      label: "Pooled coverage percent",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      roundTreatedCounts: value.roundTreatedCounts as readonly number[],
      roundEligibleCounts: value.roundEligibleCounts as readonly number[],
      minimumCoverageFraction: value.minimumCoverageFraction as number,
    }),
});
export const run = tool.execute;
export default tool;
