import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../binary/batch54-shared.js";
export type Input = Readonly<{ labelsJson: string }>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  { id: "labelsJson", kind: "string", label: "labelsJson" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input) => {
  H.validate(i, fields);
  const labels = H.dnsLabels(i.labelsJson),
    bytes = labels.flatMap((r) => [r.length, ...r]);
  bytes.push(0);
  H.check(bytes.length <= 128, "Wire output budget is 128 bytes");
  return H.finish({ bytes });
};
export const example = {
  input: { labelsJson: "[[97],[98,99]]" },
  output: { result: { bytes: [1, 97, 2, 98, 99, 0] } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "dns/label-list-wire-formatter",
  title: "DNS Label List Wire Formatter",
  description:
    "Format uncompressed DNS wire labels from explicit octets with 63-byte label and 255-byte protocol whole-name bounds, plus a 128-byte local output budget; appends root zero, no compression or IDNA.",
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
