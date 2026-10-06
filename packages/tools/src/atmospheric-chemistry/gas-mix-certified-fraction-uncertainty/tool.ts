import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly certifiedFraction: number;
  readonly absoluteUncertainty: number;
};
export type Output = {
  readonly lowerBound: number;
  readonly upperBound: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    certifiedFraction: { type: "number", minimum: 0, maximum: 1 },
    absoluteUncertainty: { type: "number", minimum: 0 },
  },
  required: ["certifiedFraction", "absoluteUncertainty"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    lowerBound: { type: "number" },
    upperBound: { type: "number" },
  },
  required: ["lowerBound", "upperBound"],
} as const;
/** Report an unclipped symmetric absolute uncertainty interval around a supplied certified gas fraction without selecting coverage probability. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { certifiedFraction, absoluteUncertainty } = request;
  const compute = (): Output => {
    (H.domain(
      certifiedFraction >= 0 && certifiedFraction <= 1,
      "certifiedFraction",
    ),
      certifiedFraction);
    H.domain(absoluteUncertainty >= 0, "absoluteUncertainty");
    return {
      lowerBound: certifiedFraction - absoluteUncertainty,
      upperBound: certifiedFraction + absoluteUncertainty,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { certifiedFraction: 0.5, absoluteUncertainty: 0.125 },
  output: { lowerBound: 0.375, upperBound: 0.625 },
} satisfies ToolExample<Input, Output>;
export const gasMixCertifiedFractionUncertaintyTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data", "learn"],
      fields: ["atmospheric-chemistry", "atmospheric chemistry", "chemistry"],
      keywords: ["atmospheric chemistry", "chemistry"],
    },
    id: "atmospheric-chemistry/gas-mix-certified-fraction-uncertainty",
    title: "Gas Mix Certified Fraction Uncertainty",
    description:
      "Report an unclipped symmetric absolute uncertainty interval around a supplied certified gas fraction without selecting coverage probability.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        certifiedFraction: { type: "number", minimum: 0, maximum: 1 },
        absoluteUncertainty: { type: "number", minimum: 0 },
      },
      required: ["certifiedFraction", "absoluteUncertainty"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        lowerBound: { type: "number" },
        upperBound: { type: "number" },
      },
      required: ["lowerBound", "upperBound"],
    },
    ports: {
      inputs: [
        {
          id: "certifiedFraction",
          label: "Certified Fraction",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "absoluteUncertainty",
          label: "Absolute Uncertainty",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "lowerBound",
          label: "Lower Bound",
          valueType: { type: "number" },
        },
        {
          id: "upperBound",
          label: "Upper Bound",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = gasMixCertifiedFractionUncertaintyTool.execute;
export default gasMixCertifiedFractionUncertaintyTool;
