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
    ranges: bigint[][] = [];
  if (d < a || c > b) ranges.push([a, b]);
  else {
    if (c > a) ranges.push([a, c - 1n]);
    if (d < b) ranges.push([d + 1n, b]);
  }
  return H.finish({
    ranges: ranges.map(([s, e]) => ({
      start: H.ipText(s, 32),
      end: H.ipText(e, 32),
    })),
  });
};
export const example = {
  input: {
    leftStart: "10.0.0.1",
    leftEnd: "10.0.0.8",
    rightStart: "10.0.0.4",
    rightEnd: "10.0.0.5",
  },
  output: {
    result: {
      ranges: [
        { start: "10.0.0.1", end: "10.0.0.3" },
        { start: "10.0.0.6", end: "10.0.0.8" },
      ],
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "network/ipv4-range-subtraction",
  title: "IPv4 Range Subtraction",
  description:
    "Subtract one arbitrary inclusive IPv4 range from another, returning zero to two exact remaining ranges without subnet or host exclusions.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit result", kind: "object" }],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
