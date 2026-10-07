import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly itemCode: string;
  readonly serialPosition: number;
  readonly listLength: number;
};
export type Output = {
  readonly label: string;
  readonly first: boolean;
  readonly last: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    itemCode: { type: "string", maxLength: 8192, minLength: 1 },
    serialPosition: { type: "integer", minimum: 1 },
    listLength: { type: "integer", minimum: 1 },
  },
  required: ["itemCode", "serialPosition", "listLength"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    label: { type: "string", maxLength: 8192 },
    first: { type: "boolean" },
    last: { type: "boolean" },
  },
  required: ["label", "first", "last"],
} as const;
/** Label an explicitly supplied one-based memory-list serial position without estimating recall probability. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { itemCode, serialPosition, listLength } = request;
  const compute = (): Output => {
    H.domain(itemCode.length > 0, "itemCode");
    (H.domain(
      Number.isSafeInteger(listLength) &&
        listLength >= 1 &&
        listLength <= Number.MAX_SAFE_INTEGER,
      "listLength",
    ),
      listLength);
    (H.domain(
      Number.isSafeInteger(serialPosition) &&
        serialPosition >= 1 &&
        serialPosition <= listLength,
      "serialPosition",
    ),
      serialPosition);
    return {
      label: itemCode + " at " + serialPosition + "/" + listLength,
      first: serialPosition === 1,
      last: serialPosition === listLength,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { itemCode: "I17", serialPosition: 3, listLength: 10 },
  output: { label: "I17 at 3/10", first: false, last: false },
} satisfies ToolExample<Input, Output>;
export const memoryRecallSerialPositionLabelTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: ["cognitive-science", "cognitive science", "psychology"],
      keywords: ["cognitive science", "psychology"],
    },
    id: "cognitive-science/memory-recall-serial-position-label",
    title: "Memory Recall Serial Position Label",
    description:
      "Label an explicitly supplied one-based memory-list serial position without estimating recall probability.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        itemCode: { type: "string", maxLength: 8192, minLength: 1 },
        serialPosition: { type: "integer", minimum: 1 },
        listLength: { type: "integer", minimum: 1 },
      },
      required: ["itemCode", "serialPosition", "listLength"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        label: { type: "string", maxLength: 8192 },
        first: { type: "boolean" },
        last: { type: "boolean" },
      },
      required: ["label", "first", "last"],
    },
    ports: {
      inputs: [
        {
          id: "itemCode",
          label: "Item Code",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "serialPosition",
          label: "Serial Position",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "listLength",
          label: "List Length",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        { id: "label", label: "Label", valueType: { type: "string" } },
        { id: "first", label: "First", valueType: { type: "boolean" } },
        { id: "last", label: "Last", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = memoryRecallSerialPositionLabelTool.execute;
export default memoryRecallSerialPositionLabelTool;
