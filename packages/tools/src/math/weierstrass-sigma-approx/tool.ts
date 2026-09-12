import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, latticeSum } from "../batch50-shared.js";
export type Input = Readonly<{
  readonly actualComplexZ: readonly number[];
  readonly actualComplexFullPeriods: readonly (readonly number[])[];
  readonly actualSymmetricLatticeCutoff: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "actualComplexZ", label: "Actual complex z", kind: "numberList" },
  {
    id: "actualComplexFullPeriods",
    label: "Actual complex full periods",
    kind: "matrix",
  },
  {
    id: "actualSymmetricLatticeCutoff",
    label: "Actual symmetric lattice cutoff",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  return latticeSum(
    input.actualComplexZ,
    input.actualComplexFullPeriods,
    input.actualSymmetricLatticeCutoff,
    "sigma",
  );
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    actualComplexZ: [1, 0],
    actualComplexFullPeriods: [
      [4, 0],
      [0, 4],
    ],
    actualSymmetricLatticeCutoff: 0,
  },
  output: { result: { real: 1, imaginary: 0 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "math/weierstrass-sigma-approx",
  title: "Weierstrass Sigma Approximation",
  description:
    "Finite symmetricsquareWeierstrasssigmalatticesum/canonical product, actualTWO full periods not half periods, cutoff\u226410, zeros retained; lattice-independent real periods required, no certified full infinite elliptic function. Explicit bounded resource/branch and actual observations or independently verified parameters; no unproved infinite assertion certified.",
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
