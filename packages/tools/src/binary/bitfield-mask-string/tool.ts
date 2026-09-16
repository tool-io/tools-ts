import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../binary/batch54-shared.js";
export type Input = Readonly<{ offset: number; width: number }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "offset", kind: "integer", label: "offset" },
  { id: "width", kind: "integer", label: "width" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.int(i.offset, 0, 2048);
  H.int(i.width, 0, 2048);
  return H.finish({
    mask: String(((1n << BigInt(i.width)) - 1n) << BigInt(i.offset)),
  });
};
export const example = {
  input: { offset: 3, width: 2 },
  output: { result: { mask: "24" } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "binary/bitfield-mask-string",
  title: "Bitfield Mask Integer String",
  description:
    "Build an exact arbitrary-width bitfield mask as a decimal integer string; zero width has a zero mask.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit result", kind: "object" }],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
