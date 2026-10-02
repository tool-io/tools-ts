import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly confidence: number;
  readonly suppliedBoundary: number;
  readonly equalityAccepted: boolean;
};
export type Output = {
  readonly margin: number;
  readonly acceptedUnderRule: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    confidence: { type: "number", minimum: 0, maximum: 1 },
    suppliedBoundary: { type: "number", minimum: 0, maximum: 1 },
    equalityAccepted: { type: "boolean" },
  },
  required: ["confidence", "suppliedBoundary", "equalityAccepted"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    margin: { type: "number" },
    acceptedUnderRule: { type: "boolean" },
  },
  required: ["margin", "acceptedUnderRule"],
} as const;
/** Compare caller-supplied research call confidence to an explicit boundary without phenotype or drug guidance. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { confidence, suppliedBoundary, equalityAccepted } = request;
  const compute = (): Output => {
    H.probability(confidence);
    H.probability(suppliedBoundary);
    return {
      margin: confidence - suppliedBoundary,
      acceptedUnderRule: equalityAccepted
        ? confidence >= suppliedBoundary
        : confidence > suppliedBoundary,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { confidence: 0.9, suppliedBoundary: 0.8, equalityAccepted: true },
  output: { margin: 0.09999999999999998, acceptedUnderRule: true },
} satisfies ToolExample<Input, Output>;
export const alleleCallConfidenceMarginTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "pharmacogenomics/allele-call-confidence-margin",
    title: "Allele Call Confidence Margin Tool",
    description:
      "Compare caller-supplied research call confidence to an explicit boundary without phenotype or drug guidance.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        confidence: { type: "number", minimum: 0, maximum: 1 },
        suppliedBoundary: { type: "number", minimum: 0, maximum: 1 },
        equalityAccepted: { type: "boolean" },
      },
      required: ["confidence", "suppliedBoundary", "equalityAccepted"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        margin: { type: "number" },
        acceptedUnderRule: { type: "boolean" },
      },
      required: ["margin", "acceptedUnderRule"],
    },
    ports: {
      inputs: [
        {
          id: "confidence",
          label: "Confidence",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "suppliedBoundary",
          label: "Supplied Boundary",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "equalityAccepted",
          label: "Equality Accepted",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        { id: "margin", label: "Margin", valueType: { type: "number" } },
        {
          id: "acceptedUnderRule",
          label: "Accepted Under Rule",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = alleleCallConfidenceMarginTool.execute;
export default alleleCallConfidenceMarginTool;
