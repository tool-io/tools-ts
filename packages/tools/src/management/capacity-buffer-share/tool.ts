import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly capacity: number;
  readonly committed: number;
  readonly reserved: number;
};
export type Output = {
  readonly uncommitted: number;
  readonly freeAfterReserve: number;
  readonly bufferShare: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    capacity: { type: "number", exclusiveMinimum: 0 },
    committed: { type: "number", minimum: 0 },
    reserved: { type: "number", minimum: 0 },
  },
  required: ["capacity", "committed", "reserved"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    uncommitted: { type: "number" },
    freeAfterReserve: { type: "number" },
    bufferShare: { type: "number" },
  },
  required: ["uncommitted", "freeAfterReserve", "bufferShare"],
} as const;
/** Expose signed capacity overcommitment after an explicit reserve. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { capacity, committed, reserved } = request;
  const compute = (): Output => {
    H.positive(capacity);
    H.domain(committed >= 0 && reserved >= 0);
    return {
      uncommitted: capacity - committed,
      freeAfterReserve: capacity - committed - reserved,
      bufferShare: (capacity - committed - reserved) / capacity,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { capacity: 100, committed: 70, reserved: 10 },
  output: { uncommitted: 30, freeAfterReserve: 20, bufferShare: 0.2 },
} satisfies ToolExample<Input, Output>;
export const capacityBufferShareTool = H.defineSchemaCalculation<Input, Output>(
  {
    ...{
      id: "management/capacity-buffer-share",
      title: "Capacity Buffer Share Tool",
      description:
        "Expose signed capacity overcommitment after an explicit reserve.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          capacity: { type: "number", exclusiveMinimum: 0 },
          committed: { type: "number", minimum: 0 },
          reserved: { type: "number", minimum: 0 },
        },
        required: ["capacity", "committed", "reserved"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          uncommitted: { type: "number" },
          freeAfterReserve: { type: "number" },
          bufferShare: { type: "number" },
        },
        required: ["uncommitted", "freeAfterReserve", "bufferShare"],
      },
      ports: {
        inputs: [
          {
            id: "capacity",
            label: "Capacity",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "committed",
            label: "Committed",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "reserved",
            label: "Reserved",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "uncommitted",
            label: "Uncommitted",
            valueType: { type: "number" },
          },
          {
            id: "freeAfterReserve",
            label: "Free After Reserve",
            valueType: { type: "number" },
          },
          {
            id: "bufferShare",
            label: "Buffer Share",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  },
);
export const run = capacityBufferShareTool.execute;
export default capacityBufferShareTool;
