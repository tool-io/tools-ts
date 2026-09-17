import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../binary/batch54-shared.js";
export type Input = Readonly<{ start: string; end: string }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "start", kind: "string", label: "start" },
  { id: "end", kind: "string", label: "end" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  const [a, b] = H.ipRange(i.start, i.end, 32);
  return H.finish({ cidrs: H.cidrCover(a, b, 32) });
};
export const example = {
  input: { start: "10.0.0.1", end: "10.0.0.6" },
  output: {
    result: {
      cidrs: [
        { address: "10.0.0.1", prefix: 32 },
        { address: "10.0.0.2", prefix: 31 },
        { address: "10.0.0.4", prefix: 31 },
        { address: "10.0.0.6", prefix: 32 },
      ],
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "network/ipv4-range-cover-cidrs",
  title: "IPv4 Range CIDR Cover",
  description:
    "Cover an arbitrary inclusive IPv4 range by a minimal disjoint aligned CIDR sequence; no network/broadcast address subtraction.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit result", kind: "object" }],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
