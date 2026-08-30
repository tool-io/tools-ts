import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import { validateInput, finish, bounded } from "../batch-shared.js";
export type Input = Readonly<{
  readonly normalizedArgumentX: number;
  readonly productFactors: number;
}>;
export type Output = Readonly<{
  readonly finiteSineEulerProduct: number;
  readonly zeroFactorIncluded: boolean;
}>;
const inputFields = [
  { id: "normalizedArgumentX", label: "Normalized argument x", kind: "number" },
  { id: "productFactors", label: "Product factors", kind: "number" },
] as const satisfies readonly SimpleField[];
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  const n = bounded(input.productFactors, "productFactors", 1, 100000),
    x = input.normalizedArgumentX;
  if (Math.abs(x) > 100)
    simpleError("x", "Normalized argument |x|≤100 required.");
  const root = Number.isInteger(x) && x !== 0 && Math.abs(x) <= n;
  if (root || x === 0)
    return { finiteSineEulerProduct: 0, zeroFactorIncluded: root };
  let log = Math.log(Math.PI * Math.abs(x)),
    sign = Math.sign(x);
  for (let k = 1; k <= n; k++) {
    const ratio = (x / k) ** 2;
    if (ratio > 1) {
      sign = -sign;
      log += Math.log(ratio - 1);
    } else log += Math.log1p(-ratio);
  }
  return finish({
    finiteSineEulerProduct: sign * Math.exp(log),
    zeroFactorIncluded: false,
  });
};
export const exampleInput = {
  normalizedArgumentX: 0.5,
  productFactors: 3,
} satisfies Input;
export const exampleOutput = {
  finiteSineEulerProduct: (175 * Math.PI) / 512,
  zeroFactorIncluded: false,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "math/infinite-product-sine",
  title: "Infinite Product Sine Approximation",
  description:
    "Approximate sin(πx) by the explicit finite Weierstrass/Euler product πx∏_(k=1..N)(1−x²/k²), preserving signs and exactly included integer-root factors with log accumulation; supplied cutoff means no hidden infinite tail, direct trigonometric alias or certified error.",
  inputs: inputFields,
  outputs: [
    {
      id: "finiteSineEulerProduct",
      label: "Finite sine Euler product",
      kind: "number",
    },
    {
      id: "zeroFactorIncluded",
      label: "Zero factor included",
      kind: "boolean",
    },
  ],
  calculate: (value) =>
    calculate({
      normalizedArgumentX: value.normalizedArgumentX as number,
      productFactors: value.productFactors as number,
    }),
});
export const run = tool.execute;
export default tool;
