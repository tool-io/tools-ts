import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../binary/batch54-shared.js";
export type Input = Readonly<{ bytes: readonly number[] }>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  { id: "bytes", kind: "numberList", label: "bytes" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input) => {
  H.validate(i, fields);
  return H.finish({ bytes: H.cobsDecode(i.bytes) });
};
export const example = {
  input: { bytes: [2, 11, 2, 22] },
  output: { result: { bytes: [11, 0, 22] } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "framing/cobs-payload-decoder",
  title: "COBS Payload Decoder",
  description:
    "COBS payload decode without a framing zero delimiter; bounded encoded input to 128 bytes, with strict block bounds.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Explicit result",
      kind: "object",
      schema: {
        type: "object",
        additionalProperties: false,
        properties: { bytes: { type: "array", items: { type: "number" } } },
        required: ["bytes"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
