import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly bytes: readonly number[];
  readonly start: number;
};
export type Output = {
  readonly terminatorIndex: number;
  readonly byteLength: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    bytes: { type: "array", maxItems: 256, items: { type: "integer" } },
    start: { type: "integer", minimum: 0 },
  },
  required: ["bytes", "start"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    terminatorIndex: { type: "integer" },
    byteLength: { type: "integer" },
  },
  required: ["terminatorIndex", "byteLength"],
} as const;
/** Locate a zero terminator in supplied bytes without validating their character encoding. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { bytes, start } = request;
  const compute = (): Output => {
    H.domain(bytes.every((x) => x >= 0 && x <= 255));
    H.integer(start, 0, bytes.length);
    const terminatorIndex = bytes.indexOf(0, start);
    H.domain(terminatorIndex !== -1);
    return { terminatorIndex, byteLength: terminatorIndex - start };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { bytes: [1, 65, 66, 0, 9], start: 1 },
  output: { terminatorIndex: 3, byteLength: 2 },
} satisfies ToolExample<Input, Output>;
export const bsonCstringTerminatorOffsetTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "decode/bson-cstring-terminator-offset",
    title: "BSON Cstring Terminator Offset Tool",
    description:
      "Locate a zero terminator in supplied bytes without validating their character encoding.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        bytes: { type: "array", maxItems: 256, items: { type: "integer" } },
        start: { type: "integer", minimum: 0 },
      },
      required: ["bytes", "start"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        terminatorIndex: { type: "integer" },
        byteLength: { type: "integer" },
      },
      required: ["terminatorIndex", "byteLength"],
    },
    ports: {
      inputs: [
        {
          id: "bytes",
          label: "Bytes",
          required: true,
          valueType: { type: "list", items: { type: "integer" } },
        },
        {
          id: "start",
          label: "Start",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "terminatorIndex",
          label: "Terminator Index",
          valueType: { type: "integer" },
        },
        {
          id: "byteLength",
          label: "Byte Length",
          valueType: { type: "integer" },
        },
      ],
    },
  },
  calculate,
});
export const run = bsonCstringTerminatorOffsetTool.execute;
export default bsonCstringTerminatorOffsetTool;
