import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

const quadrants = [
  "knownKnowns",
  "knownUnknowns",
  "unknownKnowns",
  "unknownUnknowns",
] as const;
const normalizedQuadrants = quadrants.map((quadrant) => quadrant.toLowerCase());

export type CertaintyQuadrantInput = {
  readonly statementClassifications: ReadonlyArray<string>;
};

export type CertaintyQuadrantOutput = {
  readonly dominantQuadrant: (typeof quadrants)[number];
  readonly quadrantCounts: ReadonlyArray<number>;
  readonly totalStatementCount: number;
};

export const classifyRumsfeldCertaintyQuadrants = (
  input: CertaintyQuadrantInput,
): CertaintyQuadrantOutput => {
  if (
    !Array.isArray(input.statementClassifications) ||
    input.statementClassifications.length === 0
  )
    simpleError(
      "statementClassifications",
      "At least one statement classification is required.",
      "statement_classifications_required",
    );
  const counts = {
    knownKnowns: 0,
    knownUnknowns: 0,
    unknownKnowns: 0,
    unknownUnknowns: 0,
  };
  for (const [
    index,
    classification,
  ] of input.statementClassifications.entries()) {
    if (typeof classification !== "string")
      simpleError(
        `statementClassifications.${index}`,
        "Classifications must be knownKnowns, knownUnknowns, unknownKnowns, or unknownUnknowns.",
        "invalid_certainty_quadrant",
      );
    const normalizedClassification = classification.trim().toLowerCase();
    if (
      !normalizedQuadrants.includes(
        normalizedClassification as (typeof normalizedQuadrants)[number],
      )
    )
      simpleError(
        `statementClassifications.${index}`,
        "Classifications must be knownKnowns, knownUnknowns, unknownKnowns, or unknownUnknowns.",
        "invalid_certainty_quadrant",
      );
    const canonicalQuadrant = quadrants.find(
      (quadrant) => quadrant.toLowerCase() === normalizedClassification,
    )!;
    counts[canonicalQuadrant] += 1;
  }
  return {
    dominantQuadrant: quadrants.find(
      (quadrant) => counts[quadrant] === Math.max(...Object.values(counts)),
    )!,
    quadrantCounts: quadrants.map((quadrant) => counts[quadrant]),
    totalStatementCount: input.statementClassifications.length,
  };
};

export const certaintyQuadrantExample = {
  input: {
    statementClassifications: [
      "knownKnowns",
      "knownUnknowns",
      "knownKnowns",
      "unknownKnowns",
    ],
  },
  output: {
    dominantQuadrant: "knownKnowns",
    quadrantCounts: [2, 1, 1, 0],
    totalStatementCount: 4,
  },
} satisfies ToolExample<CertaintyQuadrantInput, CertaintyQuadrantOutput>;

export const certaintyQuadrantTool = createSimpleTool({
  calculate: (input) =>
    classifyRumsfeldCertaintyQuadrants({
      statementClassifications: input.statementClassifications as string[],
    }),
  description:
    "Count caller-coded statements across the four known-knowns and known-unknowns certainty quadrants.",
  id: "futurology/known-knowns-rumsfeld-certainty-quadrant",
  inputs: [
    {
      description:
        "One knownKnowns, knownUnknowns, unknownKnowns, or unknownUnknowns label per statement.",
      id: "statementClassifications",
      kind: "stringList",
      label: "Statement classifications",
    },
  ],
  outputs: [
    {
      enum: [...quadrants],
      id: "dominantQuadrant",
      kind: "string",
      label: "Dominant quadrant",
    },
    { id: "quadrantCounts", kind: "numberList", label: "Quadrant counts" },
    {
      id: "totalStatementCount",
      kind: "integer",
      label: "Statement count",
      minimum: 1,
    },
  ],
  title: "Known Knowns Rumsfeld Certainty Quadrant",
});

export const runCertaintyQuadrant = certaintyQuadrantTool.execute;
export default certaintyQuadrantTool;
