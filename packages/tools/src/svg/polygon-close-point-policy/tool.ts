import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../binary/batch54-shared.js";
export type Input = Readonly<{
  points: readonly (readonly number[])[];
  close: boolean;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "points", kind: "matrix", label: "points" },
  { id: "close", kind: "boolean", label: "close" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.check(i.points.every((r) => r.length === 2));
  const p = i.points.map((r) => [...r]);
  const same =
    p.length > 1 && p[0][0] === p.at(-1)![0] && p[0][1] === p.at(-1)![1];
  if (i.close && !same && p.length) p.push([...p[0]]);
  if (!i.close && same) p.pop();
  return H.finish({ points: p, initiallyClosed: same });
};
export const example = {
  input: {
    points: [
      [0, 0],
      [1, 0],
      [0, 0],
    ],
    close: false,
  },
  output: {
    result: {
      points: [
        [0, 0],
        [1, 0],
      ],
      initiallyClosed: true,
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "svg/polygon-close-point-policy",
  title: "Polygon Close Point Policy",
  description:
    "Add or remove one exact repeated endpoint under an explicit polygon closure policy; no geometric simplification.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit result", kind: "object" }],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
