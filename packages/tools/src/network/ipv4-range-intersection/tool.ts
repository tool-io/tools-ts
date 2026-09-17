import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../binary/batch54-shared.js";
export type Input = Readonly<{
  leftStart: string;
  leftEnd: string;
  rightStart: string;
  rightEnd: string;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "leftStart", kind: "string", label: "leftStart" },
  { id: "leftEnd", kind: "string", label: "leftEnd" },
  { id: "rightStart", kind: "string", label: "rightStart" },
  { id: "rightEnd", kind: "string", label: "rightEnd" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  const [a, b] = H.ipRange(i.leftStart, i.leftEnd, 32),
    [c, d] = H.ipRange(i.rightStart, i.rightEnd, 32),
    start = a > c ? a : c,
    end = b < d ? b : d;
  return H.finish({
    intersection:
      start <= end
        ? {
            start: H.ipText(start, 32),
            end: H.ipText(end, 32),
            count: String(end - start + 1n),
          }
        : null,
  });
};
export const example = {
  input: {
    leftStart: "10.0.0.1",
    leftEnd: "10.0.0.5",
    rightStart: "10.0.0.4",
    rightEnd: "10.0.0.8",
  },
  output: {
    result: {
      intersection: { start: "10.0.0.4", end: "10.0.0.5", count: "2" },
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "network/ipv4-range-intersection",
  title: "IPv4 Range Intersection",
  description:
    "Intersect arbitrary inclusive IPv4 ranges exactly and return null for disjoint ranges; all addresses count, not only assignable hosts.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit result", kind: "object" }],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
