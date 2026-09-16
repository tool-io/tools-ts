import type { ToolExecutionContext } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  simpleError,
  unique,
  parseJson,
  record,
} from "../batch53-shared.js";

export type Input = Readonly<{
  objectJson: string;
  oldKeys: readonly string[];
  newKeys: readonly string[];
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "objectJson", label: "Object json", kind: "string" },
  { id: "oldKeys", label: "Old keys", kind: "stringList" },
  { id: "newKeys", label: "New keys", kind: "stringList" },
] as const satisfies readonly SimpleField[];
const compute = (
  i: Input,
  context?: ToolExecutionContext,
): Readonly<Record<string, unknown>> => {
  const r = record(parseJson(i.objectJson));
  if (i.oldKeys.length !== i.newKeys.length)
    simpleError("keys", "Aligned rename map.");
  unique(i.oldKeys, "old");
  const out = Object.entries(r).map(
    ([k, v]) =>
      [i.oldKeys.includes(k) ? i.newKeys[i.oldKeys.indexOf(k)] : k, v] as const,
  );
  unique(
    out.map(([k]) => k),
    "target-key",
  );
  return { object: Object.fromEntries(out) };
};
export const calculate = (i: Input, context?: ToolExecutionContext): Output => {
  validateInput(i, fields);
  return finish({ result: compute(i, context) });
};
export const example = {
  input: { objectJson: '{"a":1,"b":2}', oldKeys: ["a"], newKeys: ["x"] },
  output: { result: { object: { x: 1, b: 2 } } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "json/object-key-rename-map",
  title: "Object Key Rename Map",
  description:
    "Simultaneously rename own JSON object keys from an explicit map; reject collisions with renamed or untouched keys.",
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
