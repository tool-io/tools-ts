import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../core/batch59-shared.js";
export type Input = Readonly<{ name: string }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "name", label: "Name", kind: "string" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  const m = /^@([a-z0-9][a-z0-9._-]*)\/([a-z0-9][a-z0-9._-]*)(?![\s\S])/.exec(
    i.name,
  );
  H.check(m && i.name.length <= 214);
  return H.finish({ scope: m![1], packageName: m![2] });
};
export const example = {
  input: { name: "@example/widget" },
  output: { result: { scope: "example", packageName: "widget" } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "development/npm-scoped-name-components",
  title: "Development: npm Scoped Name Components Tool",
  description:
    "Split a conservative lowercase npm scoped package-name token into scope and package, excluding URLs, versions and registry lookup.",
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
          packageName: { type: "string" },
          scope: { type: "string" },
        },
        required: ["packageName", "scope"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
