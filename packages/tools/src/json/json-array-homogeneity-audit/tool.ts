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
import type { Json } from "../batch53-shared.js";

export type Input = Readonly<{ documentJson: string }>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  { id: "documentJson", label: "Document json", kind: "string" },
] as const satisfies readonly SimpleField[];
const compute = (i: Input, context?: ToolExecutionContext) => {
  return {
    arrays: jsonNodes(parseJson(i.documentJson))
      .filter((v) => Array.isArray(v.value))
      .map((v) => {
        const a = v.value as Json[],
          types = [...new Set(a.map(typeOf))];
        return {
          path: v.path,
          length: a.length,
          types,
          homogeneous: types.length <= 1,
        };
      }),
  };
};
export const calculate = (i: Input, context?: ToolExecutionContext) => {
  validateInput(i, fields);
  return finish({ result: compute(i, context) });
};
export const example = {
  input: { documentJson: '[1,"x",null]' },
  output: {
    result: {
      arrays: [
        {
          path: "",
          length: 3,
          types: ["number", "string", "null"],
          homogeneous: false,
        },
      ],
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "json/json-array-homogeneity-audit",
  title: "JSON Array Homogeneity Audit",
  description:
    "Audit immediate element-type homogeneity for every JSON array; an empty array is vacuously homogeneous, not evidence of a particular type.",
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
          arrays: {
            type: "array",
            items: {
              type: "object",
              additionalProperties: false,
              properties: {
                path: { type: "string" },
                length: { type: "number" },
                types: { type: "array", items: { type: "string" } },
                homogeneous: { type: "boolean" },
              },
              required: ["path", "length", "types", "homogeneous"],
            },
          },
        },
        required: ["arrays"],
      },
    },
  ],
  calculate: (v, context) => calculate(v as unknown as Input, context),
});
export const run = tool.execute;
export default tool;
