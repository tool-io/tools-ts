import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly encoded: number };
export type Output = {
  readonly length: number;
  readonly opcode: number;
  readonly operation: string;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { encoded: { type: "integer", minimum: 0, maximum: 4294967295 } },
  required: ["encoded"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    length: { type: "integer" },
    opcode: { type: "integer" },
    operation: { type: "string", maxLength: 8192 },
  },
  required: ["length", "opcode", "operation"],
} as const;
/** Decode one unsigned BAM CIGAR word: low four bits select the operation and the upper bits encode positive length. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { encoded } = request;
  const compute = (): Output => {
    H.integer(encoded, 0, 4294967295);
    const opcode = encoded % 16,
      length = Math.floor(encoded / 16);
    H.domain(opcode <= 8 && length > 0);
    return { length, opcode, operation: "MIDNSHP=X"[opcode] };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { encoded: 160 },
  output: { length: 10, opcode: 0, operation: "M" },
} satisfies ToolExample<Input, Output>;
export const bamCigarOpcodeLengthSplitTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "bioinformatics/bam-cigar-opcode-length-split",
    title: "BAM CIGAR Opcode Length Split Tool",
    description:
      "Decode one unsigned BAM CIGAR word: low four bits select the operation and the upper bits encode positive length.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        encoded: { type: "integer", minimum: 0, maximum: 4294967295 },
      },
      required: ["encoded"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        length: { type: "integer" },
        opcode: { type: "integer" },
        operation: { type: "string", maxLength: 8192 },
      },
      required: ["length", "opcode", "operation"],
    },
    ports: {
      inputs: [
        {
          id: "encoded",
          label: "Encoded",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        { id: "length", label: "Length", valueType: { type: "integer" } },
        { id: "opcode", label: "Opcode", valueType: { type: "integer" } },
        { id: "operation", label: "Operation", valueType: { type: "string" } },
      ],
    },
  },
  calculate,
});
export const run = bamCigarOpcodeLengthSplitTool.execute;
export default bamCigarOpcodeLengthSplitTool;
