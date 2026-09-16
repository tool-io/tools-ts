import type { ToolExecutionContext } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, bounded, mod } from "../batch53-shared.js";

export type Input = Readonly<{ index: number; length: number }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "index", label: "Index", kind: "number" },
  { id: "length", label: "Length", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (
  i: Input,
  context?: ToolExecutionContext,
): Readonly<Record<string, unknown>> => {
  bounded(i.index, "index", -Number.MAX_SAFE_INTEGER, Number.MAX_SAFE_INTEGER);
  bounded(i.length, "length", 1, 1e9);
  return { normalizedIndex: mod(i.index, i.length) };
};
export const calculate = (i: Input, context?: ToolExecutionContext): Output => {
  validateInput(i, fields);
  return finish({ result: compute(i, context) });
};
export const example = {
  input: { index: -1, length: 5 },
  output: { result: { normalizedIndex: 4 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "list/cyclic-index-normalizer",
  title: "Cyclic Index Normalizer",
  description:
    "Normalize a signed integer index cyclically into a nonempty list; no negative-index clamping.",
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
