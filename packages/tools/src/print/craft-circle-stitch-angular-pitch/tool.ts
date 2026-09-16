import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../binary/batch54-shared.js";
export type Input = Readonly<{ stitches: number }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "stitches", kind: "integer", label: "stitches" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.int(i.stitches, 1);
  return H.finish({
    degrees: 360 / i.stitches,
    radians: (2 * Math.PI) / i.stitches,
  });
};
export const example = {
  input: { stitches: 4 },
  output: { result: { degrees: 90, radians: 1.5707963267948966 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "print/craft-circle-stitch-angular-pitch",
  title: "Craft Circle Stitch Angular Pitch",
  description:
    "Compute equal angular pitch for an explicit circular stitch count; does not estimate circumference or fabric deformation.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit result", kind: "object" }],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
