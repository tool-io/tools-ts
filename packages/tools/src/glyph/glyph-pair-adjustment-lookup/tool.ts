import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../css/batch55-shared.js";
export type Input = Readonly<{
  pairsJson: string;
  left: string;
  right: string;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "pairsJson", label: "pairsJson", kind: "string" },
  { id: "left", label: "left", kind: "string" },
  { id: "right", label: "right", kind: "string" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  const r = H.records(i.pairsJson);
  r.forEach((v) => {
    H.str(v.left);
    H.str(v.right);
    H.num(v.adjustment);
  });
  return H.finish({
    matches: r.flatMap((v, index) =>
      H.str(v.left) === i.left && H.str(v.right) === i.right
        ? [{ index, adjustment: H.num(v.adjustment) }]
        : [],
    ),
  });
};
export const example = {
  input: {
    pairsJson: '[{"left":"a","right":"b","adjustment":-1}]',
    left: "a",
    right: "b",
  },
  output: { result: { matches: [{ index: 0, adjustment: -1 }] } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "glyph/glyph-pair-adjustment-lookup",
  title: "Glyph Pair Adjustment Lookup",
  description:
    "Lookup every explicit pair-adjustment record for two glyph IDs, retaining conflicting duplicate values rather than assuming authoritative font kerning.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit bounded result", kind: "object" }],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
