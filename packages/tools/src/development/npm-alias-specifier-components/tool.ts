import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../core/batch59-shared.js";
export type Input = Readonly<{ specifier: string }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "specifier", label: "Specifier", kind: "string" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  const m =
    /^npm:((?:@[a-z0-9._-]+\/)?[a-z0-9._-]+)(?:@([^\s]+))?(?![\s\S])/.exec(
      i.specifier,
    );
  H.check(m);
  return H.finish({ packageName: m![1], range: m![2] ?? "" });
};
export const example = {
  input: { specifier: "npm:@scope/pkg@^1.2.0" },
  output: { result: { packageName: "@scope/pkg", range: "^1.2.0" } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "development/npm-alias-specifier-components",
  title: "Development: npm Alias Specifier Components Tool",
  description:
    "Split one restricted npm alias target specifier npm:name[@range], respecting scoped package names without registry resolution or range evaluation.",
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
          range: { type: "string" },
        },
        required: ["packageName", "range"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
