import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../core/batch59-shared.js";
export type Input = Readonly<{ field: number }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "field", label: "Field", kind: "integer" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.int(i.field, 0, 65535);
  return H.finish({
    hexadecimal: "0x" + H.hex(i.field, 4),
    interpretation:
      i.field <= 1500
        ? "length"
        : i.field >= 1536
          ? "ethertype"
          : "undefined-gap",
  });
};
export const example = {
  input: { field: 2048 },
  output: { result: { hexadecimal: "0x0800", interpretation: "ethertype" } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "network/ethernet-ethertype-hex-label",
  title: "Network: Ethernet Ethertype Hex Label Tool",
  description:
    "Format the Ethernet type/length field and distinguish length, EtherType and the undefined 1501..1535 gap; no protocol-name registry.",
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
          hexadecimal: { type: "string" },
          interpretation: { type: "string" },
        },
        required: ["hexadecimal", "interpretation"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
