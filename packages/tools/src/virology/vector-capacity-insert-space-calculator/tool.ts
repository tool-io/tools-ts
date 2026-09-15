import type { ToolExecutionContext } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
} from "../batch53-shared.js";

export type Input = Readonly<{
  capacityKb: number;
  existingBackboneKb: number;
  insertKb: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "capacityKb", label: "Capacity kb", kind: "number" },
  { id: "existingBackboneKb", label: "Existing backbone kb", kind: "number" },
  { id: "insertKb", label: "Insert kb", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (
  i: Input,
  context?: ToolExecutionContext,
): Readonly<Record<string, unknown>> => {
  positive(i.capacityKb, "capacity");
  nonnegative(i.existingBackboneKb, "backbone");
  nonnegative(i.insertKb, "insert");
  return {
    remainingKb: i.capacityKb - i.existingBackboneKb - i.insertKb,
    withinSuppliedCapacity: i.existingBackboneKb + i.insertKb <= i.capacityKb,
  };
};
export const calculate = (i: Input, context?: ToolExecutionContext): Output => {
  validateInput(i, fields);
  return finish({ result: compute(i, context) });
};
export const example = {
  input: { capacityKb: 10, existingBackboneKb: 4, insertKb: 3 },
  output: { result: { remainingKb: 3, withinSuppliedCapacity: true } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "virology/vector-capacity-insert-space-calculator",
  title: "Vector Genome Capacity kb Insert Size Remaining Space Calculator",
  description:
    "Compute signed remaining vector packaging space under caller capacity; no universal vector limit or biological packaging guarantee.",
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
