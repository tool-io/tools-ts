import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly batchId: string;
  readonly yieldBasisWording: string;
  readonly sourceRecordId: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    batchId: { type: "string", maxLength: 8192, minLength: 1 },
    yieldBasisWording: { type: "string", maxLength: 8192, minLength: 1 },
    sourceRecordId: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["batchId", "yieldBasisWording", "sourceRecordId"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Preserve an explicit batch-yield reference basis without computing acceptance criteria. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { batchId, yieldBasisWording, sourceRecordId } = request;
  const compute = (): Output => {
    H.domain(batchId.length > 0, "batchId");
    H.domain(yieldBasisWording.length > 0, "yieldBasisWording");
    H.domain(sourceRecordId.length > 0, "sourceRecordId");
    return {
      token: JSON.stringify([batchId, yieldBasisWording, sourceRecordId]),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    batchId: "B17",
    yieldBasisWording: "dry mass",
    sourceRecordId: "REC2",
  },
  output: { token: '["B17","dry mass","REC2"]' },
} satisfies ToolExample<Input, Output>;
export const gmpYieldReferenceBasisLabelTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: [
        "gmp",
        "good manufacturing practice",
        "research and quality management",
      ],
      keywords: [
        "good manufacturing practice",
        "research and quality management",
        "GMP",
      ],
    },
    id: "gmp/gmp-yield-reference-basis-label",
    title: "GMP Yield Reference Basis Label",
    description:
      "Preserve an explicit batch-yield reference basis without computing acceptance criteria.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        batchId: { type: "string", maxLength: 8192, minLength: 1 },
        yieldBasisWording: { type: "string", maxLength: 8192, minLength: 1 },
        sourceRecordId: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["batchId", "yieldBasisWording", "sourceRecordId"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { token: { type: "string", maxLength: 8192 } },
      required: ["token"],
    },
    ports: {
      inputs: [
        {
          id: "batchId",
          label: "Batch Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "yieldBasisWording",
          label: "Yield Basis Wording",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "sourceRecordId",
          label: "Source Record Id",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "token", label: "Token", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = gmpYieldReferenceBasisLabelTool.execute;
export default gmpYieldReferenceBasisLabelTool;
