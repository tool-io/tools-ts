import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../css/batch55-shared.js";
export type Input = Readonly<{ key: string }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "key", label: "key", kind: "string" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  const m = /^t:(0|[1-9]\d*):/.exec(i.key);
  H.check(m);
  const count = H.int(Number(m![1]), 0, 128),
    values: unknown[] = [];
  let p = m![0].length;
  for (let j = 0; j < count; j++) {
    const t = /^(0|[1-9]\d*):/.exec(i.key.slice(p));
    H.check(t);
    const length = H.int(Number(t![1]), 0, 8192);
    p += t![0].length;
    H.check(p + length <= i.key.length);
    values.push(H.untypedKey(i.key.slice(p, p + length)));
    p += length;
  }
  H.check(p === i.key.length);
  return H.finish({ values });
};
export const example = {
  input: { key: "t:3:3:n:15:s:1:12:z:" },
  output: { result: { values: [1, "1", null] } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "identifier/typed-tuple-key-decoder",
  title: "Typed Tuple Key Decoder",
  description:
    "Decode the bounded typed tuple key dialect, rejecting incomplete/trailing fields and preserving scalar types; no arbitrary JSON object keys.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit bounded result", kind: "object" }],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
