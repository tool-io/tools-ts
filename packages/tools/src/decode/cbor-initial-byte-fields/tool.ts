import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../core/batch59-shared.js";
export type Input = Readonly<{ initialByte: number }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "initialByte", label: "Initial byte", kind: "integer" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.int(i.initialByte, 0, 255);
  return H.finish({
    majorType: Math.floor(i.initialByte / 32),
    additionalInformation: i.initialByte % 32,
    reservedAdditionalInformation:
      i.initialByte % 32 >= 28 && i.initialByte % 32 <= 30,
  });
};
export const example = {
  input: { initialByte: 161 },
  output: {
    result: {
      majorType: 5,
      additionalInformation: 1,
      reservedAdditionalInformation: false,
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "decode/cbor-initial-byte-fields",
  title: "Decoding: CBOR Initial Byte Fields Tool",
  description:
    "Split an RFC8949 CBOR initial byte into major type and additional information while retaining reserved28..30 evidence; no CBOR item or document decoding.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculated result",
      kind: "object",
      schema: {
        type: "object",
        additionalProperties: false,
        properties: {
          additionalInformation: { type: "number" },
          majorType: { type: "number" },
          reservedAdditionalInformation: { type: "boolean" },
        },
        required: [
          "additionalInformation",
          "majorType",
          "reservedAdditionalInformation",
        ],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
