import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../core/batch59-shared.js";
export type Input = Readonly<{ byte: number }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "byte", label: "Byte", kind: "integer" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.int(i.byte, 128, 191);
  return H.finish({ payload: i.byte - 128 });
};
export const example = {
  input: { byte: 172 },
  output: { result: { payload: 44 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "decode/utf8-continuation-payload-bits",
  title: "Decoding: UTF-8 Continuation Payload Bits Tool",
  description:
    "Extract six payload bits from one validated UTF-8 continuation octet80..BF, without claiming it occurs in a valid complete sequence.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculated result",
      kind: "object",
      schema: {
        type: "object",
        additionalProperties: false,
        properties: { payload: { type: "number" } },
        required: ["payload"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
