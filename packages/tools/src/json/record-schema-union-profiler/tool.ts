import type { ToolExecutionContext } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, records, typeOf } from "../batch53-shared.js";

export type Input = Readonly<{ recordsJson: string }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "recordsJson", label: "Records json", kind: "string" },
] as const satisfies readonly SimpleField[];
const compute = (
  i: Input,
  context?: ToolExecutionContext,
): Readonly<Record<string, unknown>> => {
  const a = records(i.recordsJson),
    keys = [...new Set(a.flatMap(Object.keys))];
  return {
    fields: keys.map((key) => ({
      key,
      presentCount: a.filter((r) => Object.hasOwn(r, key)).length,
      types: [
        ...new Set(
          a.filter((r) => Object.hasOwn(r, key)).map((r) => typeOf(r[key])),
        ),
      ],
    })),
  };
};
export const calculate = (i: Input, context?: ToolExecutionContext): Output => {
  validateInput(i, fields);
  return finish({ result: compute(i, context) });
};
export const example = {
  input: { recordsJson: '[{"a":1},{"a":null,"b":"x"}]' },
  output: {
    result: {
      fields: [
        { key: "a", presentCount: 2, types: ["number", "null"] },
        { key: "b", presentCount: 1, types: ["string"] },
      ],
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "json/record-schema-union-profiler",
  title: "Record Field Union Profiler",
  description:
    "Profile first-seen record field union, presence counts and observed top-level types; no inferred required schema.",
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
