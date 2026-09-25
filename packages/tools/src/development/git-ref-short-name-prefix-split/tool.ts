import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../core/batch59-shared.js";
export type Input = Readonly<{ reference: string }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "reference", label: "Reference", kind: "string" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  const m = /^refs\/(heads|tags|remotes)\/(.+)(?![\s\S])/.exec(i.reference);
  H.check(
    m &&
      !/[\x00-\x20\x7f~^:?*\[\\]/.test(i.reference) &&
      !i.reference.includes("..") &&
      !i.reference.includes("@{") &&
      !i.reference.endsWith(".") &&
      !i.reference
        .split("/")
        .some((s) => s === "" || s.startsWith(".") || s.endsWith(".lock")),
  );
  return H.finish({
    kind: m![1] === "heads" ? "branch" : m![1] === "tags" ? "tag" : "remote",
    shortName: m![2],
  });
};
export const example = {
  input: { reference: "refs/heads/feature/a" },
  output: { result: { kind: "branch", shortName: "feature/a" } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "development/git-ref-short-name-prefix-split",
  title: "Development: Git Ref Short Name Prefix Split Tool",
  description:
    "Split a restricted full Git heads/tags/remotes reference prefix from its short name; rejects common forbidden ref syntax but does not resolve repository objects.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculated result",
      kind: "object",
      schema: {
        type: "object",
        additionalProperties: false,
        properties: { kind: { type: "string" }, shortName: { type: "string" } },
        required: ["kind", "shortName"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
