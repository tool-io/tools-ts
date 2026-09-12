import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, nonnegative } from "../batch49-shared.js";
export type Input = Readonly<{
  readonly actualQualifiedSimonIncongruentRtMs: number;
  readonly actualQualifiedSimonCongruentRtMs: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "actualQualifiedSimonIncongruentRtMs",
    label: "Actual qualified simon in congruent rt ms",
    kind: "number",
  },
  {
    id: "actualQualifiedSimonCongruentRtMs",
    label: "Actual qualified simon congruent rt ms",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  nonnegative(
    input.actualQualifiedSimonIncongruentRtMs,
    "actualQualifiedSimonIncongruentRtMs",
  );
  nonnegative(
    input.actualQualifiedSimonCongruentRtMs,
    "actualQualifiedSimonCongruentRtMs",
  );
  return {
    value:
      input.actualQualifiedSimonIncongruentRtMs -
      input.actualQualifiedSimonCongruentRtMs,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    actualQualifiedSimonIncongruentRtMs: 5,
    actualQualifiedSimonCongruentRtMs: 3,
  },
  output: { result: { value: 2 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "neuroscience/simon-effect-magnitude",
  title: "Simon Effect Magnitude Calculator",
  description:
    "Observed SimonincongruentminuscongruentRT; signed result retained, actual matching units and definitions independently established.",
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
