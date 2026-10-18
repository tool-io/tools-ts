import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../binary/batch54-shared.js";
export type Input = Readonly<{ address: string; prefix: number }>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  { id: "address", kind: "string", label: "address" },
  { id: "prefix", kind: "integer", label: "prefix" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input) => {
  H.validate(i, fields);
  H.int(i.prefix, 1, 128);
  const r = H.prefix(i.address, i.prefix, 128);
  return H.finish({
    address: H.ipText(r.start ^ r.size, 128),
    prefix: i.prefix,
  });
};
export const example = {
  input: { address: "::2", prefix: 127 },
  output: {
    result: { address: "0000:0000:0000:0000:0000:0000:0000:0000", prefix: 127 },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "network/ipv6-prefix-sibling",
  title: "IPv6 Prefix Sibling",
  description:
    "Return the same-size IPv6 sibling prefix under the immediate parent, toggling the lowest network bit; /0 has no sibling.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Explicit result",
      kind: "object",
      schema: {
        type: "object",
        additionalProperties: false,
        properties: { address: { type: "string" }, prefix: { type: "number" } },
        required: ["address", "prefix"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
