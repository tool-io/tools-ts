import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  simpleError,
  positive,
  sum,
} from "../batch49-shared.js";
export type Input = Readonly<{
  readonly actualCyclicQuadrilateralSides: readonly number[];
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "actualCyclicQuadrilateralSides",
    label: "Actual cyclic quadrilateral sides",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  if (input.actualCyclicQuadrilateralSides.length !== 4)
    simpleError("sides", "Fouractualcyclicquadrilateralsides.");
  input.actualCyclicQuadrilateralSides.forEach((v) => positive(v, "side"));
  const s = sum(input.actualCyclicQuadrilateralSides) / 2;
  if (input.actualCyclicQuadrilateralSides.some((v) => v >= s))
    simpleError("sides", "Strictquadrilateralinequalities.");
  return {
    cyclicQuadrilateralArea: Math.sqrt(
      input.actualCyclicQuadrilateralSides.reduce((p, v) => p * (s - v), 1),
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: { actualCyclicQuadrilateralSides: [2, 2, 2, 2] },
  output: { result: { cyclicQuadrilateralArea: 4 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "math/area-brahmagupta",
  title: "Brahmagupta Area Calculator",
  description:
    "Brahmagupta area\u221a\u03a0(s\u2212a) only for independently established convex CYCLIC quadrilateral; sidevectorscannotproveconcyclicity, not generic Bretschneiderquadrilateral.",
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
