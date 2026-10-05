import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly vectorIndex: number;
  readonly bytesPerEntry: number;
  readonly baseByteAddress: number;
};
export type Output = {
  readonly offsetBytes: number;
  readonly byteAddress: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    vectorIndex: { type: "integer", minimum: 0 },
    bytesPerEntry: { type: "integer", minimum: 1 },
    baseByteAddress: { type: "integer", minimum: 0 },
  },
  required: ["vectorIndex", "bytesPerEntry", "baseByteAddress"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    offsetBytes: { type: "integer" },
    byteAddress: { type: "integer" },
  },
  required: ["offsetBytes", "byteAddress"],
} as const;
/** Calculate a vector table entry's byte offset and address from an explicit table layout. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { vectorIndex, bytesPerEntry, baseByteAddress } = request;
  const compute = (): Output => {
    (H.domain(
      Number.isSafeInteger(vectorIndex) &&
        vectorIndex >= 0 &&
        vectorIndex <= Number.MAX_SAFE_INTEGER,
      "vectorIndex",
    ),
      vectorIndex);
    (H.domain(
      Number.isSafeInteger(bytesPerEntry) &&
        bytesPerEntry >= 1 &&
        bytesPerEntry <= Number.MAX_SAFE_INTEGER,
      "bytesPerEntry",
    ),
      bytesPerEntry);
    (H.domain(
      Number.isSafeInteger(baseByteAddress) &&
        baseByteAddress >= 0 &&
        baseByteAddress <= Number.MAX_SAFE_INTEGER,
      "baseByteAddress",
    ),
      baseByteAddress);
    return {
      offsetBytes: vectorIndex * bytesPerEntry,
      byteAddress: baseByteAddress + vectorIndex * bytesPerEntry,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { vectorIndex: 7, bytesPerEntry: 4, baseByteAddress: 256 },
  output: { offsetBytes: 28, byteAddress: 284 },
} satisfies ToolExample<Input, Output>;
export const interruptVectorByteOffsetTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "microcontroller/interrupt-vector-byte-offset",
    title: "Interrupt Vector Byte Offset Tool",
    description:
      "Calculate a vector table entry's byte offset and address from an explicit table layout.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        vectorIndex: { type: "integer", minimum: 0 },
        bytesPerEntry: { type: "integer", minimum: 1 },
        baseByteAddress: { type: "integer", minimum: 0 },
      },
      required: ["vectorIndex", "bytesPerEntry", "baseByteAddress"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        offsetBytes: { type: "integer" },
        byteAddress: { type: "integer" },
      },
      required: ["offsetBytes", "byteAddress"],
    },
    ports: {
      inputs: [
        {
          id: "vectorIndex",
          label: "Vector Index",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "bytesPerEntry",
          label: "Bytes Per Entry",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "baseByteAddress",
          label: "Base Byte Address",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "offsetBytes",
          label: "Offset Bytes",
          valueType: { type: "integer" },
        },
        {
          id: "byteAddress",
          label: "Byte Address",
          valueType: { type: "integer" },
        },
      ],
    },
  },
  calculate,
});
export const run = interruptVectorByteOffsetTool.execute;
export default interruptVectorByteOffsetTool;
