import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../binary/batch54-shared.js";
export type Input = Readonly<{ leftJson: string; rightJson: string }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "leftJson", kind: "string", label: "leftJson" },
  { id: "rightJson", kind: "string", label: "rightJson" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  const a = H.dnsLabels(i.leftJson),
    b = H.dnsLabels(i.rightJson);
  let count = 0;
  while (
    count < Math.min(a.length, b.length) &&
    H.labelEquals(a[a.length - count - 1], b[b.length - count - 1])
  )
    count++;
  return H.finish({ labels: a.slice(a.length - count), count });
};
export const example = {
  input: { leftJson: "[[97],[98],[99]]", rightJson: "[[100],[66],[99]]" },
  output: { result: { labels: [[98], [99]], count: 2 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "dns/name-longest-common-suffix",
  title: "DNS Name Longest Common Suffix",
  description:
    "Find the longest complete DNS label suffix shared by two names under ASCII case-insensitive comparison, preserving the left name\u2019s original octets.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit result", kind: "object" }],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
