import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../core/batch59-shared.js";
export type Input = Readonly<{ header: string }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "header", label: "Header", kind: "string" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  const m = /^([a-z]+)(?:\(([^()\r\n]+)\))?(!)?: ([^\r\n]+)(?![\s\S])/.exec(
    i.header,
  );
  H.check(m);
  return H.finish({
    type: m![1],
    scope: m![2] ?? "",
    breaking: m![3] === "!",
    description: m![4],
  });
};
export const example = {
  input: { header: "feat(api)!: remove endpoint" },
  output: {
    result: {
      type: "feat",
      scope: "api",
      breaking: true,
      description: "remove endpoint",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "development/conventional-commit-breaking-marker",
  title: "Development: Conventional Commit Breaking Marker Tool",
  description:
    "Parse the breaking exclamation marker of one restricted Conventional Commit header; does not infer body/footer BREAKING CHANGE declarations.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculated result",
      kind: "object",
      schema: {
        type: "object",
        additionalProperties: false,
        properties: {
          breaking: { type: "boolean" },
          description: { type: "string" },
          scope: { type: "string" },
          type: { type: "string" },
        },
        required: ["breaking", "description", "scope", "type"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
