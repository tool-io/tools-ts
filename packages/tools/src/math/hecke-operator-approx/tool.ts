import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  simpleError,
  bounded,
} from "../batch50-shared.js";
export type Input = Readonly<{
  readonly actualModularWeight: number;
  readonly actualHeckeIndex: number;
  readonly actualOutputFourierIndex: number;
  readonly actualQualifiedFourierCoefficientsStartingOne: readonly number[];
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "actualModularWeight", label: "Actual modular weight", kind: "number" },
  { id: "actualHeckeIndex", label: "Actual hecke index", kind: "number" },
  {
    id: "actualOutputFourierIndex",
    label: "Actual output fourier index",
    kind: "number",
  },
  {
    id: "actualQualifiedFourierCoefficientsStartingOne",
    label: "Actual qualified fourier coefficients starting one",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  bounded(input.actualModularWeight, "weight", 1, 16);
  bounded(input.actualHeckeIndex, "m", 1, 64);
  bounded(input.actualOutputFourierIndex, "n", 1, 64);
  const m = input.actualHeckeIndex,
    n = input.actualOutputFourierIndex;
  if (input.actualQualifiedFourierCoefficientsStartingOne.length < m * n)
    simpleError("coefficients", "Actual complete coefficients throughmn.");
  let a = 0;
  for (let d = 1; d <= Math.min(m, n); d++)
    if (m % d === 0 && n % d === 0)
      a +=
        d ** (input.actualModularWeight - 1) *
        input.actualQualifiedFourierCoefficientsStartingOne[
          (m * n) / (d * d) - 1
        ];
  return { conditionalHeckeFourierCoefficient: a };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    actualModularWeight: 2,
    actualHeckeIndex: 2,
    actualOutputFourierIndex: 2,
    actualQualifiedFourierCoefficientsStartingOne: [1, 2, 3, 4],
  },
  output: { result: { conditionalHeckeFourierCoefficient: 6 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "math/hecke-operator-approx",
  title: "Hecke Operator Approximation",
  description:
    "LevelONEholomorphicweightkHecke(T_m f)_n=\u03a3d|(m, n) d^(k\u22121) a_mn/d\u00b2with independent actual coefficients; not general level character operator or claim input modular. Explicit bounded resource/branch and actual observations or independently verified parameters; no unproved infinite assertion certified.",
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
