import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly lesionId: string;
  readonly reasonCode: string;
  readonly reasonSource: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    lesionId: { type: "string", maxLength: 8192, minLength: 1 },
    reasonCode: { type: "string", maxLength: 8192, minLength: 1 },
    reasonSource: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["lesionId", "reasonCode", "reasonSource"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Qualify an explicitly assigned missing-measurement reason without imputing lesion size or outcome. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { lesionId, reasonCode, reasonSource } = request;
  const compute = (): Output => {
    H.domain(lesionId.length > 0, "lesionId");
    H.domain(reasonCode.length > 0, "reasonCode");
    H.domain(reasonSource.length > 0, "reasonSource");
    return { token: JSON.stringify([lesionId, reasonCode, reasonSource]) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    lesionId: "L17",
    reasonCode: "NOT-VISIBLE",
    reasonSource: "Protocol A",
  },
  output: { token: '["L17","NOT-VISIBLE","Protocol A"]' },
} satisfies ToolExample<Input, Output>;
export const tumorMissingMeasurementReasonTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: ["oncology", "health and medicine"],
      keywords: ["oncology", "health and medicine"],
    },
    id: "oncology/tumor-missing-measurement-reason",
    title: "Tumor Missing Measurement Reason",
    description:
      "Qualify an explicitly assigned missing-measurement reason without imputing lesion size or outcome.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        lesionId: { type: "string", maxLength: 8192, minLength: 1 },
        reasonCode: { type: "string", maxLength: 8192, minLength: 1 },
        reasonSource: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["lesionId", "reasonCode", "reasonSource"],
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
          id: "lesionId",
          label: "Lesion Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "reasonCode",
          label: "Reason Code",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "reasonSource",
          label: "Reason Source",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "token", label: "Token", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = tumorMissingMeasurementReasonTool.execute;
export default tumorMissingMeasurementReasonTool;
