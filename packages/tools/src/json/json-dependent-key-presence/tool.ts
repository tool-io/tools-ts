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
  triggerKey: string;
  requiredKeys: readonly string[];
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "objectJson", label: "Object json", kind: "string" },
  { id: "triggerKey", label: "Trigger key", kind: "string" },
  { id: "requiredKeys", label: "Required keys", kind: "stringList" },
] as const satisfies readonly SimpleField[];
const compute = (
  i: Input,
  context?: ToolExecutionContext,
): Readonly<Record<string, unknown>> => {
  unique(i.requiredKeys, "keys");
  const r = record(parseJson(i.objectJson)),
    triggerPresent = Object.hasOwn(r, i.triggerKey),
    missing = i.requiredKeys.filter((k) => !Object.hasOwn(r, k));
  return {
    triggerPresent,
    missingRequiredKeys: triggerPresent ? missing : [],
    passes: !triggerPresent || missing.length === 0,
  };
};
export const calculate = (i: Input, context?: ToolExecutionContext): Output => {
  validateInput(i, fields);
  return finish({ result: compute(i, context) });
};
export const example = {
  input: { objectJson: '{"a":null}', triggerKey: "a", requiredKeys: ["b"] },
  output: {
    result: { triggerPresent: true, missingRequiredKeys: ["b"], passes: false },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "json/json-dependent-key-presence",
  title: "JSON Dependent Key Presence Check",
  description:
    "Audit own-member dependencies when a trigger exists, including a null trigger value; do not infer semantic value requirements.",
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
