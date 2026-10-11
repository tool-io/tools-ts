import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly referenceTerm: number;
  readonly commonDifference: number;
  readonly referenceIndex: number;
  readonly targetIndex: number;
};
export type Output = { readonly targetTerm: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    referenceTerm: { type: "number" },
    commonDifference: { type: "number" },
    referenceIndex: { type: "integer" },
    targetIndex: { type: "integer" },
  },
  required: [
    "referenceTerm",
    "commonDifference",
    "referenceIndex",
    "targetIndex",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { targetTerm: { type: "number" } },
  required: ["targetTerm"],
} as const;
/** Shift an explicit arithmetic-sequence reference term by a signed exact integer index displacement. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { referenceTerm, commonDifference, referenceIndex, targetIndex } =
    request;
  const compute = (): Output => {
    (H.domain(
      Number.isSafeInteger(referenceIndex) &&
        referenceIndex >= -Number.MAX_SAFE_INTEGER &&
        referenceIndex <= Number.MAX_SAFE_INTEGER,
      "referenceIndex",
    ),
      referenceIndex);
    (H.domain(
      Number.isSafeInteger(targetIndex) &&
        targetIndex >= -Number.MAX_SAFE_INTEGER &&
        targetIndex <= Number.MAX_SAFE_INTEGER,
      "targetIndex",
    ),
      targetIndex);
    return {
      targetTerm:
        referenceTerm +
        Number(BigInt(targetIndex) - BigInt(referenceIndex)) * commonDifference,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    referenceTerm: 10,
    commonDifference: 3,
    referenceIndex: 5,
    targetIndex: 8,
  },
  output: { targetTerm: 19 },
} satisfies ToolExample<Input, Output>;
export const arithmeticSequenceReferenceIndexShiftTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      discovery: {
        aliases: [],
        collections: ["data", "learn"],
        fields: ["sequence", "mathematics"],
        keywords: ["sequence", "mathematics"],
      },
      id: "sequence/arithmetic-sequence-reference-index-shift",
      title: "Arithmetic Sequence Reference Index Shift",
      description:
        "Shift an explicit arithmetic-sequence reference term by a signed exact integer index displacement.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          referenceTerm: { type: "number" },
          commonDifference: { type: "number" },
          referenceIndex: { type: "integer" },
          targetIndex: { type: "integer" },
        },
        required: [
          "referenceTerm",
          "commonDifference",
          "referenceIndex",
          "targetIndex",
        ],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: { targetTerm: { type: "number" } },
        required: ["targetTerm"],
      },
      ports: {
        inputs: [
          {
            id: "referenceTerm",
            label: "Reference Term",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "commonDifference",
            label: "Common Difference",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "referenceIndex",
            label: "Reference Index",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "targetIndex",
            label: "Target Index",
            required: true,
            valueType: { type: "integer" },
          },
        ],
        outputs: [
          {
            id: "targetTerm",
            label: "Target Term",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = arithmeticSequenceReferenceIndexShiftTool.execute;
export default arithmeticSequenceReferenceIndexShiftTool;
