import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly recordedCode: string;
  readonly positiveCode: string;
  readonly negativeCode: string;
  readonly missingCode: string;
};
export type Output = { readonly status: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    recordedCode: { type: "string", maxLength: 8192 },
    positiveCode: { type: "string", maxLength: 8192 },
    negativeCode: { type: "string", maxLength: 8192 },
    missingCode: { type: "string", maxLength: 8192 },
  },
  required: ["recordedCode", "positiveCode", "negativeCode", "missingCode"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { status: { type: "string", maxLength: 8192 } },
  required: ["status"],
} as const;
/** Decode explicitly supplied literal immune-marker response codes without thresholding a measurement. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { recordedCode, positiveCode, negativeCode, missingCode } = request;
  const compute = (): Output => {
    H.domain(
      new Set([positiveCode, negativeCode, missingCode]).size === 3,
      "positiveCode",
    );
    return {
      status:
        recordedCode === positiveCode
          ? "recorded-positive"
          : recordedCode === negativeCode
            ? "recorded-negative"
            : recordedCode === missingCode
              ? "missing"
              : "unrecognized",
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    recordedCode: "P",
    positiveCode: "P",
    negativeCode: "N",
    missingCode: "M",
  },
  output: { status: "recorded-positive" },
} satisfies ToolExample<Input, Output>;
export const immuneMarkerPositivityCodeTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: ["immunology", "health and medicine"],
      keywords: ["immunology", "health and medicine"],
    },
    id: "immunology/immune-marker-positivity-code",
    title: "Immune Marker Positivity Code",
    description:
      "Decode explicitly supplied literal immune-marker response codes without thresholding a measurement.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        recordedCode: { type: "string", maxLength: 8192 },
        positiveCode: { type: "string", maxLength: 8192 },
        negativeCode: { type: "string", maxLength: 8192 },
        missingCode: { type: "string", maxLength: 8192 },
      },
      required: ["recordedCode", "positiveCode", "negativeCode", "missingCode"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { status: { type: "string", maxLength: 8192 } },
      required: ["status"],
    },
    ports: {
      inputs: [
        {
          id: "recordedCode",
          label: "Recorded Code",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "positiveCode",
          label: "Positive Code",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "negativeCode",
          label: "Negative Code",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "missingCode",
          label: "Missing Code",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        { id: "status", label: "Status", valueType: { type: "string" } },
      ],
    },
  },
  calculate,
});
export const run = immuneMarkerPositivityCodeTool.execute;
export default immuneMarkerPositivityCodeTool;
