import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../css/batch55-shared.js";
export type Input = Readonly<{
  ordinal: string;
  alphabet: string;
  width: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "ordinal", label: "ordinal", kind: "string" },
  { id: "alphabet", label: "alphabet", kind: "string" },
  { id: "width", label: "width", kind: "integer" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  const a = i.alphabet.split("");
  H.check(a.length >= 2 && H.unique(a).length === a.length);
  H.int(i.width, 0, 128);
  let value = H.bigint(i.ordinal);
  H.check(value >= 0n && value < BigInt(a.length) ** BigInt(i.width));
  let key = "";
  for (let j = 0; j < i.width; j++) {
    key = a[Number(value % BigInt(a.length))] + key;
    value /= BigInt(a.length);
  }
  return H.finish({ key });
};
export const example = {
  input: { ordinal: "3", alphabet: "abc", width: 2 },
  output: { result: { key: "ba" } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "identifier/opaque-key-fixed-alphabet-inverse",
  title: "Opaque Key Fixed Alphabet Inverse",
  description:
    "Decode an exact nonnegative ordinal into a caller fixed-width opaque alphabet key; rejects overflow rather than growing the key or truncating leading symbols.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit bounded result", kind: "object" }],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
