import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly garmentWaist: number;
  readonly bodyWaist: number;
  readonly elasticRestLength: number;
};
export type Output = {
  readonly garmentEase: number;
  readonly elasticExtension: number;
  readonly elasticExtensionFraction: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    garmentWaist: { type: "number", minimum: 0 },
    bodyWaist: { type: "number", minimum: 0 },
    elasticRestLength: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["garmentWaist", "bodyWaist", "elasticRestLength"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    garmentEase: { type: "number" },
    elasticExtension: { type: "number" },
    elasticExtensionFraction: { type: "number" },
  },
  required: ["garmentEase", "elasticExtension", "elasticExtensionFraction"],
} as const;
/** Compare explicit garment ease and elastic extension on a common circumference basis without assessing comfort or recommending fit. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { garmentWaist, bodyWaist, elasticRestLength } = request;
  const compute = (): Output => {
    H.domain(garmentWaist >= 0 && bodyWaist >= 0, "garmentWaist");
    (H.domain(
      Number.isFinite(elasticRestLength) && elasticRestLength > 0,
      "elasticRestLength",
    ),
      elasticRestLength);
    return {
      garmentEase: garmentWaist - bodyWaist,
      elasticExtension: bodyWaist - elasticRestLength,
      elasticExtensionFraction:
        (bodyWaist - elasticRestLength) / elasticRestLength,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { garmentWaist: 84, bodyWaist: 80, elasticRestLength: 64 },
  output: {
    garmentEase: 4,
    elasticExtension: 16,
    elasticExtensionFraction: 0.25,
  },
} satisfies ToolExample<Input, Output>;
export const waistEaseElasticStretchDifferenceTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: ["fashion", "arts and design"],
      keywords: ["fashion", "arts and design"],
    },
    id: "fashion/waist-ease-elastic-stretch-difference",
    title: "Waist Ease Elastic Stretch Difference",
    description:
      "Compare explicit garment ease and elastic extension on a common circumference basis without assessing comfort or recommending fit.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        garmentWaist: { type: "number", minimum: 0 },
        bodyWaist: { type: "number", minimum: 0 },
        elasticRestLength: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["garmentWaist", "bodyWaist", "elasticRestLength"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        garmentEase: { type: "number" },
        elasticExtension: { type: "number" },
        elasticExtensionFraction: { type: "number" },
      },
      required: ["garmentEase", "elasticExtension", "elasticExtensionFraction"],
    },
    ports: {
      inputs: [
        {
          id: "garmentWaist",
          label: "Garment Waist",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "bodyWaist",
          label: "Body Waist",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "elasticRestLength",
          label: "Elastic Rest Length",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "garmentEase",
          label: "Garment Ease",
          valueType: { type: "number" },
        },
        {
          id: "elasticExtension",
          label: "Elastic Extension",
          valueType: { type: "number" },
        },
        {
          id: "elasticExtensionFraction",
          label: "Elastic Extension Fraction",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = waistEaseElasticStretchDifferenceTool.execute;
export default waistEaseElasticStretchDifferenceTool;
