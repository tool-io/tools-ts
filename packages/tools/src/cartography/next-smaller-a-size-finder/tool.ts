import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, bounded } from "../batch52-shared.js";
export type Input = Readonly<{ readonly aSeriesIndex: number }>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  { id: "aSeriesIndex", label: "A series index", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (i: Input) => {
  bounded(i.aSeriesIndex, "index", 0, 9);
  return { nextSize: "A" + (i.aSeriesIndex + 1) };
};
export const calculate = (i: Input) => {
  validateInput(i, fields);
  return finish({ result: compute(i) });
};
export const example = {
  input: { aSeriesIndex: 4 },
  output: { result: { nextSize: "A5" } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "cartography/next-smaller-a-size-finder",
  title: "Next Smaller A Paper Size Finder",
  description:
    "ISO 216 A-series neighboring size A0–A10; no oversize 2A0 inferred.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculation or explicitly qualified result",
      kind: "object",

      schema: {
        type: "object",
        additionalProperties: false,
        properties: { nextSize: { type: "string" } },
        required: ["nextSize"],
      },
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
