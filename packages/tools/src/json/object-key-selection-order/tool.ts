import type { ToolExecutionContext } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  unique,
  parseJson,
  record,
} from "../batch53-shared.js";

export type Input = Readonly<{
  objectJson: string;
  orderedKeys: readonly string[];
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "objectJson", label: "Object json", kind: "string" },
  { id: "orderedKeys", label: "Ordered keys", kind: "stringList" },
] as const satisfies readonly SimpleField[];
const compute = (
  i: Input,
  context?: ToolExecutionContext,
): Readonly<Record<string, unknown>> => {
  const r = record(parseJson(i.objectJson));
  unique(i.orderedKeys, "keys");
  return {
    entries: i.orderedKeys.flatMap((k) =>
      Object.hasOwn(r, k) ? [{ key: k, value: r[k] }] : [],
    ),
    missingKeys: i.orderedKeys.filter((k) => !Object.hasOwn(r, k)),
  };
};
export const calculate = (i: Input, context?: ToolExecutionContext): Output => {
  validateInput(i, fields);
  return finish({ result: compute(i, context) });
};
export const example = {
  input: { objectJson: '{"b":2,"a":1}', orderedKeys: ["a", "x", "b"] },
  output: {
    result: {
      entries: [
        { key: "a", value: 1 },
        { key: "b", value: 2 },
      ],
      missingKeys: ["x"],
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "json/object-key-selection-order",
  title: "Ordered Object Key Selector",
  description:
    "Select own object members in explicit order as entries, avoiding JavaScript integer-key reorder ambiguity; report absent names separately.",
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
