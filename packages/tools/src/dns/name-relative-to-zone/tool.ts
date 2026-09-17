import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../binary/batch54-shared.js";
export type Input = Readonly<{ nameJson: string; zoneJson: string }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "nameJson", kind: "string", label: "nameJson" },
  { id: "zoneJson", kind: "string", label: "zoneJson" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  const a = H.dnsLabels(i.nameJson),
    b = H.dnsLabels(i.zoneJson),
    inside = H.suffixLabels(a, b);
  return H.finish({
    inside,
    relativeLabels: inside ? a.slice(0, a.length - b.length) : null,
  });
};
export const example = {
  input: { nameJson: "[[97],[98],[99]]", zoneJson: "[[98],[99]]" },
  output: { result: { inside: true, relativeLabels: [[97]] } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "dns/name-relative-to-zone",
  title: "DNS Name Relative to Zone",
  description:
    "Return exact relative DNS labels only for a name inside an explicitly supplied zone suffix; outside names remain null and case is preserved.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit result", kind: "object" }],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
