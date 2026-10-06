import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly cropCodes: readonly string[];
  readonly sampledArea: number;
};
export type Output = {
  readonly richness: number;
  readonly richnessPerArea: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    cropCodes: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    sampledArea: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["cropCodes", "sampledArea"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    richness: { type: "integer" },
    richnessPerArea: { type: "number" },
  },
  required: ["richness", "richnessPerArea"],
} as const;
/** Count distinct explicitly coded crop types and report richness per supplied sampled area without estimating a diversity index. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { cropCodes, sampledArea } = request;
  const compute = (): Output => {
    (H.domain(sampledArea > 0, "sampledArea"), sampledArea);
    H.domain(
      cropCodes.every((s) => s.length > 0),
      "cropCodes",
    );
    const richness = new Set(cropCodes).size;
    return { richness, richnessPerArea: richness / sampledArea };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { cropCodes: ["A", "B", "A", "C"], sampledArea: 2 },
  output: { richness: 3, richnessPerArea: 1.5 },
} satisfies ToolExample<Input, Output>;
export const cropDiversityRichnessDenominatorTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: ["agroecology", "agriculture"],
      keywords: ["agroecology", "agriculture"],
    },
    id: "agroecology/crop-diversity-richness-denominator",
    title: "Crop Diversity Richness Denominator",
    description:
      "Count distinct explicitly coded crop types and report richness per supplied sampled area without estimating a diversity index.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        cropCodes: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
        sampledArea: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["cropCodes", "sampledArea"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        richness: { type: "integer" },
        richnessPerArea: { type: "number" },
      },
      required: ["richness", "richnessPerArea"],
    },
    ports: {
      inputs: [
        {
          id: "cropCodes",
          label: "Crop Codes",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
        {
          id: "sampledArea",
          label: "Sampled Area",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "richness", label: "Richness", valueType: { type: "integer" } },
        {
          id: "richnessPerArea",
          label: "Richness Per Area",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = cropDiversityRichnessDenominatorTool.execute;
export default cropDiversityRichnessDenominatorTool;
