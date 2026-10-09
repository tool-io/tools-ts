import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly claimId: string;
  readonly reportedConfidence: number;
  readonly confidenceSource: string;
};
export type Output = { readonly label: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    claimId: { type: "string", maxLength: 8192, minLength: 1 },
    reportedConfidence: { type: "number", minimum: 0, maximum: 1 },
    confidenceSource: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["claimId", "reportedConfidence", "confidenceSource"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { label: { type: "string", maxLength: 8192 } },
  required: ["label"],
} as const;
/** Label an explicitly reported confidence fraction and source without estimating truth or warranted belief. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { claimId, reportedConfidence, confidenceSource } = request;
  const compute = (): Output => {
    H.domain(claimId.length > 0 && confidenceSource.length > 0, "claimId");
    (H.domain(
      reportedConfidence >= 0 && reportedConfidence <= 1,
      "reportedConfidence",
    ),
      reportedConfidence);
    return {
      label:
        claimId +
        "; reported confidence=" +
        reportedConfidence +
        " [" +
        confidenceSource +
        "]",
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    claimId: "C17",
    reportedConfidence: 0.7,
    confidenceSource: "Panel A",
  },
  output: { label: "C17; reported confidence=0.7 [Panel A]" },
} satisfies ToolExample<Input, Output>;
export const claimConfidenceSourceLabelTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: ["epistemology", "philosophy"],
      keywords: ["epistemology", "philosophy"],
    },
    id: "epistemology/claim-confidence-source-label",
    title: "Claim Confidence Source Label",
    description:
      "Label an explicitly reported confidence fraction and source without estimating truth or warranted belief.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        claimId: { type: "string", maxLength: 8192, minLength: 1 },
        reportedConfidence: { type: "number", minimum: 0, maximum: 1 },
        confidenceSource: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["claimId", "reportedConfidence", "confidenceSource"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { label: { type: "string", maxLength: 8192 } },
      required: ["label"],
    },
    ports: {
      inputs: [
        {
          id: "claimId",
          label: "Claim Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "reportedConfidence",
          label: "Reported Confidence",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "confidenceSource",
          label: "Confidence Source",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "label", label: "Label", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = claimConfidenceSourceLabelTool.execute;
export default claimConfidenceSourceLabelTool;
