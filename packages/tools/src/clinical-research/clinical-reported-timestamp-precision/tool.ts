import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly recordId: string;
  readonly suppliedTimestampText: string;
  readonly precisionWording: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    recordId: { type: "string", maxLength: 8192, minLength: 1 },
    suppliedTimestampText: { type: "string", maxLength: 8192, minLength: 1 },
    precisionWording: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["recordId", "suppliedTimestampText", "precisionWording"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Preserve explicit timestamp text and reported precision without inventing missing date components. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { recordId, suppliedTimestampText, precisionWording } = request;
  const compute = (): Output => {
    H.domain(recordId.length > 0, "recordId");
    H.domain(suppliedTimestampText.length > 0, "suppliedTimestampText");
    H.domain(precisionWording.length > 0, "precisionWording");
    return {
      token: JSON.stringify([
        recordId,
        suppliedTimestampText,
        precisionWording,
      ]),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    recordId: "R17",
    suppliedTimestampText: "2026-11-01",
    precisionWording: "day",
  },
  output: { token: '["R17","2026-11-01","day"]' },
} satisfies ToolExample<Input, Output>;
export const clinicalReportedTimestampPrecisionTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: [
        "clinical-research",
        "clinical research",
        "research and quality management",
      ],
      keywords: ["clinical research", "research and quality management"],
    },
    id: "clinical-research/clinical-reported-timestamp-precision",
    title: "Clinical Reported Timestamp Precision",
    description:
      "Preserve explicit timestamp text and reported precision without inventing missing date components.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        recordId: { type: "string", maxLength: 8192, minLength: 1 },
        suppliedTimestampText: {
          type: "string",
          maxLength: 8192,
          minLength: 1,
        },
        precisionWording: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["recordId", "suppliedTimestampText", "precisionWording"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { token: { type: "string", maxLength: 8192 } },
      required: ["token"],
    },
    ports: {
      inputs: [
        {
          id: "recordId",
          label: "Record Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "suppliedTimestampText",
          label: "Supplied Timestamp Text",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "precisionWording",
          label: "Precision Wording",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "token", label: "Token", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = clinicalReportedTimestampPrecisionTool.execute;
export default clinicalReportedTimestampPrecisionTool;
