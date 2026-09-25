import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../core/batch59-shared.js";
export type Input = Readonly<{ octet: number }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "octet", label: "Octet", kind: "integer" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.int(i.octet, 0, 255);
  return H.finish({
    kind:
      i.octet < 128
        ? "short"
        : i.octet === 128
          ? "indefinite"
          : i.octet === 255
            ? "reserved"
            : "long",
    shortLength: i.octet < 128 ? i.octet : 0,
    followingOctets: i.octet > 128 && i.octet < 255 ? i.octet - 128 : 0,
  });
};
export const example = {
  input: { octet: 130 },
  output: { result: { kind: "long", shortLength: 0, followingOctets: 2 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "decode/ber-length-initial-octet",
  title: "Decoding: Ber Length Initial Octet Tool",
  description:
    "Classify one ASN.1 BER initial length octet, distinguishing short, long, indefinite and reservedFF; no DER permissibility or full length decoding.",
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
          followingOctets: { type: "number" },
          kind: { type: "string" },
          shortLength: { type: "number" },
        },
        required: ["followingOctets", "kind", "shortLength"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
