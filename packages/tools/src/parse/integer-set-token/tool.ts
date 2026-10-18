import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../binary/batch54-shared.js";
export type Input = Readonly<{ token: string }>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  { id: "token", kind: "string", label: "token" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input) => {
  H.validate(i, fields);
  H.check(/^\{(?:[+-]?\d+(?:,[+-]?\d+)*)?\}(?![\s\S])/.test(i.token));
  const v = i.token.slice(1, -1);
  const values = v ? v.split(",").map((s) => H.int(Number(s), -1e9, 1e9)) : [];
  return H.finish({ values: H.unique(values).sort((a, b) => a - b) });
};
export const example = {
  input: { token: "{3,-1,3}" },
  output: { result: { values: [-1, 3] } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "parse/integer-set-token",
  title: "Integer Set Token Parser",
  description:
    "Parse a brace-delimited finite integer set, sorting and coalescing duplicates; only strict integer tokens and commas are accepted.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Explicit result",
      kind: "object",
      schema: {
        type: "object",
        additionalProperties: false,
        properties: { values: { type: "array", items: { type: "number" } } },
        required: ["values"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
