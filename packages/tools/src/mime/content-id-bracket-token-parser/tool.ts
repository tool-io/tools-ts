import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../css/batch55-shared.js";
export type Input = Readonly<{ token: string }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "token", label: "token", kind: "string" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.check(/^<[^<>@\s]+@[^<>@\s]+>(?![\s\S])/.test(i.token));
  return H.finish({ contentId: i.token.slice(1, -1) });
};
export const example = {
  input: { token: "<a@b>" },
  output: { result: { contentId: "a@b" } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "mime/content-id-bracket-token-parser",
  title: "Content ID Bracket Token Parser",
  description:
    "Parse one restricted Content-ID angle-bracket token containing exactly one nonempty local@domain without whitespace, comments or quoted local parts; no mailbox validity claim.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit bounded result", kind: "object" }],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
