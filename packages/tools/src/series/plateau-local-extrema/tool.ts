import type { ToolExecutionContext } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, runs } from "../batch53-shared.js";

export type Input = Readonly<{ values: readonly number[] }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "values", label: "Values", kind: "numberList" },
] as const satisfies readonly SimpleField[];
const compute = (
  i: Input,
  context?: ToolExecutionContext,
): Readonly<Record<string, unknown>> => {
  const a = runs(i.values);
  return {
    extrema: a.flatMap((r, j) => {
      if (j === 0 || j === a.length - 1) return [];
      const l = a[j - 1].value,
        h = a[j + 1].value,
        kind =
          r.value > l && r.value > h
            ? "maximum"
            : r.value < l && r.value < h
              ? "minimum"
              : "none";
      return kind === "none"
        ? []
        : [{ start: r.start, end: r.end, value: r.value, kind }];
    }),
  };
};
export const calculate = (i: Input, context?: ToolExecutionContext): Output => {
  validateInput(i, fields);
  return finish({ result: compute(i, context) });
};
export const example = {
  input: { values: [0, 2, 2, 0, -1, -1, 0] },
  output: {
    result: {
      extrema: [
        { start: 1, end: 3, value: 2, kind: "maximum" },
        { start: 4, end: 6, value: -1, kind: "minimum" },
      ],
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "series/plateau-local-extrema",
  title: "Plateau Local Extrema Finder",
  description:
    "Find interior plateau extrema with complete half-open spans; endpoint plateaus are not declared local extrema.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculation or explicitly qualified evidence",
      kind: "object",
    },
  ],
  calculate: (v, context) => calculate(v as unknown as Input, context),
});
export const run = tool.execute;
export default tool;
