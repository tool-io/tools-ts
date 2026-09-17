import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../binary/batch54-shared.js";
export type Input = Readonly<{ left: string; right: string }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "left", kind: "string", label: "left" },
  { id: "right", kind: "string", label: "right" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.check(i.left.length <= 128 && i.right.length <= 128);
  return H.finish({
    indexes:
      i.right.length === i.left.length + 1
        ? i.right
            .split("")
            .flatMap((_, j) =>
              i.right.slice(0, j) + i.right.slice(j + 1) === i.left ? [j] : [],
            )
        : [],
  });
};
export const example = {
  input: { left: "ab", right: "aab" },
  output: { result: { indexes: [0, 1] } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "string/single-insertion-witness",
  title: "Single Insertion Witness",
  description:
    "Return all insertion positions in the right string witnessing exactly one inserted UTF-16 unit from the left; repeated-unit ambiguities are retained.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit result", kind: "object" }],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
