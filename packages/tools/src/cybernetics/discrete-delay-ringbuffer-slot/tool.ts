import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly writeIndex: number;
  readonly delaySteps: number;
  readonly capacity: number;
};
export type Output = { readonly readIndex: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    writeIndex: { type: "integer", minimum: 0 },
    delaySteps: { type: "integer", minimum: 0 },
    capacity: { type: "integer", minimum: 1 },
  },
  required: ["writeIndex", "delaySteps", "capacity"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { readIndex: { type: "integer" } },
  required: ["readIndex"],
} as const;
/** Find a supplied ring-buffer read slot for a delay less than capacity, assuming writeIndex denotes the current sample slot. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { writeIndex, delaySteps, capacity } = request;
  const compute = (): Output => {
    (H.domain(
      Number.isSafeInteger(capacity) &&
        capacity >= 1 &&
        capacity <= Number.MAX_SAFE_INTEGER,
      "capacity",
    ),
      capacity);
    (H.domain(
      Number.isSafeInteger(writeIndex) &&
        writeIndex >= 0 &&
        writeIndex <= capacity - 1,
      "writeIndex",
    ),
      writeIndex);
    (H.domain(
      Number.isSafeInteger(delaySteps) &&
        delaySteps >= 0 &&
        delaySteps <= capacity - 1,
      "delaySteps",
    ),
      delaySteps);
    return {
      readIndex: Number(
        (BigInt(writeIndex) - BigInt(delaySteps) + BigInt(capacity)) %
          BigInt(capacity),
      ),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { writeIndex: 2, delaySteps: 4, capacity: 8 },
  output: { readIndex: 6 },
} satisfies ToolExample<Input, Output>;
export const discreteDelayRingbufferSlotTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "cybernetics/discrete-delay-ringbuffer-slot",
    title: "Discrete Delay Ringbuffer Slot Tool",
    description:
      "Find a supplied ring-buffer read slot for a delay less than capacity, assuming writeIndex denotes the current sample slot.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        writeIndex: { type: "integer", minimum: 0 },
        delaySteps: { type: "integer", minimum: 0 },
        capacity: { type: "integer", minimum: 1 },
      },
      required: ["writeIndex", "delaySteps", "capacity"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { readIndex: { type: "integer" } },
      required: ["readIndex"],
    },
    ports: {
      inputs: [
        {
          id: "writeIndex",
          label: "Write Index",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "delaySteps",
          label: "Delay Steps",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "capacity",
          label: "Capacity",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "readIndex",
          label: "Read Index",
          valueType: { type: "integer" },
        },
      ],
    },
  },
  calculate,
});
export const run = discreteDelayRingbufferSlotTool.execute;
export default discreteDelayRingbufferSlotTool;
