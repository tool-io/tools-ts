import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type EvidenceQuadrantInput = {
  readonly assessments: ReadonlyArray<ReadonlyArray<number>>;
};

export type EvidenceQuadrantOutput = {
  readonly highEvidenceCount: number;
  readonly lowEvidenceCount: number;
  readonly lowEvidenceIndices: ReadonlyArray<number>;
  readonly mixedEvidenceCount: number;
};

export const classifyEvidenceQuadrants = (
  input: EvidenceQuadrantInput,
): EvidenceQuadrantOutput => {
  if (!Array.isArray(input.assessments))
    simpleError(
      "assessments",
      "Evidence assessments must be an array.",
      "assessments_required",
    );
  const rows = input.assessments;
  let highEvidenceCount = 0;
  let mixedEvidenceCount = 0;
  let lowEvidenceCount = 0;
  const lowEvidenceIndices: number[] = [];
  for (const [index, row] of rows.entries()) {
    if (!Array.isArray(row) || row.length !== 2)
      simpleError(
        `assessments.${index}`,
        "Each row must contain reliability and relevance ratings.",
        "invalid_assessment_row",
      );
    for (const [column, value] of row.entries())
      if (!Number.isSafeInteger(value) || value < 1 || value > 5)
        simpleError(
          `assessments.${index}.${column}`,
          "Reliability and relevance ratings must be whole numbers from 1 through 5.",
          "invalid_evidence_rating",
        );
    const combined = row[0]! + row[1]!;
    if (combined >= 8) highEvidenceCount += 1;
    else if (combined >= 5) mixedEvidenceCount += 1;
    else {
      lowEvidenceCount += 1;
      lowEvidenceIndices.push(index);
    }
  }
  return {
    highEvidenceCount,
    lowEvidenceCount,
    lowEvidenceIndices,
    mixedEvidenceCount,
  };
};

export const evidenceQuadrantExample = {
  input: {
    assessments: [
      [5, 5],
      [4, 3],
      [2, 2],
    ],
  },
  output: {
    highEvidenceCount: 1,
    lowEvidenceCount: 1,
    lowEvidenceIndices: [2],
    mixedEvidenceCount: 1,
  },
} satisfies ToolExample<EvidenceQuadrantInput, EvidenceQuadrantOutput>;

export const evidenceQuadrantTool = createSimpleTool({
  calculate: (input) =>
    classifyEvidenceQuadrants({ assessments: input.assessments as number[][] }),
  description:
    "Classify supplied one-to-five reliability and relevance ratings into high, mixed, and low evidence quadrants and retain indices of low evidence.",
  id: "auditing/evidence-relevance-reliability-two-axis-lookup",
  inputs: [
    {
      description:
        "Rows ordered as reliability and relevance ratings from 1 through 5.",
      id: "assessments",
      kind: "matrix",
      label: "Evidence assessments",
    },
  ],
  outputs: [
    {
      id: "highEvidenceCount",
      kind: "integer",
      label: "High evidence count",
      minimum: 0,
    },
    {
      id: "lowEvidenceCount",
      kind: "integer",
      label: "Low evidence count",
      minimum: 0,
    },
    {
      id: "lowEvidenceIndices",
      kind: "numberList",
      label: "Low evidence indices",
    },
    {
      id: "mixedEvidenceCount",
      kind: "integer",
      label: "Mixed evidence count",
      minimum: 0,
    },
  ],
  title: "Evidence Relevance Reliability Two-Axis Lookup",
});

export const runEvidenceQuadrant = evidenceQuadrantTool.execute;
export default evidenceQuadrantTool;
