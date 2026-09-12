import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  simpleError,
  positive,
  bounded,
} from "../batch49-shared.js";
export type Input = Readonly<{
  readonly actualVertexCount: number;
  readonly actualCircumradius: number;
  readonly actualStep: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "actualVertexCount", label: "Actual vertex count", kind: "number" },
  { id: "actualCircumradius", label: "Actual circumradius", kind: "number" },
  { id: "actualStep", label: "Actual step", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  bounded(input.actualVertexCount, "actualVertexCount", 1, 1000000);
  positive(input.actualCircumradius, "actualCircumradius");
  bounded(input.actualStep, "actualStep", 1, 1000000);
  if (
    input.actualVertexCount < 5 ||
    input.actualStep >= input.actualVertexCount / 2
  )
    simpleError("star", "n≥5,1≤k<n/2.");
  let a = input.actualVertexCount,
    b = input.actualStep;
  while (b) {
    const t = a % b;
    a = b;
    b = t;
  }
  if (a !== 1) simpleError("star", "Primitivecoprimen,k.");
  return {
    value:
      (input.actualVertexCount *
        input.actualCircumradius ** 2 *
        Math.sin((2 * Math.PI * input.actualStep) / input.actualVertexCount)) /
      2,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: { actualVertexCount: 5, actualCircumradius: 1, actualStep: 2 },
  output: { result: { value: 1.4694631307311832 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "math/star-polygon-area",
  title: "Star Polygon Area Calculator",
  description:
    "Regulars tar{n/k}ALGEBRAIC signed shoelace area with winding multiplicity nR\u00b2sin(2\u03c0k/n)/2, not union filled area; primitive gcd(n, k)=1and1\u2264k<n/2, n\u22655.",
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
