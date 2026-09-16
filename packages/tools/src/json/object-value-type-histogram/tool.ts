import type { ToolExecutionContext } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  parseJson,
  record,
  typeOf,
} from "../batch53-shared.js";

export type Input = Readonly<{ objectJson: string }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "objectJson", label: "Object json", kind: "string" },
] as const satisfies readonly SimpleField[];
const compute = (
  i: Input,
  context?: ToolExecutionContext,
): Readonly<Record<string, unknown>> => {
  const a = Object.values(record(parseJson(i.objectJson))),
    m = new Map<string, number>();
  a.forEach((v) => m.set(typeOf(v), (m.get(typeOf(v)) ?? 0) + 1));
  return { histogram: Object.fromEntries(m) };
};
export const calculate = (i: Input, context?: ToolExecutionContext): Output => {
  validateInput(i, fields);
  return finish({ result: compute(i, context) });
};
export const example = {
  input: { objectJson: '{"a":1,"b":null,"c":[]}' },
  output: { result: { histogram: { number: 1, null: 1, array: 1 } } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "json/object-value-type-histogram",
  title: "Object Value Type Histogram",
  description:
    "Histogram top-level own JSON value types, distinguishing null, arrays and objects without recursive leaf counting.",
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
