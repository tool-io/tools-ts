import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../binary/batch54-shared.js";
export type Input = Readonly<{ relativeJson: string; zoneJson: string }>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  { id: "relativeJson", kind: "string", label: "relativeJson" },
  { id: "zoneJson", kind: "string", label: "zoneJson" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input) => {
  H.validate(i, fields);
  const labels = [...H.dnsLabels(i.relativeJson), ...H.dnsLabels(i.zoneJson)];
  H.check(labels.reduce((s, r) => s + r.length + 1, 1) <= 255);
  return H.finish({ labels });
};
export const example = {
  input: { relativeJson: "[[97]]", zoneJson: "[[98],[99]]" },
  output: { result: { labels: [[97], [98], [99]] } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "dns/name-absolute-from-relative",
  title: "DNS Name Absolute from Relative",
  description:
    "Append explicit relative DNS label octets to a zone\u2019s labels with complete-name byte-budget validation; no resolver, search-list or origin guessing.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Explicit result",
      kind: "object",
      schema: {
        type: "object",
        additionalProperties: false,
        properties: {
          labels: {
            type: "array",
            items: { type: "array", items: { type: "number" } },
          },
        },
        required: ["labels"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
