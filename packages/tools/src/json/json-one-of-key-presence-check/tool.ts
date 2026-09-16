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
  candidateKeys: readonly string[];
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "objectJson", label: "Object json", kind: "string" },
  { id: "candidateKeys", label: "Candidate keys", kind: "stringList" },
] as const satisfies readonly SimpleField[];
const compute = (
  i: Input,
  context?: ToolExecutionContext,
): Readonly<Record<string, unknown>> => {
  unique(i.candidateKeys, "keys");
  const r = record(parseJson(i.objectJson)),
    present = i.candidateKeys.filter((k) => Object.hasOwn(r, k));
  return { presentKeys: present, exactlyOnePresent: present.length === 1 };
};
export const calculate = (i: Input, context?: ToolExecutionContext): Output => {
  validateInput(i, fields);
  return finish({ result: compute(i, context) });
};
export const example = {
  input: { objectJson: '{"a":null}', candidateKeys: ["a", "b"] },
  output: { result: { presentKeys: ["a"], exactlyOnePresent: true } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "json/json-one-of-key-presence-check",
  title: "JSON One Of Key Presence Check",
  description:
    "Check exactly-one own member presence across an explicit unique group; null values still count as present.",
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
