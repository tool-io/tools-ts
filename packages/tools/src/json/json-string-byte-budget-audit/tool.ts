import type { ToolExecutionContext } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  bounded,
  parseJson,
  jsonLeaves,
  utf8,
} from "../batch53-shared.js";

export type Input = Readonly<{
  documentJson: string;
  maximumUtf8Bytes: number;
}>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  { id: "documentJson", label: "Document json", kind: "string" },
  { id: "maximumUtf8Bytes", label: "Maximum utf8 bytes", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (i: Input, context?: ToolExecutionContext) => {
  bounded(i.maximumUtf8Bytes, "budget", 0, 1000000);
  return {
    violations: jsonLeaves(parseJson(i.documentJson))
      .filter((v) => typeof v.value === "string")
      .flatMap((v) => {
        const bytes = utf8(v.value as string);
        return bytes > i.maximumUtf8Bytes
          ? [
              {
                path: v.path,
                utf8Bytes: bytes,
                excess: bytes - i.maximumUtf8Bytes,
              },
            ]
          : [];
      }),
  };
};
export const calculate = (i: Input, context?: ToolExecutionContext) => {
  validateInput(i, fields);
  return finish({ result: compute(i, context) });
};
export const example = {
  input: { documentJson: '{"a":"😀"}', maximumUtf8Bytes: 3 },
  output: { result: { violations: [{ path: "/a", utf8Bytes: 4, excess: 1 }] } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "json/json-string-byte-budget-audit",
  title: "JSON String Byte Budget Audit",
  description:
    "Audit decoded JSON string values against a UTF-8 byte limit; counts Unicode replacement encodings for unpaired surrogates, not serialized JSON escape bytes.",
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
                utf8Bytes: { type: "number" },
                excess: { type: "number" },
              },
              required: ["path", "utf8Bytes", "excess"],
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
