import type { ToolExample } from "../../core/example.js";
import type { ToolExecutionContext } from "../../core/definition.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, binary, shape } from "../batch51-shared.js";
export type Input = Readonly<{
  readonly actualBlackCellGrid: readonly (readonly number[])[];
}>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  {
    id: "actualBlackCellGrid",
    label: "Actual black cell grid",
    kind: "matrix",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input, context?: ToolExecutionContext) => {
  const a = input.actualBlackCellGrid,
    w = shape(a, "grid");
  binary(a.flat(), "cells");
  return {
    hasRotational180Symmetry: a.every((r, i) =>
      r.every((v, j) => v === a[a.length - 1 - i][w - 1 - j]),
    ),
  };
};
export const calculate = (input: Input, context?: ToolExecutionContext) => {
  validateInput(input, fields);
  return finish({ result: compute(input, context) });
};
export const example = {
  input: {
    actualBlackCellGrid: [
      [1, 0],
      [0, 1],
    ],
  },
  output: { result: { hasRotational180Symmetry: true } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "fun/crossword-symmetry",
  title: "Crossword Grid Symmetry Checker",
  description:
    "Actualblack/whitecrosswordmask180\u00b0rotational-symmetrycheck,no cluefillcorrectness or allcrosswordstyles requirement. Boundedoffline arithmetic/sampling only;not gambling advice,fair physical randomness,secure randomness or predictive certainty.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculation or explicitly qualified result",
      kind: "object",

      schema: {
        type: "object",
        additionalProperties: false,
        properties: { hasRotational180Symmetry: { type: "boolean" } },
        required: ["hasRotational180Symmetry"],
      },
    },
  ],
  calculate: (value, context) => calculate(value as unknown as Input, context),
});
export const run = tool.execute;
export default tool;
