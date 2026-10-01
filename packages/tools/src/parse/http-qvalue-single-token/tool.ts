import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../core/batch59-shared.js";
export type Input = Readonly<{ token: string }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "token", label: "Token", kind: "string" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.check(/^(?:0(?:\.\d{0,3})?|1(?:\.0{0,3})?)(?![\s\S])/.test(i.token));
  return H.finish({ quality: Number(i.token) });
};
export const example = {
  input: { token: "0.750" },
  output: { result: { quality: 0.75 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "parse/http-qvalue-single-token",
  title: "Parsing: HTTP Qvalue Single Token Tool",
  description:
    "Parse one strict RFC9110 qvalue, allowing at most three fractional digits and only zero fractions after one; no whole-header parsing.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculated result",
      kind: "object",
      schema: {
        type: "object",
        additionalProperties: false,
        properties: { quality: { type: "number" } },
        required: ["quality"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
