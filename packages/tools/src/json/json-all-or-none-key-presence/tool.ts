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
  groupKeys: readonly string[];
}>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  { id: "objectJson", label: "Object json", kind: "string" },
  { id: "groupKeys", label: "Group keys", kind: "stringList" },
] as const satisfies readonly SimpleField[];
const compute = (i: Input, context?: ToolExecutionContext) => {
  unique(i.groupKeys, "keys");
  const r = record(parseJson(i.objectJson)),
    present = i.groupKeys.filter((k) => Object.hasOwn(r, k));
  return {
    presentKeys: present,
    allOrNone: present.length === 0 || present.length === i.groupKeys.length,
  };
};
export const calculate = (i: Input, context?: ToolExecutionContext) => {
  validateInput(i, fields);
  return finish({ result: compute(i, context) });
};
export const example = {
  input: { objectJson: '{"a":1}', groupKeys: ["a", "b"] },
  output: { result: { presentKeys: ["a"], allOrNone: false } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "json/json-all-or-none-key-presence",
  title: "JSON All Or None Key Presence Check",
  description:
    "Check all-or-none own member presence for an explicit key group; absent versus null is preserved.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculation or explicitly qualified evidence",
      kind: "object",

      schema: {
        type: "object",
        additionalProperties: false,
        properties: {
          presentKeys: { type: "array", items: { type: "string" } },
          allOrNone: { type: "boolean" },
        },
        required: ["presentKeys", "allOrNone"],
      },
    },
  ],
  calculate: (v, context) => calculate(v as unknown as Input, context),
});
export const run = tool.execute;
export default tool;
