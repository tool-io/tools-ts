import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly voucherId: string;
  readonly assertedStatus: string;
  readonly sourceStatus: string;
  readonly sourceKnown: boolean;
};
export type Output = {
  readonly verifiedComparison: boolean;
  readonly matches: boolean;
  readonly preservedId: string;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    voucherId: { type: "string", maxLength: 8192 },
    assertedStatus: { type: "string", maxLength: 8192 },
    sourceStatus: { type: "string", maxLength: 8192 },
    sourceKnown: { type: "boolean" },
  },
  required: ["voucherId", "assertedStatus", "sourceStatus", "sourceKnown"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    verifiedComparison: { type: "boolean" },
    matches: { type: "boolean" },
    preservedId: { type: "string", maxLength: 8192 },
  },
  required: ["verifiedComparison", "matches", "preservedId"],
} as const;
/** Compare caller-supplied voucher type-status labels without verifying nomenclatural status. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { voucherId, assertedStatus, sourceStatus, sourceKnown } = request;
  const compute = (): Output => {
    return {
      verifiedComparison: sourceKnown,
      matches: sourceKnown && assertedStatus === sourceStatus,
      preservedId: voucherId,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    voucherId: "V1",
    assertedStatus: "holotype",
    sourceStatus: "isotype",
    sourceKnown: true,
  },
  output: { verifiedComparison: true, matches: false, preservedId: "V1" },
} satisfies ToolExample<Input, Output>;
export const voucherTypeStatusSourceGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "biosystematics/voucher-type-status-source-gap",
    title: "Voucher Type Status Source Gap Tool",
    description:
      "Compare caller-supplied voucher type-status labels without verifying nomenclatural status.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        voucherId: { type: "string", maxLength: 8192 },
        assertedStatus: { type: "string", maxLength: 8192 },
        sourceStatus: { type: "string", maxLength: 8192 },
        sourceKnown: { type: "boolean" },
      },
      required: ["voucherId", "assertedStatus", "sourceStatus", "sourceKnown"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        verifiedComparison: { type: "boolean" },
        matches: { type: "boolean" },
        preservedId: { type: "string", maxLength: 8192 },
      },
      required: ["verifiedComparison", "matches", "preservedId"],
    },
    ports: {
      inputs: [
        {
          id: "voucherId",
          label: "Voucher Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "assertedStatus",
          label: "Asserted Status",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "sourceStatus",
          label: "Source Status",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "sourceKnown",
          label: "Source Known",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        {
          id: "verifiedComparison",
          label: "Verified Comparison",
          valueType: { type: "boolean" },
        },
        { id: "matches", label: "Matches", valueType: { type: "boolean" } },
        {
          id: "preservedId",
          label: "Preserved Id",
          valueType: { type: "string" },
        },
      ],
    },
  },
  calculate,
});
export const run = voucherTypeStatusSourceGapTool.execute;
export default voucherTypeStatusSourceGapTool;
