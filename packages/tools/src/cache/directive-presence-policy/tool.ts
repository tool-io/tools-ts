import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../css/batch55-shared.js";
export type Input = Readonly<{ directivesJson: string }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "directivesJson", label: "directivesJson", kind: "string" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  const names = H.directives(i.directivesJson).map((v) => v.name);
  return H.finish({
    noStore: names.includes("no-store"),
    requiresValidation: names.includes("no-cache"),
    private: names.includes("private"),
    public: names.includes("public"),
    publicPrivateConflict:
      names.includes("private") && names.includes("public"),
  });
};
export const example = {
  input: {
    directivesJson:
      '[{"name":"no-cache","value":null},{"name":"public","value":null}]',
  },
  output: {
    result: {
      noStore: false,
      requiresValidation: true,
      private: false,
      public: true,
      publicPrivateConflict: false,
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "cache/directive-presence-policy",
  title: "Cache Directive Presence Policy",
  description:
    "Report conservative presence flags for explicit cache directives and public/private conflict, not a complete cacheability decision; no-cache does not mean no-store.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit bounded result", kind: "object" }],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
