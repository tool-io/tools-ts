import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly referenceIndex: number;
  readonly resetIndex: number;
};
export type Output = { readonly signedGap: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    referenceIndex: { type: "number" },
    resetIndex: { type: "number" },
  },
  required: ["referenceIndex", "resetIndex"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { signedGap: { type: "number" } },
  required: ["signedGap"],
} as const;
/** Subtract an explicit reference lease index from its supplied reset index without applying lease terms. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { referenceIndex, resetIndex } = request;
  const compute = (): Output => {
    return { signedGap: resetIndex - referenceIndex };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { referenceIndex: 12, resetIndex: 17 },
  output: { signedGap: 5 },
} satisfies ToolExample<Input, Output>;
export const leaseIndexResetReferenceGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data", "trading"],
      fields: ["finance", "business and finance"],
      keywords: ["finance", "business and finance"],
    },
    id: "finance/lease-index-reset-reference-gap",
    title: "Lease Index Reset Reference Gap",
    description:
      "Subtract an explicit reference lease index from its supplied reset index without applying lease terms.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        referenceIndex: { type: "number" },
        resetIndex: { type: "number" },
      },
      required: ["referenceIndex", "resetIndex"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { signedGap: { type: "number" } },
      required: ["signedGap"],
    },
    ports: {
      inputs: [
        {
          id: "referenceIndex",
          label: "Reference Index",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "resetIndex",
          label: "Reset Index",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "signedGap", label: "Signed Gap", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = leaseIndexResetReferenceGapTool.execute;
export default leaseIndexResetReferenceGapTool;
