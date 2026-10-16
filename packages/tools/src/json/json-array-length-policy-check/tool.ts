import type { ToolExecutionContext } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  bounded,
  parseJson,
  jsonNodes,
} from "../batch53-shared.js";
import type { Json } from "../batch53-shared.js";

export type Input = Readonly<{
  documentJson: string;
  minimumLength: number;
  maximumLength: number;
}>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  { id: "documentJson", label: "Document json", kind: "string" },
  { id: "minimumLength", label: "Minimum length", kind: "number" },
  { id: "maximumLength", label: "Maximum length", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (i: Input, context?: ToolExecutionContext) => {
  bounded(i.minimumLength, "minimum", 0, 10000);
  bounded(i.maximumLength, "maximum", i.minimumLength, 10000);
  return {
    violations: jsonNodes(parseJson(i.documentJson))
      .filter(
        (v) =>
          Array.isArray(v.value) &&
          ((v.value as Json[]).length < i.minimumLength ||
            (v.value as Json[]).length > i.maximumLength),
      )
      .map((v) => ({ path: v.path, length: (v.value as Json[]).length })),
  };
};
export const calculate = (i: Input, context?: ToolExecutionContext) => {
  validateInput(i, fields);
  return finish({ result: compute(i, context) });
};
export const example = {
  input: {
    documentJson: '{"a":[],"b":[1]}',
    minimumLength: 1,
    maximumLength: 2,
  },
  output: { result: { violations: [{ path: "/a", length: 0 }] } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "json/json-array-length-policy-check",
  title: "JSON Array Length Policy Check",
  description:
    "Audit all JSON array lengths against inclusive bounds; no inferred schema or scalar-array coercion.",
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
                path: { type: "string" },
                length: { type: "number" },
              },
              required: ["path", "length"],
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
