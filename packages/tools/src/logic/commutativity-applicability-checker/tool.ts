import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, pick } from "../batch52-shared.js";
export type Input = Readonly<{
  readonly operator: string;
  readonly a: boolean;
  readonly b: boolean;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "operator", label: "Operator", kind: "string" },
  { id: "a", label: "A", kind: "boolean" },
  { id: "b", label: "B", kind: "boolean" },
] as const satisfies readonly SimpleField[];
const compute = (i: Input): Readonly<Record<string, unknown>> => {
  pick(i.operator, { AND: 0, OR: 1 }, "operator");
  const op = (a: boolean, b: boolean) =>
    i.operator === "AND" ? a && b : a || b;
  return { identityHolds: op(i.a, i.b) === op(i.b, i.a) };
};
export const calculate = (i: Input): Output => {
  validateInput(i, fields);
  return finish({ result: compute(i) });
};
export const example = {
  input: { operator: "AND", a: true, b: false },
  output: { result: { identityHolds: true } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "logic/commutativity-applicability-checker",
  title: "Commutativity Applicability Checker for AND/OR",
  description:
    "Classical pure Boolean commute identity witness for AND/OR; not short-circuit side-effect equivalence or arbitrary programming operator.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculation or explicitly qualified result",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
