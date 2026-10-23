import type { ToolExecutionContext } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, queryPairs } from "../batch53-shared.js";

export type Input = Readonly<{ query: string }>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  { id: "query", label: "Query", kind: "string" },
] as const satisfies readonly SimpleField[];
const compute = (i: Input, context?: ToolExecutionContext) => {
  return { pairs: queryPairs(i.query) };
};
export const calculate = (i: Input, context?: ToolExecutionContext) => {
  validateInput(i, fields);
  return finish({ result: compute(i, context) });
};
export const example = {
  input: { query: "?a=1&a=two+words" },
  output: {
    result: {
      pairs: [
        { index: 0, name: "a", value: "1", raw: "a=1" },
        { index: 1, name: "a", value: "two words", raw: "a=two+words" },
      ],
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "web/url-query-pair-order-table",
  title: "URL Query Pair Order Table",
  description:
    "Parse form-style query pairs in source order, preserving raw pair spellings and duplicate names; rejects malformed percent escapes.",
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
          pairs: {
            type: "array",
            items: {
              type: "object",
              additionalProperties: false,
              properties: {
                index: { type: "number" },
                name: { type: "string" },
                value: { type: "string" },
                raw: { type: "string" },
              },
              required: ["index", "name", "value", "raw"],
            },
          },
        },
        required: ["pairs"],
      },
    },
  ],
  calculate: (v, context) => calculate(v as unknown as Input, context),
});
export const run = tool.execute;
export default tool;
