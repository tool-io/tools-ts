import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../binary/batch54-shared.js";
export type Input = Readonly<{ word: number }>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  { id: "word", kind: "integer", label: "word" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input) => {
  H.validate(i, fields);
  H.int(i.word, 0, 65535);
  return H.finish({ complement: 65535 - i.word });
};
export const example = {
  input: { word: 1 },
  output: { result: { complement: 65534 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "integrity/internet-checksum-complement",
  title: "Internet Checksum Complement Tool",
  description:
    "Take the bounded ones-complement of one explicit 16-bit Internet-checksum word; this is not a packet checksum calculation.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Explicit result",
      kind: "object",
      schema: {
        type: "object",
        additionalProperties: false,
        properties: { complement: { type: "number" } },
        required: ["complement"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
