import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../binary/batch54-shared.js";
export type Input = Readonly<{ address: string }>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  { id: "address", kind: "string", label: "address" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input) => {
  H.validate(i, fields);
  return H.finish({ integer: String(H.ip(i.address, 128)) });
};
export const example = {
  input: { address: "::1" },
  output: { result: { integer: "1" } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "network/ipv6-address-integer-string",
  title: "IPv6 Address Integer String",
  description:
    "Convert an IPv6 address through the existing RFC 4291 parser to an exact unsigned 128-bit decimal integer string; no unsafe numeric conversion.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Explicit result",
      kind: "object",
      schema: {
        type: "object",
        additionalProperties: false,
        properties: { integer: { type: "string" } },
        required: ["integer"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
