import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly firstCompressionArea: number;
  readonly secondCompressionArea: number;
};
export type Output = { readonly cohesiveness: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    firstCompressionArea: { type: "number", exclusiveMinimum: 0 },
    secondCompressionArea: { type: "number", minimum: 0 },
  },
  required: ["firstCompressionArea", "secondCompressionArea"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { cohesiveness: { type: "number" } },
  required: ["cohesiveness"],
} as const;
/** Ratio of supplied work integrals for two compression cycles, not a cross-sectional normalization. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { firstCompressionArea, secondCompressionArea } = request;
  const compute = (): Output => {
    H.positive(firstCompressionArea);
    H.domain(secondCompressionArea >= 0);
    return { cohesiveness: secondCompressionArea / firstCompressionArea };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { firstCompressionArea: 10, secondCompressionArea: 6 },
  output: { cohesiveness: 0.6 },
} satisfies ToolExample<Input, Output>;
export const foodTextureDoubleCompressionAreaRatioTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "food-technology/food-texture-double-compression-area-ratio",
      title: "Food Texture Double Compression Area Ratio Tool",
      description:
        "Ratio of supplied work integrals for two compression cycles, not a cross-sectional normalization.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          firstCompressionArea: { type: "number", exclusiveMinimum: 0 },
          secondCompressionArea: { type: "number", minimum: 0 },
        },
        required: ["firstCompressionArea", "secondCompressionArea"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: { cohesiveness: { type: "number" } },
        required: ["cohesiveness"],
      },
      ports: {
        inputs: [
          {
            id: "firstCompressionArea",
            label: "First Compression Area",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "secondCompressionArea",
            label: "Second Compression Area",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "cohesiveness",
            label: "Cohesiveness",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = foodTextureDoubleCompressionAreaRatioTool.execute;
export default foodTextureDoubleCompressionAreaRatioTool;
