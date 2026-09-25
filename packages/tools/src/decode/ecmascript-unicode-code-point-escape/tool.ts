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
  const m = /^\\u\{([0-9A-Fa-f]{1,6})\}(?![\s\S])/.exec(i.token);
  H.check(m);
  const cp = parseInt(m![1], 16);
  H.scalar(cp);
  return H.finish({ codepoint: cp, character: String.fromCodePoint(cp) });
};
export const example = {
  input: { token: "\\u{1F600}" },
  output: { result: { codepoint: 128512, character: "\ud83d\ude00" } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "decode/ecmascript-unicode-code-point-escape",
  title: "Decoding: ECMAScript Unicode Code Point Escape Tool",
  description:
    "Decode one ECMAScript braced Unicode code-point escape restricted to Unicode scalar values, rejecting surrogates and out-of-range values rather than accepting ill-formed text.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculated result",
      kind: "object",
      schema: {
        type: "object",
        additionalProperties: false,
        properties: {
          character: { type: "string" },
          codepoint: { type: "number" },
        },
        required: ["character", "codepoint"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
