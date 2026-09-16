import type { ToolExecutionContext } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, rectangle } from "../batch53-shared.js";

export type Input = Readonly<{
  first: readonly number[];
  second: readonly number[];
  vertical: boolean;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "first", label: "First", kind: "numberList" },
  { id: "second", label: "Second", kind: "numberList" },
  { id: "vertical", label: "Vertical", kind: "boolean" },
] as const satisfies readonly SimpleField[];
const compute = (
  i: Input,
  context?: ToolExecutionContext,
): Readonly<Record<string, unknown>> => {
  rectangle(i.first);
  rectangle(i.second);
  return {
    signedGap: i.vertical
      ? i.second[1] - (i.first[1] + i.first[3])
      : i.second[0] - (i.first[0] + i.first[2]),
  };
};
export const calculate = (i: Input, context?: ToolExecutionContext): Output => {
  validateInput(i, fields);
  return finish({ result: compute(i, context) });
};
export const example = {
  input: { first: [0, 0, 10, 2], second: [12, 0, 10, 2], vertical: false },
  output: { result: { signedGap: 2 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "layout/layout-adjacent-gap-measure",
  title: "Layout Adjacent Gap Measure",
  description:
    "Measure signed physical adjacency gap from the first trailing edge to the second leading edge; negative means overlap along that axis.",
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
