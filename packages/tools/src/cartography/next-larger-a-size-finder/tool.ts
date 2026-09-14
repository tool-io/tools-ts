import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, bounded } from "../batch52-shared.js";
export type Input = Readonly<{ readonly aSeriesIndex: number }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "aSeriesIndex", label: "A series index", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (i: Input): Readonly<Record<string, unknown>> => {
  bounded(i.aSeriesIndex, "index", 1, 10);
  return { nextSize: "A" + (i.aSeriesIndex - 1) };
};
export const calculate = (i: Input): Output => {
  validateInput(i, fields);
  return finish({ result: compute(i) });
};
export const example = {
  input: { aSeriesIndex: 4 },
  output: { result: { nextSize: "A3" } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "cartography/next-larger-a-size-finder",
  title: "Next Larger A Paper Size Finder",
  description:
    "ISO 216 A-series neighboring size A0–A10; no oversize 2A0 inferred.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculation or explicitly qualified result",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
