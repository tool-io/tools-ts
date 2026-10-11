import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly referenceTerm: number;
  readonly commonRatio: number;
  readonly referenceIndex: number;
  readonly targetIndex: number;
};
export type Output = { readonly targetTerm: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    referenceTerm: { type: "number" },
    commonRatio: { type: "number" },
    referenceIndex: { type: "integer" },
    targetIndex: { type: "integer" },
  },
  required: ["referenceTerm", "commonRatio", "referenceIndex", "targetIndex"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { targetTerm: { type: "number" } },
  required: ["targetTerm"],
} as const;
/** Shift an explicit geometric-sequence reference term by a signed integer index displacement, requiring a nonzero ratio for backward shifts. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { referenceTerm, commonRatio, referenceIndex, targetIndex } = request;
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
    H.domain(commonRatio !== 0 || targetIndex >= referenceIndex, "commonRatio");
    return {
      targetTerm:
        referenceTerm *
        Math.pow(
          commonRatio,
          Number(BigInt(targetIndex) - BigInt(referenceIndex)),
        ),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    referenceTerm: 3,
    commonRatio: 2,
    referenceIndex: 4,
    targetIndex: 6,
  },
  output: { targetTerm: 12 },
} satisfies ToolExample<Input, Output>;
export const geometricSequenceReferenceIndexShiftTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      discovery: {
        aliases: [],
        collections: ["data", "learn"],
        fields: ["sequence", "mathematics"],
        keywords: ["sequence", "mathematics"],
      },
      id: "sequence/geometric-sequence-reference-index-shift",
      title: "Geometric Sequence Reference Index Shift",
      description:
        "Shift an explicit geometric-sequence reference term by a signed integer index displacement, requiring a nonzero ratio for backward shifts.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          referenceTerm: { type: "number" },
          commonRatio: { type: "number" },
          referenceIndex: { type: "integer" },
          targetIndex: { type: "integer" },
        },
        required: [
          "referenceTerm",
          "commonRatio",
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
            id: "commonRatio",
            label: "Common Ratio",
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
export const run = geometricSequenceReferenceIndexShiftTool.execute;
export default geometricSequenceReferenceIndexShiftTool;
