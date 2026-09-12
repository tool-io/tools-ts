import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  bounded,
  sum,
  aligned,
} from "../batch50-shared.js";
export type Input = Readonly<{
  readonly actualQuadratureFReal: readonly number[];
  readonly actualQuadratureFImaginary: readonly number[];
  readonly actualQuadratureGReal: readonly number[];
  readonly actualQuadratureGImaginary: readonly number[];
  readonly actualQuadratureY: readonly number[];
  readonly callerQualifiedEuclideanAreaWeights: readonly number[];
  readonly actualModularWeight: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "actualQuadratureFReal",
    label: "Actual quadrature f real",
    kind: "numberList",
  },
  {
    id: "actualQuadratureFImaginary",
    label: "Actual quadrature f imaginary",
    kind: "numberList",
  },
  {
    id: "actualQuadratureGReal",
    label: "Actual quadrature g real",
    kind: "numberList",
  },
  {
    id: "actualQuadratureGImaginary",
    label: "Actual quadrature g imaginary",
    kind: "numberList",
  },
  { id: "actualQuadratureY", label: "Actual quadrature y", kind: "numberList" },
  {
    id: "callerQualifiedEuclideanAreaWeights",
    label: "Caller qualified euclidean area weights",
    kind: "numberList",
  },
  { id: "actualModularWeight", label: "Actual modular weight", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  const a = input.actualQuadratureFReal;
  [
    input.actualQuadratureFImaginary,
    input.actualQuadratureGReal,
    input.actualQuadratureGImaginary,
    input.actualQuadratureY,
    input.callerQualifiedEuclideanAreaWeights,
  ].forEach((v) => aligned(a, v, "nodes"));
  input.actualQuadratureY.forEach((v) => positive(v, "y"));
  input.callerQualifiedEuclideanAreaWeights.forEach((v) =>
    nonnegative(v, "areaweight"),
  );
  bounded(input.actualModularWeight, "weight", 0, 16);
  const w = input.actualQuadratureY.map(
    (y, i) =>
      y ** (input.actualModularWeight - 2) *
      input.callerQualifiedEuclideanAreaWeights[i],
  );
  return {
    real: sum(
      a.map(
        (v, i) =>
          (v * input.actualQuadratureGReal[i] +
            input.actualQuadratureFImaginary[i] *
              input.actualQuadratureGImaginary[i]) *
          w[i],
      ),
    ),
    imaginary: sum(
      a.map(
        (v, i) =>
          (input.actualQuadratureFImaginary[i] *
            input.actualQuadratureGReal[i] -
            v * input.actualQuadratureGImaginary[i]) *
          w[i],
      ),
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    actualQuadratureFReal: [1, 2],
    actualQuadratureFImaginary: [0, 0],
    actualQuadratureGReal: [1, 1],
    actualQuadratureGImaginary: [0, 1],
    actualQuadratureY: [1, 1],
    callerQualifiedEuclideanAreaWeights: [1, 1],
    actualModularWeight: 2,
  },
  output: { result: { real: 3, imaginary: -2 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "math/petersson-inner-product-approx",
  title: "Petersson Inner Product Approximation",
  description:
    "ActualPeterssonquadrature\u03a3fconj(g) y^(k\u22122) dxdyontheindependentlyqualifiedfundamentaldomainnodes/Euclidean area weights, complex tail error not certified; not unweightedinnerproductor claimed modularity. Explicit bounded resource/branch and actual observations or independently verified parameters; no unproved infinite assertion certified.",
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
