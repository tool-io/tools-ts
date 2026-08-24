import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type MobilityTransitionProbabilityTableInput = {
  readonly countsMatrix: ReadonlyArray<readonly number[]>;
};

export type MobilityTransitionProbabilityTableOutput = {
  readonly transitionMatrix: ReadonlyArray<readonly number[]>;
};

export const mobilityTransitionProbabilityTableExample = {
  input: {
    countsMatrix: [
      [90, 10],
      [40, 60],
    ],
  },
  output: {
    transitionMatrix: [
      [0.9, 0.1],
      [0.4, 0.6],
    ],
  },
} satisfies ToolExample<
  MobilityTransitionProbabilityTableInput,
  MobilityTransitionProbabilityTableOutput
>;

export const calculateMobilityTransitionTable = (
  input: MobilityTransitionProbabilityTableInput,
): MobilityTransitionProbabilityTableOutput => {
  if (
    input.countsMatrix.length === 0 ||
    input.countsMatrix.some((row) => row.length === 0) ||
    input.countsMatrix.some(
      (row) => row.length !== input.countsMatrix[0].length,
    )
  )
    simpleError(
      "countsMatrix",
      "The count table must be a nonempty rectangular matrix.",
      "invalid_shape",
    );
  const matrix = input.countsMatrix.map((row) => {
    if (row.some((value) => !Number.isFinite(value) || value < 0))
      simpleError(
        "countsMatrix",
        "Transition counts must be finite nonnegative numbers.",
        "invalid_value",
      );
    const directRowTotal = row.reduce((sum, value) => sum + value, 0);
    if (directRowTotal === 0)
      simpleError(
        "countsMatrix",
        "Every origin row must contain at least one case.",
        "invalid_value",
      );
    if (Number.isFinite(directRowTotal))
      return row.map((value) => value / directRowTotal);
    const rowScale = Math.max(...row);
    const scaledRowTotal = row.reduce(
      (sum, value) => sum + value / rowScale,
      0,
    );
    return row.map((value) => value / rowScale / scaledRowTotal);
  });
  return { transitionMatrix: matrix };
};

export const mobilityTransitionProbabilityTableTool = createSimpleTool({
  calculate: (input) =>
    calculateMobilityTransitionTable({
      countsMatrix: input.countsMatrix as ReadonlyArray<readonly number[]>,
    }),
  description:
    "Row-normalize an origin-by-destination flow count table into mobility transition probabilities.",
  id: "sociology/mobility-transition-probability-table",
  inputs: [
    {
      description: "Counts with origins as rows and destinations as columns.",
      id: "countsMatrix",
      kind: "matrix",
      label: "Flow counts",
    },
  ],
  outputs: [
    {
      description: "Each row scaled to sum to one.",
      id: "transitionMatrix",
      kind: "matrix",
      label: "Transition probabilities",
    },
  ],
  title: "Mobility Transition Probability Table Tool",
});
export const runMobilityTransitionProbabilityTable =
  mobilityTransitionProbabilityTableTool.execute;
export default mobilityTransitionProbabilityTableTool;
