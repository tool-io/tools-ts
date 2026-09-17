import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../css/batch55-shared.js";
export type Input = Readonly<{
  line: number;
  span: number;
  backwards: boolean;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "line", label: "line", kind: "integer" },
  { id: "span", label: "span", kind: "integer" },
  { id: "backwards", label: "backwards", kind: "boolean" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.int(i.line, -1e6, 1e6);
  H.int(i.span, 1, 1e6);
  return H.finish({ otherLine: i.line + (i.backwards ? -i.span : i.span) });
};
export const example = {
  input: { line: 3, span: 2, backwards: false },
  output: { result: { otherLine: 5 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "css/grid-line-span-endpoint-resolver",
  title: "CSS Grid Line Span Endpoint Resolver",
  description:
    "Resolve an explicitly numeric grid line plus a positive numeric span in a supplied direction; excludes named lines, auto placement and negative end-relative line resolution.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit bounded result", kind: "object" }],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
