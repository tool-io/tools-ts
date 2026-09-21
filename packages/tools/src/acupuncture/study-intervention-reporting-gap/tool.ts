import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly requiredDetails: readonly string[];
  readonly reportedDetails: readonly string[];
};
export type Output = {
  readonly missingCount: number;
  readonly missingDetails: readonly string[];
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    requiredDetails: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    reportedDetails: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
  },
  required: ["requiredDetails", "reportedDetails"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    missingCount: { type: "integer" },
    missingDetails: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
  },
  required: ["missingCount", "missingDetails"],
} as const;
/** Audit explicit research-report detail requirements without interpreting treatment efficacy. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { requiredDetails, reportedDetails } = request;
  const compute = (): Output => {
    return {
      missingCount: new Set(
        requiredDetails.filter((x) => !reportedDetails.includes(x)),
      ).size,
      missingDetails: [
        ...new Set(requiredDetails.filter((x) => !reportedDetails.includes(x))),
      ],
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    requiredDetails: ["timing", "comparator"],
    reportedDetails: ["timing"],
  },
  output: { missingCount: 1, missingDetails: ["comparator"] },
} satisfies ToolExample<Input, Output>;
export const studyInterventionReportingGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "acupuncture/study-intervention-reporting-gap",
    title: "Study Intervention Reporting Gap Tool",
    description:
      "Audit explicit research-report detail requirements without interpreting treatment efficacy.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        requiredDetails: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
        reportedDetails: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
      },
      required: ["requiredDetails", "reportedDetails"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        missingCount: { type: "integer" },
        missingDetails: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
      },
      required: ["missingCount", "missingDetails"],
    },
    ports: {
      inputs: [
        {
          id: "requiredDetails",
          label: "Required Details",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
        {
          id: "reportedDetails",
          label: "Reported Details",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
      ],
      outputs: [
        {
          id: "missingCount",
          label: "Missing Count",
          valueType: { type: "integer" },
        },
        {
          id: "missingDetails",
          label: "Missing Details",
          valueType: { type: "list", items: { type: "string" } },
        },
      ],
    },
  },
  calculate,
});
export const run = studyInterventionReportingGapTool.execute;
export default studyInterventionReportingGapTool;
