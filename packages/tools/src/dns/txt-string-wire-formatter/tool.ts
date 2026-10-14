import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../binary/batch54-shared.js";
export type Input = Readonly<{ stringsJson: string }>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  { id: "stringsJson", kind: "string", label: "stringsJson" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input) => {
  H.validate(i, fields);
  const strings = H.arr(i.stringsJson).map((v) => {
    H.check(Array.isArray(v));
    H.bytes(v as number[]);
    return v as number[];
  });
  H.check(strings.length > 0);
  const bytes = strings.flatMap((v) => [v.length, ...v]);
  H.check(bytes.length <= 128);
  return H.finish({ bytes });
};
export const example = {
  input: { stringsJson: "[[1,2],[],[3]]" },
  output: { result: { bytes: [2, 1, 2, 0, 1, 3] } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "dns/txt-string-wire-formatter",
  title: "DNS TXT String Wire Formatter",
  description:
    "Format a nonempty DNS TXT character-string list as length-prefixed octets without a terminator; total output is bounded to 128 bytes and strings are not text-decoded.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Explicit result",
      kind: "object",
      schema: {
        type: "object",
        additionalProperties: false,
        properties: { bytes: { type: "array", items: { type: "number" } } },
        required: ["bytes"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
