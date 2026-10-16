import type { ToolExecutionContext } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, orderedPair } from "../batch53-shared.js";

export type Input = Readonly<{
  aStart: number;
  aEnd: number;
  bStart: number;
  bEnd: number;
}>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  { id: "aStart", label: "A start", kind: "number" },
  { id: "aEnd", label: "A end", kind: "number" },
  { id: "bStart", label: "B start", kind: "number" },
  { id: "bEnd", label: "B end", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (i: Input, context?: ToolExecutionContext) => {
  orderedPair(i.aStart, i.aEnd, true);
  orderedPair(i.bStart, i.bEnd, true);
  return {
    infimumDistance: Math.max(0, i.bStart - i.aEnd, i.aStart - i.bEnd),
    attainedOverlap: Math.max(i.aStart, i.bStart) < Math.min(i.aEnd, i.bEnd),
  };
};
export const calculate = (i: Input, context?: ToolExecutionContext) => {
  validateInput(i, fields);
  return finish({ result: compute(i, context) });
};
export const example = {
  input: { aStart: 0, aEnd: 2, bStart: 2, bEnd: 3 },
  output: { result: { infimumDistance: 0, attainedOverlap: false } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "interval/half-open-distance",
  title: "Half Open Interval Distance",
  description:
    "Compute infimum distance between nonempty half-open intervals and distinguish zero-distance touching from attained overlap.",
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
          infimumDistance: { type: "number" },
          attainedOverlap: { type: "boolean" },
        },
        required: ["infimumDistance", "attainedOverlap"],
      },
    },
  ],
  calculate: (v, context) => calculate(v as unknown as Input, context),
});
export const run = tool.execute;
export default tool;
