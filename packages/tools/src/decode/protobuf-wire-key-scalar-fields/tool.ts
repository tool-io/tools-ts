import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../core/batch59-shared.js";
export type Input = Readonly<{ wireKey: number }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "wireKey", label: "Wire key", kind: "integer" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.int(i.wireKey, 0, 0xffffffff);
  const field = Math.floor(i.wireKey / 8),
    type = i.wireKey % 8;
  H.int(field, 1, 536870911);
  H.check(type <= 5);
  return H.finish({ fieldNumber: field, wireType: type });
};
export const example = {
  input: { wireKey: 18 },
  output: { result: { fieldNumber: 2, wireType: 2 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "decode/protobuf-wire-key-scalar-fields",
  title: "Decoding: Protocol Buffers Wire Key Scalar Fields Tool",
  description:
    "Decode one bounded Protocol Buffers wire key into legal field-number/wire-type fields, retaining legacy group types3/4 and rejecting field0 or wire6/7.",
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
          fieldNumber: { type: "number" },
          wireType: { type: "number" },
        },
        required: ["fieldNumber", "wireType"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
