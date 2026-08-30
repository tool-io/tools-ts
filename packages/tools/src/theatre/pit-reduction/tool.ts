import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly originalPlayerCount: number;
  readonly retainedPlayerCount: number;
  readonly originalPartCount: number;
  readonly coveredPartCount: number;
}>;
export type Output = Readonly<{
  readonly playerReductionPercent: number;
  readonly partCoveragePercent: number;
  readonly uncoveredPartCount: number;
  readonly allPartsCovered: boolean;
}>;

export const calculate = (input: Input): Output => {
  if (
    input.retainedPlayerCount > input.originalPlayerCount ||
    input.coveredPartCount > input.originalPartCount
  )
    simpleError(
      "retainedPlayerCount",
      "Retained players and covered parts cannot exceed originals.",
      "invalid_counts",
    );
  return {
    playerReductionPercent:
      ((input.originalPlayerCount - input.retainedPlayerCount) /
        input.originalPlayerCount) *
      100,
    partCoveragePercent:
      (input.coveredPartCount / input.originalPartCount) * 100,
    uncoveredPartCount: input.originalPartCount - input.coveredPartCount,
    allPartsCovered: input.coveredPartCount === input.originalPartCount,
  };
};

export const exampleInput = {
  originalPlayerCount: 20,
  retainedPlayerCount: 10,
  originalPartCount: 12,
  coveredPartCount: 12,
} satisfies Input;
export const exampleOutput = {
  playerReductionPercent: 50,
  partCoveragePercent: 100,
  uncoveredPartCount: 0,
  allPartsCovered: true,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  calculate: (input) =>
    calculate({
      originalPlayerCount: input.originalPlayerCount as number,
      retainedPlayerCount: input.retainedPlayerCount as number,
      originalPartCount: input.originalPartCount as number,
      coveredPartCount: input.coveredPartCount as number,
    }),
  description:
    "Measure pit-player reduction and retained orchestration-part coverage.",
  id: "theatre/pit-reduction",
  inputs: [
    {
      id: "originalPlayerCount",
      label: "Original orchestration players",
      kind: "integer",
      minimum: 1,
    },
    {
      id: "retainedPlayerCount",
      label: "Retained pit players",
      kind: "integer",
      minimum: 0,
    },
    {
      id: "originalPartCount",
      label: "Original distinct parts",
      kind: "integer",
      minimum: 1,
    },
    {
      id: "coveredPartCount",
      label: "Covered distinct parts",
      kind: "integer",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "playerReductionPercent",
      label: "Player reduction",
      kind: "number",
      minimum: 0,
      unit: "%",
    },
    {
      id: "partCoveragePercent",
      label: "Part coverage",
      kind: "number",
      minimum: 0,
      unit: "%",
    },
    {
      id: "uncoveredPartCount",
      label: "Uncovered part count",
      kind: "integer",
      minimum: 0,
    },
    { id: "allPartsCovered", label: "All parts covered", kind: "boolean" },
  ],
  title: "Pit Reduction",
});

export const run = tool.execute;
export default tool;
