import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import { validateInput, finish, bounded, integer } from "../batch-shared.js";
export type Input = Readonly<{
  readonly leftArithmeticValues: readonly number[];
  readonly rightArithmeticValues: readonly number[];
  readonly summationLimit: number;
}>;
export type Output = Readonly<{
  readonly exactSummatoryDirichletConvolution: string;
}>;
const inputFields = [
  {
    id: "leftArithmeticValues",
    label: "Left arithmetic values",
    kind: "numberList",
  },
  {
    id: "rightArithmeticValues",
    label: "Right arithmetic values",
    kind: "numberList",
  },
  { id: "summationLimit", label: "Summation limit", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  const n = bounded(input.summationLimit, "limit", 1, 100000);
  if (
    input.leftArithmeticValues.length !== n ||
    input.rightArithmeticValues.length !== n
  )
    simpleError("values", "Caller f(1)..f(N) and g(1)..g(N) required.");
  input.leftArithmeticValues.forEach((v) => integer(v, "left"));
  input.rightArithmeticValues.forEach((v) => integer(v, "right"));
  const f = input.leftArithmeticValues.map(BigInt),
    g = input.rightArithmeticValues.map(BigInt),
    F: bigint[] = [0n],
    G: bigint[] = [0n];
  f.forEach((v) => F.push(F.at(-1)! + v));
  g.forEach((v) => G.push(G.at(-1)! + v));
  const h = Math.floor(Math.sqrt(n));
  let s = -F[h] * G[h];
  for (let i = 1; i <= h; i++)
    s += f[i - 1] * G[Math.floor(n / i)] + g[i - 1] * F[Math.floor(n / i)];
  return { exactSummatoryDirichletConvolution: s.toString() };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  leftArithmeticValues: [1, 1, 1, 1],
  rightArithmeticValues: [1, 1, 1, 1],
  summationLimit: 4,
} satisfies Input;
export const exampleOutput = {
  exactSummatoryDirichletConvolution: "8",
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "math/dirichlet-hyperbola",
  title: "Dirichlet Hyperbola Calculator",
  description:
    "Compute exact Σ_(ab≤N) f(a)g(b) via Dirichlet hyperbola split using caller complete arithmetic sequences; unlike existing Dirichlet convolution at a single n, this sums the entire lower hyperbola.",
  inputs: inputFields,
  outputs: [
    {
      id: "exactSummatoryDirichletConvolution",
      label: "Exact summatory dirichlet convolution",
      kind: "string",
    },
  ],
  calculate: (value) =>
    calculate({
      leftArithmeticValues: value.leftArithmeticValues as readonly number[],
      rightArithmeticValues: value.rightArithmeticValues as readonly number[],
      summationLimit: value.summationLimit as number,
    }),
});
export const run = tool.execute;
export default tool;
