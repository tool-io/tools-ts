import type { ToolExecutionContext } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, parseJson, record } from "../batch53-shared.js";

export type Input = Readonly<{ objectJson: string; defaultsJson: string }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "objectJson", label: "Object json", kind: "string" },
  { id: "defaultsJson", label: "Defaults json", kind: "string" },
] as const satisfies readonly SimpleField[];
const compute = (
  i: Input,
  context?: ToolExecutionContext,
): Readonly<Record<string, unknown>> => {
  const r = record(parseJson(i.objectJson)),
    d = record(parseJson(i.defaultsJson));
  return {
    object: Object.fromEntries([
      ...Object.entries(r),
      ...Object.entries(d).filter(([k]) => !Object.hasOwn(r, k)),
    ]),
    filledKeys: Object.keys(d).filter((k) => !Object.hasOwn(r, k)),
  };
};
export const calculate = (i: Input, context?: ToolExecutionContext): Output => {
  validateInput(i, fields);
  return finish({ result: compute(i, context) });
};
export const example = {
  input: { objectJson: '{"a":null}', defaultsJson: '{"a":1,"b":2}' },
  output: { result: { object: { a: null, b: 2 }, filledKeys: ["b"] } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "json/object-default-fill-missing",
  title: "Missing Object Member Default Filler",
  description:
    "Fill only absent own JSON members from defaults; existing null, false, zero and empty strings are preserved.",
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
