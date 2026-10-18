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
  H.int(i.prefix, 1, 32);
  const r = H.prefix(i.address, i.prefix, 32);
  return H.finish({
    address: H.ipText(r.start ^ r.size, 32),
    prefix: i.prefix,
  });
};
export const example = {
  input: { address: "10.0.0.2", prefix: 31 },
  output: { result: { address: "10.0.0.0", prefix: 31 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "network/ipv4-prefix-sibling",
  title: "IPv4 Prefix Sibling",
  description:
    "Find the other same-size child of an IPv4 prefix\u2019s parent by toggling the lowest network bit; /0 has no sibling.",
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
