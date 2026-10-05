import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly parameterName: string; readonly value: string };
export type Output = {
  readonly normalizedName: string;
  readonly preservedValue: string;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    parameterName: { type: "string", maxLength: 8192 },
    value: { type: "string", maxLength: 8192 },
  },
  required: ["parameterName", "value"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    normalizedName: { type: "string", maxLength: 8192 },
    preservedValue: { type: "string", maxLength: 8192 },
  },
  required: ["normalizedName", "preservedValue"],
} as const;
/** Lowercase one UTM parameter name while preserving its case-sensitive value exactly; no URL parsing or value rewriting. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { parameterName, value } = request;
  const compute = (): Output => {
    H.domain(
      /^utm_[A-Za-z0-9_]+(?![\s\S])/i.test(parameterName),
      "parameterName",
    );
    return {
      normalizedName: parameterName.toLowerCase(),
      preservedValue: value,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { parameterName: "UTM_Source", value: "EmailCampaign" },
  output: { normalizedName: "utm_source", preservedValue: "EmailCampaign" },
} satisfies ToolExample<Input, Output>;
export const singleUtmParameterCaseNormalizerTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "marketing/single-utm-parameter-case-normalizer",
    title: "Single Utm Parameter Case Normalizer Tool",
    description:
      "Lowercase one UTM parameter name while preserving its case-sensitive value exactly; no URL parsing or value rewriting.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        parameterName: { type: "string", maxLength: 8192 },
        value: { type: "string", maxLength: 8192 },
      },
      required: ["parameterName", "value"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        normalizedName: { type: "string", maxLength: 8192 },
        preservedValue: { type: "string", maxLength: 8192 },
      },
      required: ["normalizedName", "preservedValue"],
    },
    ports: {
      inputs: [
        {
          id: "parameterName",
          label: "Parameter Name",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "value",
          label: "Value",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        {
          id: "normalizedName",
          label: "Normalized Name",
          valueType: { type: "string" },
        },
        {
          id: "preservedValue",
          label: "Preserved Value",
          valueType: { type: "string" },
        },
      ],
    },
  },
  calculate,
});
export const run = singleUtmParameterCaseNormalizerTool.execute;
export default singleUtmParameterCaseNormalizerTool;
