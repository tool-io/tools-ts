import type { ToolExecutionContext } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, orderedPair } from "../batch53-shared.js";

export type Input = Readonly<{ start: number; end: number }>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  { id: "start", label: "Start", kind: "number" },
  { id: "end", label: "End", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (i: Input, context?: ToolExecutionContext) => {
  orderedPair(i.start, i.end);
  return { midpoint: i.start / 2 + i.end / 2, radius: i.end / 2 - i.start / 2 };
};
export const calculate = (i: Input, context?: ToolExecutionContext) => {
  validateInput(i, fields);
  return finish({ result: compute(i, context) });
};
export const example = {
  input: { start: 2, end: 6 },
  output: { result: { midpoint: 4, radius: 2 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "interval/interval-midpoint-radius",
  title: "Interval Midpoint and Radius",
  description:
    "Compute midpoint and radius of a finite ordered interval using overflow-resistant endpoint halving.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculation or explicitly qualified evidence",
      kind: "object",

      schema: {
        type: "object",
        additionalProperties: false,
        properties: {
          midpoint: { type: "number" },
          radius: { type: "number" },
        },
        required: ["midpoint", "radius"],
      },
    },
  ],
  calculate: (v, context) => calculate(v as unknown as Input, context),
});
export const run = tool.execute;
export default tool;
