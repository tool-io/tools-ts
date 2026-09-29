import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly measuredHead: number;
  readonly ringZeroOffset: number;
  readonly groundReferenceOffset: number;
};
export type Output = {
  readonly headAboveGround: number;
  readonly positiveHead: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    measuredHead: { type: "number" },
    ringZeroOffset: { type: "number" },
    groundReferenceOffset: { type: "number" },
  },
  required: ["measuredHead", "ringZeroOffset", "groundReferenceOffset"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    headAboveGround: { type: "number" },
    positiveHead: { type: "boolean" },
  },
  required: ["headAboveGround", "positiveHead"],
} as const;
/** Additive reference offsets on a common vertical axis; no infiltration rate is inferred from head alone. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { measuredHead, ringZeroOffset, groundReferenceOffset } = request;
  const compute = (): Output => {
    return {
      headAboveGround: measuredHead + ringZeroOffset - groundReferenceOffset,
      positiveHead: measuredHead + ringZeroOffset - groundReferenceOffset > 0,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { measuredHead: 5, ringZeroOffset: 2, groundReferenceOffset: 1 },
  output: { headAboveGround: 6, positiveHead: true },
} satisfies ToolExample<Input, Output>;
export const infiltrationTestWaterHeadOffsetTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "hydrology/infiltration-test-water-head-offset",
    title: "Infiltration Test Water Head Offset Tool",
    description:
      "Additive reference offsets on a common vertical axis; no infiltration rate is inferred from head alone.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        measuredHead: { type: "number" },
        ringZeroOffset: { type: "number" },
        groundReferenceOffset: { type: "number" },
      },
      required: ["measuredHead", "ringZeroOffset", "groundReferenceOffset"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        headAboveGround: { type: "number" },
        positiveHead: { type: "boolean" },
      },
      required: ["headAboveGround", "positiveHead"],
    },
    ports: {
      inputs: [
        {
          id: "measuredHead",
          label: "Measured Head",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "ringZeroOffset",
          label: "Ring Zero Offset",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "groundReferenceOffset",
          label: "Ground Reference Offset",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "headAboveGround",
          label: "Head Above Ground",
          valueType: { type: "number" },
        },
        {
          id: "positiveHead",
          label: "Positive Head",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = infiltrationTestWaterHeadOffsetTool.execute;
export default infiltrationTestWaterHeadOffsetTool;
