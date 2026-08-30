import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import { validateInput, finish, bounded } from "../batch-shared.js";
export type Input = Readonly<{
  readonly realArgumentQ: number;
  readonly productFactors: number;
}>;
export type Output = Readonly<{
  readonly finitePartitionGeneratingProduct: number;
  readonly logFinitePartitionGeneratingProduct: number;
}>;
const inputFields = [
  { id: "realArgumentQ", label: "Real argument q", kind: "number" },
  { id: "productFactors", label: "Product factors", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  if (input.realArgumentQ < 0 || input.realArgumentQ >= 1)
    simpleError("q", "Real q in [0,1) required.");
  const n = bounded(input.productFactors, "factors", 1, 100000);
  let p = input.realArgumentQ,
    l = 0;
  for (let j = 1; j <= n; j++) {
    l -= Math.log1p(-p);
    p *= input.realArgumentQ;
  }
  return {
    finitePartitionGeneratingProduct: Math.exp(l),
    logFinitePartitionGeneratingProduct: l,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  realArgumentQ: 0.1,
  productFactors: 3,
} satisfies Input;
export const exampleOutput = {
  finitePartitionGeneratingProduct: 1.1234579135813703,
  logFinitePartitionGeneratingProduct: 0.11641135184491123,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "math/partition-generating-function-approx",
  title: "Partition Generating Function Approximation",
  description:
    "Evaluate truncated real generating product ∏_(k=1..N)(1−q^k)^−1 with stable log accumulation, not exact partition coefficient counting or the exponent-sequence transform.",
  inputs: inputFields,
  outputs: [
    {
      id: "finitePartitionGeneratingProduct",
      label: "Finite partition generating product",
      kind: "number",
    },
    {
      id: "logFinitePartitionGeneratingProduct",
      label: "Log finite partition generating product",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      realArgumentQ: value.realArgumentQ as number,
      productFactors: value.productFactors as number,
    }),
});
export const run = tool.execute;
export default tool;
