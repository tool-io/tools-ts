import type { ToolExecutionContext } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish } from "../batch53-shared.js";

export type Input = Readonly<{
  tokens: readonly string[];
  prefixes: readonly string[];
  suffixes: readonly string[];
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "tokens", label: "Tokens", kind: "stringList" },
  { id: "prefixes", label: "Prefixes", kind: "stringList" },
  { id: "suffixes", label: "Suffixes", kind: "stringList" },
] as const satisfies readonly SimpleField[];
const compute = (
  i: Input,
  context?: ToolExecutionContext,
): Readonly<Record<string, unknown>> => {
  return {
    prefixCounts: i.prefixes.map(
      (p) => i.tokens.filter((t) => t.startsWith(p)).length,
    ),
    suffixCounts: i.suffixes.map(
      (p) => i.tokens.filter((t) => t.endsWith(p)).length,
    ),
  };
};
export const calculate = (i: Input, context?: ToolExecutionContext): Output => {
  validateInput(i, fields);
  return finish({ result: compute(i, context) });
};
export const example = {
  input: { tokens: ["ab", "ac", "bc"], prefixes: ["a"], suffixes: ["c"] },
  output: { result: { prefixCounts: [2], suffixCounts: [2] } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "text/token-affix-count-table",
  title: "Token Affix Count Table",
  description:
    "Count literal affix matches in explicitly supplied tokens; case-sensitive and overlapping affixes are counted independently.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculation or explicitly qualified evidence",
      kind: "object",
    },
  ],
  calculate: (v, context) => calculate(v as unknown as Input, context),
});
export const run = tool.execute;
export default tool;
