import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../core/batch59-shared.js";
export type Input = Readonly<{ headerRcode: number; extendedRcode: number }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "headerRcode", label: "Header rcode", kind: "integer" },
  { id: "extendedRcode", label: "Extended rcode", kind: "integer" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.int(i.headerRcode, 0, 15);
  H.int(i.extendedRcode, 0, 255);
  return H.finish({ rcode: 16 * i.extendedRcode + i.headerRcode });
};
export const example = {
  input: { headerRcode: 0, extendedRcode: 1 },
  output: { result: { rcode: 16 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "network/dns-rcode-low-high-field-join",
  title: "Network: DNS Rcode Low High Field Join Tool",
  description:
    "Join the EDNS extended eight-bit RCODE field and DNS header low four-bit RCODE into its standardized twelve-bit number; no response-name registry.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculated result",
      kind: "object",
      schema: {
        type: "object",
        additionalProperties: false,
        properties: { rcode: { type: "number" } },
        required: ["rcode"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
