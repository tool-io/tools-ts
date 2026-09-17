import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../binary/batch54-shared.js";
export type Input = Readonly<{ token: string }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "token", kind: "string", label: "token" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  const m = /^\{(\d+)(?:,(\d*))?\}(?![\s\S])/.exec(i.token);
  H.check(m);
  const minimum = H.int(Number(m![1]), 0, 1e6),
    maximum =
      m![2] === undefined
        ? minimum
        : m![2] === ""
          ? null
          : H.int(Number(m![2]), minimum, 1e6);
  return H.finish({ minimum, maximum });
};
export const example = {
  input: { token: "{2,}" },
  output: { result: { minimum: 2, maximum: null } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "regex/quantifier-bound-token-parser",
  title: "Quantifier Bound Token Parser",
  description:
    "Parse bounded regex repeat quantifier tokens {n}, {n,m} or {n,}; null maximum means unbounded, not zero.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit result", kind: "object" }],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
