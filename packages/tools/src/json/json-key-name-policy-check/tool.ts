import type { ToolExecutionContext } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  parseJson,
  jsonNodes,
} from "../batch53-shared.js";

export type Input = Readonly<{
  documentJson: string;
  allowedKeys: readonly string[];
}>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  { id: "documentJson", label: "Document json", kind: "string" },
  { id: "allowedKeys", label: "Allowed keys", kind: "stringList" },
] as const satisfies readonly SimpleField[];
const compute = (i: Input, context?: ToolExecutionContext) => {
  return {
    violations: jsonNodes(parseJson(i.documentJson))
      .filter(
        (v) =>
          v.value !== null &&
          typeof v.value === "object" &&
          !Array.isArray(v.value),
      )
      .flatMap((v) =>
        Object.keys(v.value as object)
          .filter((k) => !i.allowedKeys.includes(k))
          .map((key) => ({ objectPath: v.path, key })),
      ),
  };
};
export const calculate = (i: Input, context?: ToolExecutionContext) => {
  validateInput(i, fields);
  return finish({ result: compute(i, context) });
};
export const example = {
  input: { documentJson: '{"a":{"b":1}}', allowedKeys: ["a"] },
  output: { result: { violations: [{ objectPath: "/a", key: "b" }] } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "json/json-key-name-policy-check",
  title: "JSON Key Name Policy Check",
  description:
    "Audit exact own JSON object member names against a caller allowlist at every object; array indexes are not object-key violations.",
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
          violations: {
            type: "array",
            items: {
              type: "object",
              additionalProperties: false,
              properties: {
                objectPath: { type: "string" },
                key: { type: "string" },
              },
              required: ["objectPath", "key"],
            },
          },
        },
        required: ["violations"],
      },
    },
  ],
  calculate: (v, context) => calculate(v as unknown as Input, context),
});
export const run = tool.execute;
export default tool;
