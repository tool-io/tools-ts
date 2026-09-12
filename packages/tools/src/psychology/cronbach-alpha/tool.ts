import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  simpleError,
  positive,
  sum,
  shape,
  sampleVariance,
} from "../batch49-shared.js";
export type Input = Readonly<{
  readonly actualPersonByItemScores: readonly (readonly number[])[];
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "actualPersonByItemScores",
    label: "Actual person by item scores",
    kind: "matrix",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  const k = shape(input.actualPersonByItemScores, "items");
  if (k < 2 || input.actualPersonByItemScores.length < 2)
    simpleError("items", "At least two persons and items.");
  const v = sampleVariance(input.actualPersonByItemScores.map((r) => sum(r)));
  positive(v, "totalscorevariance");
  return {
    cronbachAlpha:
      (k / (k - 1)) *
      (1 -
        sum(
          Array.from({ length: k }, (_, i) =>
            sampleVariance(input.actualPersonByItemScores.map((r) => r[i])),
          ),
        ) /
          v),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    actualPersonByItemScores: [
      [0, 0],
      [1, 1],
      [2, 2],
    ],
  },
  output: { result: { cronbachAlpha: 1 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "psychology/cronbach-alpha",
  title: "Cronbach's Alpha Calculator",
  description:
    "Raw-score Cronbach alpha from actual complete person\u00d7item matrix, sample covariance convention. Negative alpha retained; does not imply unidimensionality, validity or diagnosis.",
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
