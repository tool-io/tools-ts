import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, nonnegative } from "../batch49-shared.js";
export type Input = Readonly<{
  readonly actualQualifiedCuedReturnRtMs: number;
  readonly actualQualifiedUncuedRtMs: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "actualQualifiedCuedReturnRtMs",
    label: "Actual qualified cued return rt ms",
    kind: "number",
  },
  {
    id: "actualQualifiedUncuedRtMs",
    label: "Actual qualified uncued rt ms",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  nonnegative(
    input.actualQualifiedCuedReturnRtMs,
    "actualQualifiedCuedReturnRtMs",
  );
  nonnegative(input.actualQualifiedUncuedRtMs, "actualQualifiedUncuedRtMs");
  return {
    value:
      input.actualQualifiedCuedReturnRtMs - input.actualQualifiedUncuedRtMs,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: { actualQualifiedCuedReturnRtMs: 5, actualQualifiedUncuedRtMs: 3 },
  output: { result: { value: 2 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "neuroscience/inhibition-of-return-magnitude",
  title: "Inhibition of Return Magnitude Calculator",
  description:
    "Observed IORcuedreturnminusuncuedRT; signed result retained, actual matching units and definitions independently established.",
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
