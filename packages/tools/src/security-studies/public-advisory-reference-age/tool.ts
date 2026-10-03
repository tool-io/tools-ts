import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly publishedDate: string;
  readonly retrievedDate: string;
  readonly evaluationDate: string;
};
export type Output = {
  readonly publicationAgeDays: number;
  readonly retrievalAgeDays: number;
  readonly retrievalLagDays: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    publishedDate: { type: "string", maxLength: 8192 },
    retrievedDate: { type: "string", maxLength: 8192 },
    evaluationDate: { type: "string", maxLength: 8192 },
  },
  required: ["publishedDate", "retrievedDate", "evaluationDate"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    publicationAgeDays: { type: "integer" },
    retrievalAgeDays: { type: "integer" },
    retrievalLagDays: { type: "integer" },
  },
  required: ["publicationAgeDays", "retrievalAgeDays", "retrievalLagDays"],
} as const;
/** Inspect supplied public-advisory provenance dates without fetching alerts or inferring threat levels. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { publishedDate, retrievedDate, evaluationDate } = request;
  const compute = (): Output => {
    return (() => {
      const a = H.dateOnly(publishedDate).getTime(),
        b = H.dateOnly(retrievedDate).getTime(),
        c = H.dateOnly(evaluationDate).getTime();
      H.domain(a <= b && b <= c);
      return {
        publicationAgeDays: (c - a) / 86400000,
        retrievalAgeDays: (c - b) / 86400000,
        retrievalLagDays: (b - a) / 86400000,
      };
    })();
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    publishedDate: "2024-01-01",
    retrievedDate: "2024-01-03",
    evaluationDate: "2024-01-08",
  },
  output: { publicationAgeDays: 7, retrievalAgeDays: 5, retrievalLagDays: 2 },
} satisfies ToolExample<Input, Output>;
export const publicAdvisoryReferenceAgeTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "security-studies/public-advisory-reference-age",
    title: "Public Advisory Reference Age Tool",
    description:
      "Inspect supplied public-advisory provenance dates without fetching alerts or inferring threat levels.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        publishedDate: { type: "string", maxLength: 8192 },
        retrievedDate: { type: "string", maxLength: 8192 },
        evaluationDate: { type: "string", maxLength: 8192 },
      },
      required: ["publishedDate", "retrievedDate", "evaluationDate"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        publicationAgeDays: { type: "integer" },
        retrievalAgeDays: { type: "integer" },
        retrievalLagDays: { type: "integer" },
      },
      required: ["publicationAgeDays", "retrievalAgeDays", "retrievalLagDays"],
    },
    ports: {
      inputs: [
        {
          id: "publishedDate",
          label: "Published Date",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "retrievedDate",
          label: "Retrieved Date",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "evaluationDate",
          label: "Evaluation Date",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        {
          id: "publicationAgeDays",
          label: "Publication Age Days",
          valueType: { type: "integer" },
        },
        {
          id: "retrievalAgeDays",
          label: "Retrieval Age Days",
          valueType: { type: "integer" },
        },
        {
          id: "retrievalLagDays",
          label: "Retrieval Lag Days",
          valueType: { type: "integer" },
        },
      ],
    },
  },
  calculate,
});
export const run = publicAdvisoryReferenceAgeTool.execute;
export default publicAdvisoryReferenceAgeTool;
