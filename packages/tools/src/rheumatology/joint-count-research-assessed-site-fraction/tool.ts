import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly planned: number;
  readonly assessed: number;
  readonly positive: number;
  readonly unable: number;
};
export type Output = {
  readonly assessedShare: number;
  readonly positiveShare: number;
  readonly missing: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    planned: { type: "integer", minimum: 1 },
    assessed: { type: "integer", minimum: 1 },
    positive: { type: "integer", minimum: 0 },
    unable: { type: "integer", minimum: 0 },
  },
  required: ["planned", "assessed", "positive", "unable"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    assessedShare: { type: "number" },
    positiveShare: { type: "number" },
    missing: { type: "integer" },
  },
  required: ["assessedShare", "positiveShare", "missing"],
} as const;
/** Audit supplied research site counts with unable and missing sites separate. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { planned, assessed, positive, unable } = request;
  const compute = (): Output => {
    H.integer(planned, 1);
    H.integer(assessed, 1, planned);
    H.integer(positive, 0, assessed);
    H.integer(unable, 0, planned - assessed);
    return {
      assessedShare: assessed / planned,
      positiveShare: positive / assessed,
      missing: planned - assessed - unable,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { planned: 28, assessed: 24, positive: 6, unable: 2 },
  output: {
    assessedShare: 0.8571428571428571,
    positiveShare: 0.25,
    missing: 2,
  },
} satisfies ToolExample<Input, Output>;
export const jointCountResearchAssessedSiteFractionTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "rheumatology/joint-count-research-assessed-site-fraction",
      title: "Joint Count Research Assessed Site Fraction Tool",
      description:
        "Audit supplied research site counts with unable and missing sites separate.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          planned: { type: "integer", minimum: 1 },
          assessed: { type: "integer", minimum: 1 },
          positive: { type: "integer", minimum: 0 },
          unable: { type: "integer", minimum: 0 },
        },
        required: ["planned", "assessed", "positive", "unable"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          assessedShare: { type: "number" },
          positiveShare: { type: "number" },
          missing: { type: "integer" },
        },
        required: ["assessedShare", "positiveShare", "missing"],
      },
      ports: {
        inputs: [
          {
            id: "planned",
            label: "Planned",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "assessed",
            label: "Assessed",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "positive",
            label: "Positive",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "unable",
            label: "Unable",
            required: true,
            valueType: { type: "integer" },
          },
        ],
        outputs: [
          {
            id: "assessedShare",
            label: "Assessed Share",
            valueType: { type: "number" },
          },
          {
            id: "positiveShare",
            label: "Positive Share",
            valueType: { type: "number" },
          },
          { id: "missing", label: "Missing", valueType: { type: "integer" } },
        ],
      },
    },
    calculate,
  });
export const run = jointCountResearchAssessedSiteFractionTool.execute;
export default jointCountResearchAssessedSiteFractionTool;
