import type { ToolExecutionContext } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, binary } from "../batch53-shared.js";

export type Input = Readonly<{ present: readonly number[] }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "present", label: "Present", kind: "numberList" },
] as const satisfies readonly SimpleField[];
const compute = (
  i: Input,
  context?: ToolExecutionContext,
): Readonly<Record<string, unknown>> => {
  binary(i.present, "present");
  const known = i.present.flatMap((v, j) => (v ? [j] : []));
  return {
    sourceIndexes: i.present.map((_, j) => {
      const candidates = known.filter((k) => k >= j);
      candidates.sort((a, b) => Math.abs(a - j) - Math.abs(b - j) || a - b);
      return candidates[0] ?? null;
    }),
  };
};
export const calculate = (i: Input, context?: ToolExecutionContext): Output => {
  validateInput(i, fields);
  return finish({ result: compute(i, context) });
};
export const example = {
  input: { present: [0, 1, 0, 0, 1] },
  output: { result: { sourceIndexes: [1, 1, 4, 4, 4] } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "list/backward-fill-source-indexes",
  title: "Backward Fill Source Indexes",
  description:
    "Map backward fill source indexes from explicit binary knownness; missing sources are null and nearest-distance ties prefer the earlier index.",
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
