import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly bytes: readonly number[] };
export type Output = {
  readonly acceptablePayload: boolean;
  readonly firstZeroIndex: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    bytes: { type: "array", maxItems: 256, items: { type: "integer" } },
  },
  required: ["bytes"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    acceptablePayload: { type: "boolean" },
    firstZeroIndex: { type: "integer" },
  },
  required: ["acceptablePayload", "firstZeroIndex"],
} as const;
/** Check the zero-byte restriction on a BSON cstring payload before adding its terminator; no UTF-8 validation. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { bytes } = request;
  const compute = (): Output => {
    H.domain(bytes.every((x) => x >= 0 && x <= 255));
    const firstZeroIndex = bytes.indexOf(0);
    return { acceptablePayload: firstZeroIndex === -1, firstZeroIndex };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { bytes: [65, 66] },
  output: { acceptablePayload: true, firstZeroIndex: -1 },
} satisfies ToolExample<Input, Output>;
export const bsonCstringZeroByteRejectionTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "encode/bson-cstring-zero-byte-rejection",
    title: "BSON Cstring Zero Byte Rejection Tool",
    description:
      "Check the zero-byte restriction on a BSON cstring payload before adding its terminator; no UTF-8 validation.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        bytes: { type: "array", maxItems: 256, items: { type: "integer" } },
      },
      required: ["bytes"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        acceptablePayload: { type: "boolean" },
        firstZeroIndex: { type: "integer" },
      },
      required: ["acceptablePayload", "firstZeroIndex"],
    },
    ports: {
      inputs: [
        {
          id: "bytes",
          label: "Bytes",
          required: true,
          valueType: { type: "list", items: { type: "integer" } },
        },
      ],
      outputs: [
        {
          id: "acceptablePayload",
          label: "Acceptable Payload",
          valueType: { type: "boolean" },
        },
        {
          id: "firstZeroIndex",
          label: "First Zero Index",
          valueType: { type: "integer" },
        },
      ],
    },
  },
  calculate,
});
export const run = bsonCstringZeroByteRejectionTool.execute;
export default bsonCstringZeroByteRejectionTool;
