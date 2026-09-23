import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly lengths: readonly number[];
  readonly operations: readonly string[];
};
export type Output = {
  readonly hasZeroLength: boolean;
  readonly zeroIndices: readonly number[];
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    lengths: { type: "array", maxItems: 256, items: { type: "integer" } },
    operations: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
  },
  required: ["lengths", "operations"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    hasZeroLength: { type: "boolean" },
    zeroIndices: { type: "array", maxItems: 256, items: { type: "integer" } },
  },
  required: ["hasZeroLength", "zeroIndices"],
} as const;
/** Flag zero-length operations in a supplied parsed CIGAR stream; no alignment or sequence is reconstructed. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { lengths, operations } = request;
  const compute = (): Output => {
    H.sameLength(lengths, operations);
    H.domain(
      lengths.length > 0 &&
        lengths.every((x) => x >= 0) &&
        operations.every((x) =>
          ["M", "I", "D", "N", "S", "H", "P", "=", "X"].includes(x),
        ),
    );
    const zeroIndices = lengths.flatMap((x, i) => (x === 0 ? [i] : []));
    return { hasZeroLength: zeroIndices.length > 0, zeroIndices };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { lengths: [10, 0, 5], operations: ["M", "I", "M"] },
  output: { hasZeroLength: true, zeroIndices: [1] },
} satisfies ToolExample<Input, Output>;
export const samCigarZeroLengthFlagTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "bioinformatics/sam-cigar-zero-length-flag",
    title: "SAM CIGAR Zero Length Flag Tool",
    description:
      "Flag zero-length operations in a supplied parsed CIGAR stream; no alignment or sequence is reconstructed.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        lengths: { type: "array", maxItems: 256, items: { type: "integer" } },
        operations: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
      },
      required: ["lengths", "operations"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        hasZeroLength: { type: "boolean" },
        zeroIndices: {
          type: "array",
          maxItems: 256,
          items: { type: "integer" },
        },
      },
      required: ["hasZeroLength", "zeroIndices"],
    },
    ports: {
      inputs: [
        {
          id: "lengths",
          label: "Lengths",
          required: true,
          valueType: { type: "list", items: { type: "integer" } },
        },
        {
          id: "operations",
          label: "Operations",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
      ],
      outputs: [
        {
          id: "hasZeroLength",
          label: "Has Zero Length",
          valueType: { type: "boolean" },
        },
        {
          id: "zeroIndices",
          label: "Zero Indices",
          valueType: { type: "list", items: { type: "integer" } },
        },
      ],
    },
  },
  calculate,
});
export const run = samCigarZeroLengthFlagTool.execute;
export default samCigarZeroLengthFlagTool;
