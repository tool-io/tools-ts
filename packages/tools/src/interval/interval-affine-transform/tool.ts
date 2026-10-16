import type { ToolExecutionContext } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, orderedPair } from "../batch53-shared.js";

export type Input = Readonly<{
  start: number;
  end: number;
  scale: number;
  shift: number;
}>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  { id: "start", label: "Start", kind: "number" },
  { id: "end", label: "End", kind: "number" },
  { id: "scale", label: "Scale", kind: "number" },
  { id: "shift", label: "Shift", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (i: Input, context?: ToolExecutionContext) => {
  orderedPair(i.start, i.end);
  const a = i.scale * i.start + i.shift,
    b = i.scale * i.end + i.shift;
  return {
    start: Math.min(a, b),
    end: Math.max(a, b),
    orientationReversed: i.scale < 0,
  };
};
export const calculate = (i: Input, context?: ToolExecutionContext) => {
  validateInput(i, fields);
  return finish({ result: compute(i, context) });
};
export const example = {
  input: { start: 1, end: 3, scale: -2, shift: 1 },
  output: { result: { start: -5, end: -1, orientationReversed: true } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "interval/interval-affine-transform",
  title: "Interval Affine Transform",
  description:
    "Affine-transform interval endpoints, reorder the image bounds and retain negative-scale orientation reversal.",
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
          start: { type: "number" },
          end: { type: "number" },
          orientationReversed: { type: "boolean" },
        },
        required: ["start", "end", "orientationReversed"],
      },
    },
  ],
  calculate: (v, context) => calculate(v as unknown as Input, context),
});
export const run = tool.execute;
export default tool;
