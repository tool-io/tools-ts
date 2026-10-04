import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../core/batch59-shared.js";
export type Input = Readonly<{
  firstLines: readonly number[];
  secondLines: readonly number[];
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "firstLines", label: "First lines", kind: "numberList" },
  { id: "secondLines", label: "Second lines", kind: "numberList" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.check(i.firstLines.length === 6 && i.secondLines.length === 6);
  [...i.firstLines, ...i.secondLines].forEach((x) => H.int(x, 0, 1));
  const positions = i.firstLines.flatMap((x, j) =>
    x !== i.secondLines[j] ? [j + 1] : [],
  );
  return H.finish({
    differingPositions: positions,
    minimumFlips: positions.length,
  });
};
export const example = {
  input: { firstLines: [0, 0, 0, 0, 0, 0], secondLines: [1, 0, 0, 0, 0, 1] },
  output: { result: { differingPositions: [1, 6], minimumFlips: 2 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "yijing/hexagram-change-distance",
  title: "Yijing Hexagram Line-Change Distance Calculator",
  description:
    "List exact bottom-counted differing line positions and their minimum independent flip count between two six-line figures.",
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
          differingPositions: { type: "array", items: { type: "number" } },
          minimumFlips: { type: "number" },
        },
        required: ["differingPositions", "minimumFlips"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
