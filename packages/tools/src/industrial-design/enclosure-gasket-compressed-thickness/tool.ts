import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly uncompressedThickness: number;
  readonly suppliedCompressionFraction: number;
};
export type Output = {
  readonly compressedThickness: number;
  readonly compressionAmount: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    uncompressedThickness: { type: "number", minimum: 0 },
    suppliedCompressionFraction: { type: "number", minimum: 0, maximum: 1 },
  },
  required: ["uncompressedThickness", "suppliedCompressionFraction"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    compressedThickness: { type: "number" },
    compressionAmount: { type: "number" },
  },
  required: ["compressedThickness", "compressionAmount"],
} as const;
/** Apply an explicit compression fraction to gasket thickness without selecting sealing requirements. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { uncompressedThickness, suppliedCompressionFraction } = request;
  const compute = (): Output => {
    H.domain(uncompressedThickness >= 0, "uncompressedThickness");
    (H.domain(
      suppliedCompressionFraction >= 0 && suppliedCompressionFraction <= 1,
      "suppliedCompressionFraction",
    ),
      suppliedCompressionFraction);
    return {
      compressedThickness:
        uncompressedThickness * (1 - suppliedCompressionFraction),
      compressionAmount: uncompressedThickness * suppliedCompressionFraction,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { uncompressedThickness: 4, suppliedCompressionFraction: 0.25 },
  output: { compressedThickness: 3, compressionAmount: 1 },
} satisfies ToolExample<Input, Output>;
export const enclosureGasketCompressedThicknessTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: ["industrial-design", "industrial design", "arts and design"],
      keywords: ["industrial design", "arts and design"],
    },
    id: "industrial-design/enclosure-gasket-compressed-thickness",
    title: "Enclosure Gasket Compressed Thickness",
    description:
      "Apply an explicit compression fraction to gasket thickness without selecting sealing requirements.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        uncompressedThickness: { type: "number", minimum: 0 },
        suppliedCompressionFraction: { type: "number", minimum: 0, maximum: 1 },
      },
      required: ["uncompressedThickness", "suppliedCompressionFraction"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        compressedThickness: { type: "number" },
        compressionAmount: { type: "number" },
      },
      required: ["compressedThickness", "compressionAmount"],
    },
    ports: {
      inputs: [
        {
          id: "uncompressedThickness",
          label: "Uncompressed Thickness",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "suppliedCompressionFraction",
          label: "Supplied Compression Fraction",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "compressedThickness",
          label: "Compressed Thickness",
          valueType: { type: "number" },
        },
        {
          id: "compressionAmount",
          label: "Compression Amount",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = enclosureGasketCompressedThicknessTool.execute;
export default enclosureGasketCompressedThicknessTool;
