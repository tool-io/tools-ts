import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../binary/batch54-shared.js";
export type Input = Readonly<{ labelsJson: string }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "labelsJson", kind: "string", label: "labelsJson" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  return H.finish({ labels: H.dnsLabels(i.labelsJson).map(H.lowerBytes) });
};
export const example = {
  input: { labelsJson: "[[65,90,192]]" },
  output: { result: { labels: [[97, 122, 192]] } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "dns/label-ascii-case-normalizer",
  title: "DNS Label ASCII Case Normalizer",
  description:
    "Canonicalize DNS ASCII uppercase octets only, leaving non-ASCII bytes unchanged; does not apply Unicode lowercase or IDNA mappings.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit result", kind: "object" }],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
