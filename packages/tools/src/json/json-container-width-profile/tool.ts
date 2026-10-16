import type { ToolExecutionContext } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  parseJson,
  typeOf,
  jsonNodes,
} from "../batch53-shared.js";

export type Input = Readonly<{ documentJson: string }>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  { id: "documentJson", label: "Document json", kind: "string" },
] as const satisfies readonly SimpleField[];
const compute = (i: Input, context?: ToolExecutionContext) => {
  return {
    containers: jsonNodes(parseJson(i.documentJson))
      .filter((v) => v.value !== null && typeof v.value === "object")
      .map((v) => ({
        path: v.path,
        type: typeOf(v.value),
        width: Object.keys(v.value as object).length,
      })),
  };
};
export const calculate = (i: Input, context?: ToolExecutionContext) => {
  validateInput(i, fields);
  return finish({ result: compute(i, context) });
};
export const example = {
  input: { documentJson: '{"a":[]}' },
  output: {
    result: {
      containers: [
        { path: "", type: "object", width: 1 },
        { path: "/a", type: "array", width: 0 },
      ],
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "json/json-container-width-profile",
  title: "JSON Container Width Profile",
  description:
    "Profile immediate child counts of all JSON containers, retaining empty arrays and objects.",
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
          containers: {
            type: "array",
            items: {
              type: "object",
              additionalProperties: false,
              properties: {
                path: { type: "string" },
                type: { type: "string" },
                width: { type: "number" },
              },
              required: ["path", "type", "width"],
            },
          },
        },
        required: ["containers"],
      },
    },
  ],
  calculate: (v, context) => calculate(v as unknown as Input, context),
});
export const run = tool.execute;
export default tool;
