import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly payloadBytes: number;
  readonly segmentCapacity: number;
  readonly overheadBytes: number;
};
export type Output = {
  readonly segments: number;
  readonly wireBytes: number;
  readonly overheadFraction: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    payloadBytes: { type: "integer", minimum: 0 },
    segmentCapacity: { type: "integer", minimum: 1 },
    overheadBytes: { type: "integer", minimum: 0 },
  },
  required: ["payloadBytes", "segmentCapacity", "overheadBytes"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    segments: { type: "integer" },
    wireBytes: { type: "integer" },
    overheadFraction: { type: "number" },
  },
  required: ["segments", "wireBytes", "overheadFraction"],
} as const;
/** Calculate message segmentation overhead budget from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { payloadBytes, segmentCapacity, overheadBytes } = request;
  const compute = (): Output => {
    H.integer(payloadBytes, 0);
    H.integer(segmentCapacity, 1);
    H.integer(overheadBytes, 0);
    return {
      segments: Math.ceil(payloadBytes / segmentCapacity),
      wireBytes:
        payloadBytes +
        Math.ceil(payloadBytes / segmentCapacity) * overheadBytes,
      overheadFraction:
        payloadBytes === 0
          ? 0
          : (Math.ceil(payloadBytes / segmentCapacity) * overheadBytes) /
            (payloadBytes +
              Math.ceil(payloadBytes / segmentCapacity) * overheadBytes),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { payloadBytes: 100, segmentCapacity: 40, overheadBytes: 5 },
  output: {
    segments: 3,
    wireBytes: 115,
    overheadFraction: 0.13043478260869565,
  },
} satisfies ToolExample<Input, Output>;
export const messageSegmentationOverheadBudgetTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "communication/message-segmentation-overhead-budget",
    title: "Message Segmentation Overhead Budget Tool",
    description:
      "Calculate message segmentation overhead budget from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        payloadBytes: { type: "integer", minimum: 0 },
        segmentCapacity: { type: "integer", minimum: 1 },
        overheadBytes: { type: "integer", minimum: 0 },
      },
      required: ["payloadBytes", "segmentCapacity", "overheadBytes"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        segments: { type: "integer" },
        wireBytes: { type: "integer" },
        overheadFraction: { type: "number" },
      },
      required: ["segments", "wireBytes", "overheadFraction"],
    },
    ports: {
      inputs: [
        {
          id: "payloadBytes",
          label: "Payload Bytes",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "segmentCapacity",
          label: "Segment Capacity",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "overheadBytes",
          label: "Overhead Bytes",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        { id: "segments", label: "Segments", valueType: { type: "integer" } },
        {
          id: "wireBytes",
          label: "Wire Bytes",
          valueType: { type: "integer" },
        },
        {
          id: "overheadFraction",
          label: "Overhead Fraction",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = messageSegmentationOverheadBudgetTool.execute;
export default messageSegmentationOverheadBudgetTool;
