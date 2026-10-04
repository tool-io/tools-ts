import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../core/batch59-shared.js";
export type Input = Readonly<{
  lines: readonly number[];
  changingPositions: readonly number[];
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "lines", label: "Lines", kind: "numberList" },
  { id: "changingPositions", label: "Changing positions", kind: "numberList" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.check(i.lines.length === 6);
  i.lines.forEach((x) => H.int(x, 0, 1));
  H.check(new Set(i.changingPositions).size === i.changingPositions.length);
  i.changingPositions.forEach((x) => H.int(x, 1, 6));
  const relating = i.lines.map((x, j) =>
    i.changingPositions.includes(j + 1) ? 1 - x : x,
  );
  return H.finish({ primaryLines: i.lines, relatingLines: relating });
};
export const example = {
  input: { lines: [0, 0, 0, 0, 0, 0], changingPositions: [1, 6] },
  output: {
    result: {
      primaryLines: [0, 0, 0, 0, 0, 0],
      relatingLines: [1, 0, 0, 0, 0, 1],
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "yijing/changing-lines-transform",
  title: "Yijing Changing-Line Transformation Calculator",
  description:
    "Flip explicitly selected unique one-based Yijing line positions counted from the bottom; returns both figures without divinatory interpretation.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculated result",
      kind: "object",
      schema: {
        type: "object",
        additionalProperties: false,
        properties: {
          primaryLines: { type: "array", items: { type: "number" } },
          relatingLines: { type: "array", items: { type: "number" } },
        },
        required: ["primaryLines", "relatingLines"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
