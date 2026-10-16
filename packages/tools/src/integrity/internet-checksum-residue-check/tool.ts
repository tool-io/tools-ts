import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../binary/batch54-shared.js";
export type Input = Readonly<{ words: readonly number[] }>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  { id: "words", kind: "numberList", label: "words" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input) => {
  H.validate(i, fields);
  i.words.forEach((x) => H.int(x, 0, 65535));
  let sum = i.words.reduce((s, x) => s + BigInt(x), 0n);
  while (sum > 65535n) sum = (sum & 65535n) + (sum >> 16n);
  return H.finish({ residue: Number(sum), valid: sum === 65535n });
};
export const example = {
  input: { words: [65534, 1] },
  output: { result: { residue: 65535, valid: true } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "integrity/internet-checksum-residue-check",
  title: "Internet Checksum Residue Check",
  description:
    "Verify an explicit Internet-checksum word list including its checksum against all-one folded residue; no packet-field or protocol coverage assumptions.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Explicit result",
      kind: "object",
      schema: {
        type: "object",
        additionalProperties: false,
        properties: { residue: { type: "number" }, valid: { type: "boolean" } },
        required: ["residue", "valid"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
