import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../core/batch59-shared.js";
export type Input = Readonly<{
  knots: readonly number[];
  x: number;
  tieSide: string;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "knots", label: "Knots", kind: "numberList" },
  { id: "x", label: "X", kind: "number" },
  { id: "tieSide", label: "Tie side", kind: "string", enum: ["left", "right"] },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.check(
    i.knots.length >= 2 && i.knots.every((x, j) => !j || x > i.knots[j - 1]),
  );
  H.choice(i.tieSide, ["left", "right"]);
  let index = -1;
  if (i.x >= i.knots[0] && i.x <= i.knots[i.knots.length - 1]) {
    index =
      i.x === i.knots[i.knots.length - 1]
        ? i.knots.length - 2
        : Math.max(
            0,
            i.knots.findIndex(
              (x, j) => j > 0 && (i.tieSide === "left" ? x >= i.x : x > i.x),
            ) - 1,
          );
  }
  return H.finish({
    intervalIndex: index,
    outside: i.x < i.knots[0] || i.x > i.knots[i.knots.length - 1],
  });
};
export const example = {
  input: { knots: [0, 1, 2], x: 1, tieSide: "right" },
  output: { result: { intervalIndex: 1, outside: false } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "interpolation/piecewise-knot-side-selection",
  title: "Interpolation: Piecewise Knot Side Selection Tool",
  description:
    "Select a piecewise interval at one sorted distinct knot grid with explicit left/right interior-knot tie convention; exterior points return index -1.",
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
          intervalIndex: { type: "number" },
          outside: { type: "boolean" },
        },
        required: ["intervalIndex", "outside"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
