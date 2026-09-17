import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../binary/batch54-shared.js";
export type Input = Readonly<{ prefixesJson: string }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "prefixesJson", kind: "string", label: "prefixesJson" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  const r = H.records(i.prefixesJson)
      .map((v) => H.prefix(H.str(v.address), H.num(v.prefix), 32))
      .sort((a, b) => (a.start < b.start ? -1 : a.start > b.start ? 1 : 0)),
    merged: { start: bigint; end: bigint }[] = [];
  for (const v of r) {
    const p = merged.at(-1);
    if (p && v.start <= p.end + 1n) p.end = p.end > v.end ? p.end : v.end;
    else merged.push({ start: v.start, end: v.end });
  }
  return H.finish({
    cidrs: merged.flatMap((v) => H.cidrCover(v.start, v.end, 32)),
  });
};
export const example = {
  input: {
    prefixesJson:
      '[{"address":"10.0.0.0","prefix":25},{"address":"10.0.0.128","prefix":25}]',
  },
  output: { result: { cidrs: [{ address: "10.0.0.0", prefix: 24 }] } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "network/ipv4-prefix-set-collapse",
  title: "IPv4 Prefix Set Collapse",
  description:
    "Collapse the exact union of explicit IPv4 prefixes to minimal aligned CIDRs by merging overlaps/adjacency first; no route preference or policy interpretation.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit result", kind: "object" }],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
