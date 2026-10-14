import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../binary/batch54-shared.js";
export type Input = Readonly<{ leftJson: string; rightJson: string }>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  { id: "leftJson", kind: "string", label: "leftJson" },
  { id: "rightJson", kind: "string", label: "rightJson" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input) => {
  H.validate(i, fields);
  const a = H.dnsLabels(i.leftJson),
    b = H.dnsLabels(i.rightJson);
  let order = 0;
  for (let j = 1; j <= Math.min(a.length, b.length); j++) {
    order = H.tupleCompare(
      H.lowerBytes(a[a.length - j]),
      H.lowerBytes(b[b.length - j]),
    );
    if (order) break;
  }
  if (!order) order = Math.sign(a.length - b.length);
  return H.finish({ order });
};
export const example = {
  input: { leftJson: "[[122],[97]]", rightJson: "[[97],[98]]" },
  output: { result: { order: -1 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "dns/label-canonical-order-compare",
  title: "DNS Label Canonical Order Compare",
  description:
    "Compare DNS names in canonical label order from the root/rightmost label outward using lowercase unsigned octets; no Unicode collation or locale sorting.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Explicit result",
      kind: "object",
      schema: {
        type: "object",
        additionalProperties: false,
        properties: { order: { type: "number" } },
        required: ["order"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
