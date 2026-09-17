import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../css/batch55-shared.js";
export type Input = Readonly<{ rows: readonly string[] }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "rows", label: "rows", kind: "stringList" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  const cells = i.rows.map((s) => s.trim().split(/\s+/));
  H.check(
    cells.length > 0 &&
      cells.every(
        (r) =>
          r.length === cells[0].length &&
          r.every((x) => /^(?:\.|[A-Za-z_][A-Za-z0-9_-]*)(?![\s\S])/.test(x)),
      ),
  );
  return H.finish({
    areas: H.unique(cells.flat().filter((x) => x !== ".")).map((name) => {
      const points = cells.flatMap((r, y) =>
          r.flatMap((v, x) => (v === name ? [[x, y]] : [])),
        ),
        xs = points.map((p) => p[0]),
        ys = points.map((p) => p[1]),
        x = Math.min(...xs),
        y = Math.min(...ys),
        width = Math.max(...xs) - x + 1,
        height = Math.max(...ys) - y + 1;
      return {
        name,
        x,
        y,
        width,
        height,
        rectangular: points.length === width * height,
      };
    }),
  });
};
export const example = {
  input: { rows: ["a a .", "a a b"] },
  output: {
    result: {
      areas: [
        { name: "a", x: 0, y: 0, width: 2, height: 2, rectangular: true },
        { name: "b", x: 2, y: 1, width: 1, height: 1, rectangular: true },
      ],
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "css/grid-area-rectangle-validity",
  title: "CSS Grid Area Rectangle Validity",
  description:
    "Audit supplied nonempty whitespace-tokenized grid template area rows for rectangular named regions; dot means empty, not a complete CSS string/token parser.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit bounded result", kind: "object" }],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
