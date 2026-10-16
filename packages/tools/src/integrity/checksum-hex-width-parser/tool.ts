import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../binary/batch54-shared.js";
export type Input = Readonly<{ hex: string; bits: number }>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  { id: "hex", kind: "string", label: "hex" },
  { id: "bits", kind: "integer", label: "bits" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input) => {
  H.validate(i, fields);
  H.int(i.bits, 1, 128);
  H.check(
    /^[0-9a-fA-F]+(?![\s\S])/.test(i.hex) &&
      i.hex.length === Math.ceil(i.bits / 4),
  );
  const v = BigInt("0x" + i.hex);
  H.check(v < 1n << BigInt(i.bits));
  return H.finish({ checksum: String(v) });
};
export const example = {
  input: { hex: "00A", bits: 12 },
  output: { result: { checksum: "10" } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "integrity/checksum-hex-width-parser",
  title: "Checksum Hex Width Parser",
  description:
    "Parse an exactly width-padded hexadecimal checksum token into exact decimal text, rejecting high bits beyond an explicit non-nibble bit width.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Explicit result",
      kind: "object",
      schema: {
        type: "object",
        additionalProperties: false,
        properties: { checksum: { type: "string" } },
        required: ["checksum"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
