import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly featureCode: string;
  readonly recordedCode: string;
  readonly missingCode: string;
  readonly inapplicableCode: string;
};
export type Output = { readonly status: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    featureCode: { type: "string", maxLength: 8192, minLength: 1 },
    recordedCode: { type: "string", maxLength: 8192 },
    missingCode: { type: "string", maxLength: 8192 },
    inapplicableCode: { type: "string", maxLength: 8192 },
  },
  required: ["featureCode", "recordedCode", "missingCode", "inapplicableCode"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { status: { type: "string", maxLength: 8192 } },
  required: ["status"],
} as const;
/** Keep explicitly coded missing and inapplicable morphology features separate without interpreting a morphological character. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { featureCode, recordedCode, missingCode, inapplicableCode } = request;
  const compute = (): Output => {
    H.domain(
      featureCode.length > 0 && missingCode !== inapplicableCode,
      "featureCode",
    );
    return {
      status:
        recordedCode === missingCode
          ? "missing"
          : recordedCode === inapplicableCode
            ? "inapplicable"
            : "recorded",
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    featureCode: "F17",
    recordedCode: "?",
    missingCode: "?",
    inapplicableCode: "-",
  },
  output: { status: "missing" },
} satisfies ToolExample<Input, Output>;
export const morphologyFeatureMissingCodeTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data", "learn"],
      fields: ["developmental-biology", "developmental biology", "biology"],
      keywords: ["developmental biology", "biology"],
    },
    id: "developmental-biology/morphology-feature-missing-code",
    title: "Morphology Feature Missing Code",
    description:
      "Keep explicitly coded missing and inapplicable morphology features separate without interpreting a morphological character.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        featureCode: { type: "string", maxLength: 8192, minLength: 1 },
        recordedCode: { type: "string", maxLength: 8192 },
        missingCode: { type: "string", maxLength: 8192 },
        inapplicableCode: { type: "string", maxLength: 8192 },
      },
      required: [
        "featureCode",
        "recordedCode",
        "missingCode",
        "inapplicableCode",
      ],
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
          id: "featureCode",
          label: "Feature Code",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "recordedCode",
          label: "Recorded Code",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "missingCode",
          label: "Missing Code",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "inapplicableCode",
          label: "Inapplicable Code",
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
export const run = morphologyFeatureMissingCodeTool.execute;
export default morphologyFeatureMissingCodeTool;
