import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../binary/batch54-shared.js";
export type Input = Readonly<{
  start: string;
  end: string;
  prefixesJson: string;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "start", kind: "string", label: "start" },
  { id: "end", kind: "string", label: "end" },
  { id: "prefixesJson", kind: "string", label: "prefixesJson" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  const [start, end] = H.ipRange(i.start, i.end, 32),
    r = H.records(i.prefixesJson)
      .map((v) => H.prefix(H.str(v.address), H.num(v.prefix), 32))
      .filter((v) => v.end >= start && v.start <= end)
      .sort((a, b) => (a.start < b.start ? -1 : a.start > b.start ? 1 : 0)),
    ranges: bigint[][] = [];
  let p = start;
  for (const v of r) {
    if (v.start > p) ranges.push([p, v.start - 1n]);
    if (v.end >= p) p = v.end + 1n;
    if (p > end) break;
  }
  if (p <= end) ranges.push([p, end]);
  return H.finish({
    ranges: ranges.map(([a, b]) => ({
      start: H.ipText(a, 32),
      end: H.ipText(b, 32),
    })),
  });
};
export const example = {
  input: {
    start: "10.0.0.0",
    end: "10.0.0.7",
    prefixesJson: '[{"address":"10.0.0.2","prefix":31}]',
  },
  output: {
    result: {
      ranges: [
        { start: "10.0.0.0", end: "10.0.0.1" },
        { start: "10.0.0.4", end: "10.0.0.7" },
      ],
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "network/ipv4-prefix-set-uncovered-ranges",
  title: "IPv4 Prefix Set Uncovered Ranges",
  description:
    "Find arbitrary inclusive IPv4 domain ranges not covered by an explicit prefix set, preserving uncovered endpoints exactly.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit result", kind: "object" }],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
