import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, bounded } from "../batch50-shared.js";
export type Input = Readonly<{
  readonly actualOneBasedRowIndex: number;
  readonly actualOneBasedColumnIndex: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "actualOneBasedRowIndex",
    label: "Actual one based row index",
    kind: "number",
  },
  {
    id: "actualOneBasedColumnIndex",
    label: "Actual one based column index",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  bounded(input.actualOneBasedRowIndex, "actualOneBasedRowIndex", 1, 1000000);
  bounded(
    input.actualOneBasedColumnIndex,
    "actualOneBasedColumnIndex",
    1,
    1000000,
  );
  return {
    value:
      1 / (input.actualOneBasedRowIndex + input.actualOneBasedColumnIndex - 1),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: { actualOneBasedRowIndex: 2, actualOneBasedColumnIndex: 3 },
  output: { result: { value: 0.25 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "math/hilbert-matrix-entry",
  title: "Hilbert Matrix Entry Calculator",
  description: "Hilbertmatrixentry1/(i+j\u22121),actualonebasedintegerindices.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Actual calculation or qualified reference",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
