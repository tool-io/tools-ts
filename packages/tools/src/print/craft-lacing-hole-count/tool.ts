import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../binary/batch54-shared.js";
export type Input = Readonly<{
  length: number;
  pitch: number;
  includeBothEnds: boolean;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "length", kind: "number", label: "length" },
  { id: "pitch", kind: "number", label: "pitch" },
  { id: "includeBothEnds", kind: "boolean", label: "includeBothEnds" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.check(i.length >= 0);
  H.positive(i.pitch);
  return H.finish({
    holes:
      Math.floor(i.length / i.pitch) +
      1 +
      (i.includeBothEnds && H.mod(i.length, i.pitch) !== 0 ? 1 : 0),
    regularEnd: Math.floor(i.length / i.pitch) * i.pitch,
  });
};
export const example = {
  input: { length: 10, pitch: 3, includeBothEnds: true },
  output: { result: { holes: 5, regularEnd: 9 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "print/craft-lacing-hole-count",
  title: "Craft Lacing Hole Count",
  description:
    "Count regularly pitched lacing holes starting at zero, optionally adding an irregular final hole at the far endpoint.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit result", kind: "object" }],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
