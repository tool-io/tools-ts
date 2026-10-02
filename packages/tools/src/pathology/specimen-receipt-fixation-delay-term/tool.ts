import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly collectionTime: number;
  readonly receiptTime: number;
  readonly recordedFixationStart: number;
  readonly collectionOffset: number;
  readonly receiptOffset: number;
  readonly fixationOffset: number;
};
export type Output = {
  readonly transit: number;
  readonly receiptToFixation: number;
  readonly collectionToFixation: number;
  readonly ordered: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    collectionTime: { type: "number" },
    receiptTime: { type: "number" },
    recordedFixationStart: { type: "number" },
    collectionOffset: { type: "number" },
    receiptOffset: { type: "number" },
    fixationOffset: { type: "number" },
  },
  required: [
    "collectionTime",
    "receiptTime",
    "recordedFixationStart",
    "collectionOffset",
    "receiptOffset",
    "fixationOffset",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    transit: { type: "number" },
    receiptToFixation: { type: "number" },
    collectionToFixation: { type: "number" },
    ordered: { type: "boolean" },
  },
  required: ["transit", "receiptToFixation", "collectionToFixation", "ordered"],
} as const;
/** Signed elapsed-time audit after subtracting explicit UTC offsets, without a specimen-processing schedule or acceptance threshold. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const {
    collectionTime,
    receiptTime,
    recordedFixationStart,
    collectionOffset,
    receiptOffset,
    fixationOffset,
  } = request;
  const compute = (): Output => {
    return {
      transit: receiptTime - receiptOffset - collectionTime + collectionOffset,
      receiptToFixation:
        recordedFixationStart - fixationOffset - receiptTime + receiptOffset,
      collectionToFixation:
        recordedFixationStart -
        fixationOffset -
        collectionTime +
        collectionOffset,
      ordered:
        receiptTime - receiptOffset >= collectionTime - collectionOffset &&
        recordedFixationStart - fixationOffset >= receiptTime - receiptOffset,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    collectionTime: 100,
    receiptTime: 160,
    recordedFixationStart: 180,
    collectionOffset: 0,
    receiptOffset: 0,
    fixationOffset: 0,
  },
  output: {
    transit: 60,
    receiptToFixation: 20,
    collectionToFixation: 80,
    ordered: true,
  },
} satisfies ToolExample<Input, Output>;
export const specimenReceiptFixationDelayTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "pathology/specimen-receipt-fixation-delay-term",
    title: "Specimen Receipt Fixation Delay Term Tool",
    description:
      "Signed elapsed-time audit after subtracting explicit UTC offsets, without a specimen-processing schedule or acceptance threshold.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        collectionTime: { type: "number" },
        receiptTime: { type: "number" },
        recordedFixationStart: { type: "number" },
        collectionOffset: { type: "number" },
        receiptOffset: { type: "number" },
        fixationOffset: { type: "number" },
      },
      required: [
        "collectionTime",
        "receiptTime",
        "recordedFixationStart",
        "collectionOffset",
        "receiptOffset",
        "fixationOffset",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        transit: { type: "number" },
        receiptToFixation: { type: "number" },
        collectionToFixation: { type: "number" },
        ordered: { type: "boolean" },
      },
      required: [
        "transit",
        "receiptToFixation",
        "collectionToFixation",
        "ordered",
      ],
    },
    ports: {
      inputs: [
        {
          id: "collectionTime",
          label: "Collection Time",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "receiptTime",
          label: "Receipt Time",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "recordedFixationStart",
          label: "Recorded Fixation Start",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "collectionOffset",
          label: "Collection Offset",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "receiptOffset",
          label: "Receipt Offset",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "fixationOffset",
          label: "Fixation Offset",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "transit", label: "Transit", valueType: { type: "number" } },
        {
          id: "receiptToFixation",
          label: "Receipt To Fixation",
          valueType: { type: "number" },
        },
        {
          id: "collectionToFixation",
          label: "Collection To Fixation",
          valueType: { type: "number" },
        },
        { id: "ordered", label: "Ordered", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = specimenReceiptFixationDelayTermTool.execute;
export default specimenReceiptFixationDelayTermTool;
