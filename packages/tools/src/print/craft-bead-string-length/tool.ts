import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../binary/batch54-shared.js";
export type Input = Readonly<{
  diameters: readonly number[];
  gaps: readonly number[];
  ends: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "diameters", kind: "numberList", label: "diameters" },
  { id: "gaps", kind: "numberList", label: "gaps" },
  { id: "ends", kind: "number", label: "ends" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.check(
    i.diameters.length > 0 &&
      i.gaps.length === i.diameters.length - 1 &&
      i.ends >= 0,
  );
  i.diameters.forEach(H.positive);
  H.check(i.gaps.every((x) => x >= 0));
  return H.finish({
    length:
      i.diameters.reduce((s, x) => s + x, 0) +
      i.gaps.reduce((s, x) => s + x, 0) +
      i.ends,
  });
};
export const example = {
  input: { diameters: [4, 5, 4], gaps: [1, 1], ends: 2 },
  output: { result: { length: 17 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "print/craft-bead-string-length",
  title: "Craft Bead String Length",
  description:
    "Budget craft bead string length from individually supplied bead diameters, inter-bead gaps and total end allowance; no elastic or knot model.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit result", kind: "object" }],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
