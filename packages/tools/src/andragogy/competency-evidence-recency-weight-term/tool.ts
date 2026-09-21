import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly ageDays: number;
  readonly halfLifeDays: number;
  readonly evidenceScore: number;
};
export type Output = {
  readonly weight: number;
  readonly weightedScore: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    ageDays: { type: "number", minimum: 0 },
    halfLifeDays: { type: "number", exclusiveMinimum: 0 },
    evidenceScore: { type: "number" },
  },
  required: ["ageDays", "halfLifeDays", "evidenceScore"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { weight: { type: "number" }, weightedScore: { type: "number" } },
  required: ["weight", "weightedScore"],
} as const;
/** Caller-selected exponential half-life weighting, not an evidence-validity or competence determination. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { ageDays, halfLifeDays, evidenceScore } = request;
  const compute = (): Output => {
    H.domain(ageDays >= 0);
    H.positive(halfLifeDays);
    return {
      weight: 2 ** (-ageDays / halfLifeDays),
      weightedScore: evidenceScore * 2 ** (-ageDays / halfLifeDays),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { ageDays: 30, halfLifeDays: 30, evidenceScore: 80 },
  output: { weight: 0.5, weightedScore: 40 },
} satisfies ToolExample<Input, Output>;
export const competencyEvidenceRecencyWeightTermTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "andragogy/competency-evidence-recency-weight-term",
      title: "Competency Evidence Recency Weight Term Tool",
      description:
        "Caller-selected exponential half-life weighting, not an evidence-validity or competence determination.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          ageDays: { type: "number", minimum: 0 },
          halfLifeDays: { type: "number", exclusiveMinimum: 0 },
          evidenceScore: { type: "number" },
        },
        required: ["ageDays", "halfLifeDays", "evidenceScore"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          weight: { type: "number" },
          weightedScore: { type: "number" },
        },
        required: ["weight", "weightedScore"],
      },
      ports: {
        inputs: [
          {
            id: "ageDays",
            label: "Age Days",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "halfLifeDays",
            label: "Half Life Days",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "evidenceScore",
            label: "Evidence Score",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          { id: "weight", label: "Weight", valueType: { type: "number" } },
          {
            id: "weightedScore",
            label: "Weighted Score",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = competencyEvidenceRecencyWeightTermTool.execute;
export default competencyEvidenceRecencyWeightTermTool;
