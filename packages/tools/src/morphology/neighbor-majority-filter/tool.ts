import type { ToolExecutionContext } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../histogram/batch56-shared.js";
export type Input = Readonly<{
  mask: readonly (readonly number[])[];
  includeCenter: boolean;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "mask", label: "mask", kind: "matrix" },
  { id: "includeCenter", label: "includeCenter", kind: "boolean" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.mask(i.mask);
  return H.finish({
    mask: i.mask.map((row, y) =>
      row.map((_, x) => {
        let ones = 0;
        const count = i.includeCenter ? 9 : 8;
        for (let dy = -1; dy <= 1; dy++)
          for (let dx = -1; dx <= 1; dx++)
            if (i.includeCenter || dy || dx)
              ones += i.mask[y + dy]?.[x + dx] ?? 0;
        return Number(ones > count / 2);
      }),
    ),
  });
};
export const example = {
  input: {
    mask: [
      [0, 0, 0],
      [0, 1, 0],
      [0, 0, 0],
    ],
    includeCenter: true,
  },
  output: {
    result: {
      mask: [
        [0, 0, 0],
        [0, 0, 0],
        [0, 0, 0],
      ],
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "morphology/neighbor-majority-filter",
  title: "Binary Mask Neighbor Majority Filter",
  description:
    "Apply a strict local 3x3 majority filter with explicit center inclusion; outside zeros participate in fixed neighbor count and ties become zero.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit bounded result", kind: "object" }],
  calculate: (v, context) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
