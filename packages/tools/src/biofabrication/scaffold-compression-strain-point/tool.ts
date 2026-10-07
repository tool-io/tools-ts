import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly referenceHeight: number;
  readonly compressedHeight: number;
};
export type Output = { readonly compressionPositiveEngineeringStrain: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    referenceHeight: { type: "number", exclusiveMinimum: 0 },
    compressedHeight: { type: "number", minimum: 0 },
  },
  required: ["referenceHeight", "compressedHeight"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { compressionPositiveEngineeringStrain: { type: "number" } },
  required: ["compressionPositiveEngineeringStrain"],
} as const;
/** Calculate compression-positive engineering strain from explicit heights without modeling stress or material suitability. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { referenceHeight, compressedHeight } = request;
  const compute = (): Output => {
    (H.domain(referenceHeight > 0, "referenceHeight"), referenceHeight);
    H.domain(compressedHeight >= 0, "compressedHeight");
    return {
      compressionPositiveEngineeringStrain:
        (referenceHeight - compressedHeight) / referenceHeight,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { referenceHeight: 10, compressedHeight: 8 },
  output: { compressionPositiveEngineeringStrain: 0.2 },
} satisfies ToolExample<Input, Output>;
export const scaffoldCompressionStrainPointTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data", "learn"],
      fields: ["biofabrication", "engineering"],
      keywords: ["biofabrication", "engineering"],
    },
    id: "biofabrication/scaffold-compression-strain-point",
    title: "Scaffold Compression Strain Point",
    description:
      "Calculate compression-positive engineering strain from explicit heights without modeling stress or material suitability.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        referenceHeight: { type: "number", exclusiveMinimum: 0 },
        compressedHeight: { type: "number", minimum: 0 },
      },
      required: ["referenceHeight", "compressedHeight"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { compressionPositiveEngineeringStrain: { type: "number" } },
      required: ["compressionPositiveEngineeringStrain"],
    },
    ports: {
      inputs: [
        {
          id: "referenceHeight",
          label: "Reference Height",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "compressedHeight",
          label: "Compressed Height",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "compressionPositiveEngineeringStrain",
          label: "Compression Positive Engineering Strain",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = scaffoldCompressionStrainPointTool.execute;
export default scaffoldCompressionStrainPointTool;
