import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../core/batch59-shared.js";
export type Input = Readonly<{ token: string }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "token", label: "Token", kind: "string" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  const m = /^\$\{([A-Za-z_][A-Za-z0-9_]*)(:-|-)([^{}\r\n]*)\}(?![\s\S])/.exec(
    i.token,
  );
  H.check(m);
  return H.finish({
    parameter: m![1],
    operator: m![2],
    fallback: m![3],
    emptyUsesFallback: m![2] === ":-",
  });
};
export const example = {
  input: { token: "${NAME:-default}" },
  output: {
    result: {
      parameter: "NAME",
      operator: ":-",
      fallback: "default",
      emptyUsesFallback: true,
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "parse/shell-parameter-simple-default-split",
  title: "Parsing: Shell Parameter Simple Default Split Tool",
  description:
    "Split one restricted shell parameter default expansion ${NAME-word} or ${NAME:-word}, preserving empty-vs-unset semantics; excludes nested expansions, escapes and execution.",
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
          emptyUsesFallback: { type: "boolean" },
          fallback: { type: "string" },
          operator: { type: "string" },
          parameter: { type: "string" },
        },
        required: ["emptyUsesFallback", "fallback", "operator", "parameter"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
