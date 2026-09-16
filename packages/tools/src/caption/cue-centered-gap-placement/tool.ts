import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../binary/batch54-shared.js";
export type Input = Readonly<{
  gapStart: number;
  gapEnd: number;
  duration: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "gapStart", kind: "integer", label: "gapStart" },
  { id: "gapEnd", kind: "integer", label: "gapEnd" },
  { id: "duration", kind: "integer", label: "duration" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.int(i.gapStart, 0, 1e12);
  H.int(i.gapEnd, i.gapStart, 1e12);
  H.int(i.duration, 0, i.gapEnd - i.gapStart);
  const start =
    i.gapStart + Math.floor((i.gapEnd - i.gapStart - i.duration) / 2);
  return H.finish({
    start,
    end: start + i.duration,
    leftMargin: start - i.gapStart,
    rightMargin: i.gapEnd - start - i.duration,
  });
};
export const example = {
  input: { gapStart: 10, gapEnd: 21, duration: 4 },
  output: { result: { start: 13, end: 17, leftMargin: 3, rightMargin: 4 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "caption/cue-centered-gap-placement",
  title: "Caption Cue Centered Gap Placement",
  description:
    "Center an integer-duration caption inside a supplied gap; odd leftover milliseconds place the extra millisecond on the right.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit result", kind: "object" }],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
