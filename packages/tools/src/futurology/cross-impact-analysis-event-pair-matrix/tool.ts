import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type CrossImpactInput = {
  readonly eventIds: ReadonlyArray<string>;
  readonly impactScores: ReadonlyArray<ReadonlyArray<number>>;
};

export type CrossImpactOutput = {
  readonly reciprocalPairCount: number;
  readonly strongestPair: string;
  readonly strongestScore: number;
};

export const analyzeCrossImpactPairs = (
  input: CrossImpactInput,
): CrossImpactOutput => {
  if (!Array.isArray(input.eventIds) || input.eventIds.length < 2)
    simpleError(
      "eventIds",
      "At least two event IDs are required.",
      "event_ids_required",
    );
  const normalizedIds = input.eventIds.map((value, index) => {
    if (typeof value !== "string" || value.trim() === "")
      simpleError(
        `eventIds.${index}`,
        "Event IDs must be nonempty strings.",
        "invalid_event_id",
      );
    return value.trim();
  });
  if (new Set(normalizedIds).size !== normalizedIds.length)
    simpleError("eventIds", "Event IDs must be unique.", "duplicate_event_id");
  if (
    !Array.isArray(input.impactScores) ||
    input.impactScores.length !== normalizedIds.length
  )
    simpleError(
      "impactScores",
      "The score matrix must be square.",
      "invalid_impact_matrix",
    );
  let strongestScore = 0;
  let strongestPair = "";
  let reciprocalPairCount = 0;
  for (const [rowIndex, row] of input.impactScores.entries()) {
    if (!Array.isArray(row) || row.length !== normalizedIds.length)
      simpleError(
        `impactScores.${rowIndex}`,
        "The score matrix must be square.",
        "invalid_impact_matrix",
      );
    for (const [columnIndex, score] of row.entries()) {
      if (!Number.isFinite(score) || score < -1 || score > 1)
        simpleError(
          `impactScores.${rowIndex}.${columnIndex}`,
          "Scores must be from -1 through 1.",
          "invalid_impact_score",
        );
      if (rowIndex === columnIndex && score !== 0)
        simpleError(
          `impactScores.${rowIndex}.${columnIndex}`,
          "Diagonal scores must be zero.",
          "invalid_diagonal_score",
        );
      if (rowIndex !== columnIndex && score > strongestScore) {
        strongestScore = score;
        strongestPair = `${normalizedIds[rowIndex]} -> ${normalizedIds[columnIndex]}`;
      }
    }
  }
  for (let rowIndex = 0; rowIndex < normalizedIds.length; rowIndex += 1)
    for (
      let columnIndex = rowIndex + 1;
      columnIndex < normalizedIds.length;
      columnIndex += 1
    ) {
      const forward = input.impactScores[rowIndex]![columnIndex]!;
      const reverse = input.impactScores[columnIndex]![rowIndex]!;
      if (forward !== 0 && reverse !== 0) reciprocalPairCount += 1;
    }
  return { reciprocalPairCount, strongestPair, strongestScore };
};

export const crossImpactExample = {
  input: {
    eventIds: ["Policy", "Adoption", "Cost"],
    impactScores: [
      [0, 0.8, -0.2],
      [0.4, 0, 0.6],
      [0.1, 0.3, 0],
    ],
  },
  output: {
    reciprocalPairCount: 3,
    strongestPair: "Policy -> Adoption",
    strongestScore: 0.8,
  },
} satisfies ToolExample<CrossImpactInput, CrossImpactOutput>;

export const crossImpactTool = createSimpleTool({
  calculate: (input) =>
    analyzeCrossImpactPairs({
      eventIds: input.eventIds as string[],
      impactScores: input.impactScores as number[][],
    }),
  description:
    "Analyze a caller-supplied square event-impact matrix and report the strongest directed relationship and reciprocal-pair count.",
  id: "futurology/cross-impact-analysis-event-pair-matrix",
  inputs: [
    { id: "eventIds", kind: "stringList", label: "Event IDs" },
    {
      description:
        "Square directed-impact matrix with zero diagonal and scores from -1 through 1.",
      id: "impactScores",
      kind: "matrix",
      label: "Impact matrix",
    },
  ],
  outputs: [
    {
      id: "reciprocalPairCount",
      kind: "integer",
      label: "Reciprocal pairs",
      minimum: 0,
    },
    { id: "strongestPair", kind: "string", label: "Strongest directed pair" },
    {
      id: "strongestScore",
      kind: "number",
      label: "Strongest score",
      minimum: 0,
    },
  ],
  title: "Cross Impact Analysis Event Pair Matrix",
});

export const runCrossImpact = crossImpactTool.execute;
export default crossImpactTool;
