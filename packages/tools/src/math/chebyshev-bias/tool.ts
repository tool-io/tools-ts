import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  simpleError,
  bounded,
  primes,
} from "../batch50-shared.js";
export type Input = Readonly<{
  readonly actualCutoff: number;
  readonly actualFirstResidueModFour: number;
  readonly actualSecondResidueModFour: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "actualCutoff", label: "Actual cutoff", kind: "number" },
  {
    id: "actualFirstResidueModFour",
    label: "Actual first residue mod four",
    kind: "number",
  },
  {
    id: "actualSecondResidueModFour",
    label: "Actual second residue mod four",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  bounded(input.actualCutoff, "cutoff", 2, 1000000);
  if (
    ![1, 3].includes(input.actualFirstResidueModFour) ||
    ![1, 3].includes(input.actualSecondResidueModFour) ||
    input.actualFirstResidueModFour === input.actualSecondResidueModFour
  )
    simpleError("residues", "Actualdistinctcoprime1/3mod4residues.");
  const p = primes(input.actualCutoff),
    a = p.filter((v) => v % 4 === input.actualFirstResidueModFour).length,
    b = p.filter((v) => v % 4 === input.actualSecondResidueModFour).length;
  return {
    firstResiduePrimeCount: a,
    secondResiduePrimeCount: b,
    signedFirstMinusSecondCount: a - b,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    actualCutoff: 11,
    actualFirstResidueModFour: 3,
    actualSecondResidueModFour: 1,
  },
  output: {
    result: {
      firstResiduePrimeCount: 3,
      secondResiduePrimeCount: 1,
      signedFirstMinusSecondCount: 2,
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "math/chebyshev-bias",
  title: "Chebyshev Bias Calculator",
  description:
    "FiniteobservedChebyshevprime-racebiasmod4, signed counts not forever ordering or logarithmic density. Explicit bounded resource/branch and actual observations or independently verified parameters; no unproved infinite assertion certified.",
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
