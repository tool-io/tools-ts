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
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "aStart", label: "A start", kind: "number" },
  { id: "aEnd", label: "A end", kind: "number" },
  { id: "bStart", label: "B start", kind: "number" },
  { id: "bEnd", label: "B end", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (
  i: Input,
  context?: ToolExecutionContext,
): Readonly<Record<string, unknown>> => {
  orderedPair(i.aStart, i.aEnd, true);
  orderedPair(i.bStart, i.bEnd, true);
  return {
    aContainsB: i.aStart <= i.bStart && i.aEnd >= i.bEnd,
    bContainsA: i.bStart <= i.aStart && i.bEnd >= i.aEnd,
    equal: i.aStart === i.bStart && i.aEnd === i.bEnd,
  };
};
export const calculate = (i: Input, context?: ToolExecutionContext): Output => {
  validateInput(i, fields);
  return finish({ result: compute(i, context) });
};
export const example = {
  input: { aStart: 0, aEnd: 4, bStart: 1, bEnd: 3 },
  output: { result: { aContainsB: true, bContainsA: false, equal: false } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "interval/interval-containment-classifier",
  title: "Interval Containment Classifier",
  description:
    "Classify containment and equality of nonempty half-open intervals without conflating partial overlap with containment.",
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
