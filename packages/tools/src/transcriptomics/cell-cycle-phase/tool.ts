import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly g2mMarkerScores: readonly number[];
  readonly sPhaseMarkerScores: readonly number[];
  readonly minimumPhaseMargin: number;
}>;
export type Output = Readonly<{
  readonly g2mMean: number;
  readonly sMean: number;
  readonly phase: string;
}>;

export const calculate = (input: Input): Output => {
  if (
    input.g2mMarkerScores.length === 0 ||
    input.sPhaseMarkerScores.length === 0 ||
    input.minimumPhaseMargin < 0
  )
    simpleError(
      "g2mMarkerScores",
      "Nonempty phase scores and a nonnegative margin are required.",
    );
  const g2mMean =
      input.g2mMarkerScores.reduce((a, b) => a + b, 0) /
      input.g2mMarkerScores.length,
    sMean =
      input.sPhaseMarkerScores.reduce((a, b) => a + b, 0) /
      input.sPhaseMarkerScores.length;
  return {
    g2mMean,
    sMean,
    phase:
      g2mMean - sMean >= input.minimumPhaseMargin
        ? "G2M"
        : sMean - g2mMean >= input.minimumPhaseMargin
          ? "S"
          : "undetermined",
  };
};

export const exampleInput = {
  g2mMarkerScores: [2, 4],
  sPhaseMarkerScores: [1, 1],
  minimumPhaseMargin: 1,
} satisfies Input;
export const exampleOutput = {
  g2mMean: 3,
  sMean: 1,
  phase: "G2M",
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  id: "transcriptomics/cell-cycle-phase",
  title: "Cell Cycle Phase",
  description:
    "Classify a cell-cycle phase from supplied G2M and S marker scores.",
  inputs: [
    { id: "g2mMarkerScores", kind: "numberList", label: "G 2 m marker scores" },
    {
      id: "sPhaseMarkerScores",
      kind: "numberList",
      label: "S phase marker scores",
    },
    {
      id: "minimumPhaseMargin",
      kind: "number",
      label: "Minimum phase margin",
    },
  ],
  outputs: [
    { id: "g2mMean", kind: "number", label: "G 2 m mean" },
    { id: "sMean", kind: "number", label: "S mean" },
    {
      id: "phase",
      kind: "string",
      label: "Phase",
      enum: ["G2M", "S", "undetermined"],
    },
  ],
  calculate: (value) =>
    calculate({
      g2mMarkerScores: value.g2mMarkerScores as readonly number[],
      sPhaseMarkerScores: value.sPhaseMarkerScores as readonly number[],
      minimumPhaseMargin: value.minimumPhaseMargin as number,
    }),
});
export const run = tool.execute;
export default tool;
