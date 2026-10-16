import type { ToolExecutionContext } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, parseJson, record } from "../batch53-shared.js";

export type Input = Readonly<{ objectJson: string; prefix: string }>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  { id: "objectJson", label: "Object json", kind: "string" },
  { id: "prefix", label: "Prefix", kind: "string" },
] as const satisfies readonly SimpleField[];
const compute = (i: Input, context?: ToolExecutionContext) => {
  const r = record(parseJson(i.objectJson)),
    a = Object.entries(r);
  return {
    matching: Object.fromEntries(a.filter(([k]) => k.startsWith(i.prefix))),
    other: Object.fromEntries(a.filter(([k]) => !k.startsWith(i.prefix))),
  };
};
export const calculate = (i: Input, context?: ToolExecutionContext) => {
  validateInput(i, fields);
  return finish({ result: compute(i, context) });
};
export const example = {
  input: { objectJson: '{"ab":1,"b":2}', prefix: "a" },
  output: { result: { matching: { ab: 1 }, other: { b: 2 } } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "json/object-key-prefix-partitioner",
  title: "Object Key Prefix Partitioner",
  description:
    "Partition own JSON object members by exact literal key prefix; does not strip prefixes or interpret patterns.",
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
          matching: {
            type: "object",
            additionalProperties: true,
            description:
              "Caller-owned JSON members retain arbitrary finite JSON values.",
          },
          other: {
            type: "object",
            additionalProperties: true,
            description:
              "Caller-owned JSON members retain arbitrary finite JSON values.",
          },
        },
        required: ["matching", "other"],
      },
    },
  ],
  calculate: (v, context) => calculate(v as unknown as Input, context),
});
export const run = tool.execute;
export default tool;
