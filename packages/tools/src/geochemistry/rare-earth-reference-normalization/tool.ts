import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly measuredConcentration: number;
  readonly referenceConcentration: number;
};
export type Output = { readonly normalizedConcentration: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    measuredConcentration: { type: "number", minimum: 0 },
    referenceConcentration: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["measuredConcentration", "referenceConcentration"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { normalizedConcentration: { type: "number" } },
  required: ["normalizedConcentration"],
} as const;
/** Normalize one rare-earth concentration to a supplied same-unit reference without providing a reference abundance table. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { measuredConcentration, referenceConcentration } = request;
  const compute = (): Output => {
    H.domain(measuredConcentration >= 0, "measuredConcentration");
    (H.domain(referenceConcentration > 0, "referenceConcentration"),
      referenceConcentration);
    return {
      normalizedConcentration: measuredConcentration / referenceConcentration,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { measuredConcentration: 12, referenceConcentration: 3 },
  output: { normalizedConcentration: 4 },
} satisfies ToolExample<Input, Output>;
export const rareEarthReferenceNormalizationTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data", "learn"],
      fields: ["geochemistry", "chemistry"],
      keywords: ["geochemistry", "chemistry"],
    },
    id: "geochemistry/rare-earth-reference-normalization",
    title: "Rare Earth Reference Normalization",
    description:
      "Normalize one rare-earth concentration to a supplied same-unit reference without providing a reference abundance table.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        measuredConcentration: { type: "number", minimum: 0 },
        referenceConcentration: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["measuredConcentration", "referenceConcentration"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { normalizedConcentration: { type: "number" } },
      required: ["normalizedConcentration"],
    },
    ports: {
      inputs: [
        {
          id: "measuredConcentration",
          label: "Measured Concentration",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "referenceConcentration",
          label: "Reference Concentration",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "normalizedConcentration",
          label: "Normalized Concentration",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = rareEarthReferenceNormalizationTool.execute;
export default rareEarthReferenceNormalizationTool;
