import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly requestedPurposes: readonly string[];
  readonly consentedPurposes: readonly string[];
};
export type Output = {
  readonly requestedCount: number;
  readonly consentedCount: number;
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
    consentedPurposes: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
  },
  required: ["requestedPurposes", "consentedPurposes"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    requestedCount: { type: "integer" },
    consentedCount: { type: "integer" },
    missingCount: { type: "integer" },
  },
  required: ["requestedCount", "consentedCount", "missingCount"],
} as const;
/** Calculate consent purpose cardinality gap from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { requestedPurposes, consentedPurposes } = request;
  const compute = (): Output => {
    return {
      requestedCount: new Set(requestedPurposes).size,
      consentedCount: new Set(consentedPurposes).size,
      missingCount: new Set(
        requestedPurposes.filter((x) => !consentedPurposes.includes(x)),
      ).size,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { requestedPurposes: ["a", "b"], consentedPurposes: ["b", "c"] },
  output: { requestedCount: 2, consentedCount: 2, missingCount: 1 },
} satisfies ToolExample<Input, Output>;
export const consentPurposeCardinalityGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "applied-ethics/consent-purpose-cardinality-gap",
    title: "Consent Purpose Cardinality Gap Tool",
    description:
      "Calculate consent purpose cardinality gap from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        requestedPurposes: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
        consentedPurposes: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
      },
      required: ["requestedPurposes", "consentedPurposes"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        requestedCount: { type: "integer" },
        consentedCount: { type: "integer" },
        missingCount: { type: "integer" },
      },
      required: ["requestedCount", "consentedCount", "missingCount"],
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
          id: "consentedPurposes",
          label: "Consented Purposes",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
      ],
      outputs: [
        {
          id: "requestedCount",
          label: "Requested Count",
          valueType: { type: "integer" },
        },
        {
          id: "consentedCount",
          label: "Consented Count",
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
export const run = consentPurposeCardinalityGapTool.execute;
export default consentPurposeCardinalityGapTool;
