import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly asReceivedFraction: number;
  readonly waterMassFraction: number;
  readonly suppliedDryFraction: number;
};
export type Output = {
  readonly convertedDryFraction: number;
  readonly gap: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    asReceivedFraction: { type: "number", minimum: 0, maximum: 1 },
    waterMassFraction: { type: "number", minimum: 0, exclusiveMaximum: 1 },
    suppliedDryFraction: { type: "number", minimum: 0, maximum: 1 },
  },
  required: ["asReceivedFraction", "waterMassFraction", "suppliedDryFraction"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    convertedDryFraction: { type: "number" },
    gap: { type: "number" },
  },
  required: ["convertedDryFraction", "gap"],
} as const;
/** Compare supplied mass-fraction assay bases without identifying compounds or evaluating a product. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { asReceivedFraction, waterMassFraction, suppliedDryFraction } =
    request;
  const compute = (): Output => {
    H.probability(asReceivedFraction);
    H.domain(
      waterMassFraction >= 0 &&
        waterMassFraction < 1 &&
        asReceivedFraction <= 1 - waterMassFraction,
    );
    H.probability(suppliedDryFraction);
    return {
      convertedDryFraction: asReceivedFraction / (1 - waterMassFraction),
      gap: asReceivedFraction / (1 - waterMassFraction) - suppliedDryFraction,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    asReceivedFraction: 0.1,
    waterMassFraction: 0.5,
    suppliedDryFraction: 0.15,
  },
  output: { convertedDryFraction: 0.2, gap: 0.05000000000000002 },
} satisfies ToolExample<Input, Output>;
export const markerAssayDryBasisGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "pharmacognosy/marker-assay-dry-basis-gap",
    title: "Marker Assay Dry Basis Gap Tool",
    description:
      "Compare supplied mass-fraction assay bases without identifying compounds or evaluating a product.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        asReceivedFraction: { type: "number", minimum: 0, maximum: 1 },
        waterMassFraction: { type: "number", minimum: 0, exclusiveMaximum: 1 },
        suppliedDryFraction: { type: "number", minimum: 0, maximum: 1 },
      },
      required: [
        "asReceivedFraction",
        "waterMassFraction",
        "suppliedDryFraction",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        convertedDryFraction: { type: "number" },
        gap: { type: "number" },
      },
      required: ["convertedDryFraction", "gap"],
    },
    ports: {
      inputs: [
        {
          id: "asReceivedFraction",
          label: "As Received Fraction",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "waterMassFraction",
          label: "Water Mass Fraction",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "suppliedDryFraction",
          label: "Supplied Dry Fraction",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "convertedDryFraction",
          label: "Converted Dry Fraction",
          valueType: { type: "number" },
        },
        { id: "gap", label: "Gap", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = markerAssayDryBasisGapTool.execute;
export default markerAssayDryBasisGapTool;
