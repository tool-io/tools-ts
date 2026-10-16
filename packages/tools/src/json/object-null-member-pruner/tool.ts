import type { ToolExecutionContext } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, parseJson, record } from "../batch53-shared.js";

export type Input = Readonly<{ objectJson: string }>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  { id: "objectJson", label: "Object json", kind: "string" },
] as const satisfies readonly SimpleField[];
const compute = (i: Input, context?: ToolExecutionContext) => {
  const r = record(parseJson(i.objectJson));
  return {
    object: Object.fromEntries(Object.entries(r).filter(([, v]) => v !== null)),
    removedKeys: Object.keys(r).filter((k) => r[k] === null),
  };
};
export const calculate = (i: Input, context?: ToolExecutionContext) => {
  validateInput(i, fields);
  return finish({ result: compute(i, context) });
};
export const example = {
  input: { objectJson: '{"a":null,"b":0}' },
  output: { result: { object: { b: 0 }, removedKeys: ["a"] } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "json/object-null-member-pruner",
  title: "Null Object Member Pruner",
  description:
    "Prune top-level own members whose JSON value is exactly null; do not recursively delete or treat falsy values as null.",
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
          object: {
            type: "object",
            additionalProperties: true,
            description:
              "Caller-owned JSON members retain arbitrary finite JSON values.",
          },
          removedKeys: { type: "array", items: { type: "string" } },
        },
        required: ["object", "removedKeys"],
      },
    },
  ],
  calculate: (v, context) => calculate(v as unknown as Input, context),
});
export const run = tool.execute;
export default tool;
