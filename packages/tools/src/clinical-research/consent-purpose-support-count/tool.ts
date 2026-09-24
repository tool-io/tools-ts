import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly requestedPurposes: readonly string[];
  readonly supportedPurposes: readonly string[];
};
export type Output = {
  readonly supportedCount: number;
  readonly missingCount: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    requestedPurposes: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    supportedPurposes: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
  },
  required: ["requestedPurposes", "supportedPurposes"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    supportedCount: { type: "integer" },
    missingCount: { type: "integer" },
  },
  required: ["supportedCount", "missingCount"],
} as const;
/** Count exact purpose-token support in supplied research records without legal consent interpretation. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { requestedPurposes, supportedPurposes } = request;
  const compute = (): Output => {
    return {
      supportedCount: new Set(
        requestedPurposes.filter((x) => supportedPurposes.includes(x)),
      ).size,
      missingCount: new Set(
        requestedPurposes.filter((x) => !supportedPurposes.includes(x)),
      ).size,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { requestedPurposes: ["a", "b"], supportedPurposes: ["b"] },
  output: { supportedCount: 1, missingCount: 1 },
} satisfies ToolExample<Input, Output>;
export const consentPurposeSupportCountTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "clinical-research/consent-purpose-support-count",
    title: "Consent Purpose Support Count Tool",
    description:
      "Count exact purpose-token support in supplied research records without legal consent interpretation.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        requestedPurposes: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
        supportedPurposes: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
      },
      required: ["requestedPurposes", "supportedPurposes"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        supportedCount: { type: "integer" },
        missingCount: { type: "integer" },
      },
      required: ["supportedCount", "missingCount"],
    },
    ports: {
      inputs: [
        {
          id: "requestedPurposes",
          label: "Requested Purposes",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
        {
          id: "supportedPurposes",
          label: "Supported Purposes",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
      ],
      outputs: [
        {
          id: "supportedCount",
          label: "Supported Count",
          valueType: { type: "integer" },
        },
        {
          id: "missingCount",
          label: "Missing Count",
          valueType: { type: "integer" },
        },
      ],
    },
  },
  calculate,
});
export const run = consentPurposeSupportCountTool.execute;
export default consentPurposeSupportCountTool;
