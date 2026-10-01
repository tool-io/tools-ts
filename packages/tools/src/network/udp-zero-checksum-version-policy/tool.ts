import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../core/batch59-shared.js";
export type Input = Readonly<{
  ipVersion: number;
  checksum: number;
  explicitIpv6Exception: boolean;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "ipVersion", label: "Ip version", kind: "integer" },
  { id: "checksum", label: "Checksum", kind: "integer" },
  {
    id: "explicitIpv6Exception",
    label: "Explicit ipv6 exception",
    kind: "boolean",
  },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.check(i.ipVersion === 4 || i.ipVersion === 6);
  H.int(i.checksum, 0, 65535);
  return H.finish({
    zeroChecksum: i.checksum === 0,
    generallyAllowed: i.checksum !== 0 || i.ipVersion === 4,
    requiresSpecifiedException: i.checksum === 0 && i.ipVersion === 6,
    explicitExceptionDeclared:
      i.ipVersion === 6 && i.checksum === 0 && i.explicitIpv6Exception,
  });
};
export const example = {
  input: { ipVersion: 6, checksum: 0, explicitIpv6Exception: false },
  output: {
    result: {
      zeroChecksum: true,
      generallyAllowed: false,
      requiresSpecifiedException: true,
      explicitExceptionDeclared: false,
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "network/udp-zero-checksum-version-policy",
  title: "Network: UDP Zero Checksum Version Policy Tool",
  description:
    "Distinguish UDP zero-checksum IPv4 absence from the general IPv6 prohibition and explicitly declared exceptional context; does not certify an RFC6936 exception.",
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
          explicitExceptionDeclared: { type: "boolean" },
          generallyAllowed: { type: "boolean" },
          requiresSpecifiedException: { type: "boolean" },
          zeroChecksum: { type: "boolean" },
        },
        required: [
          "explicitExceptionDeclared",
          "generallyAllowed",
          "requiresSpecifiedException",
          "zeroChecksum",
        ],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
