import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  bounded,
  primes,
  simpson,
} from "../batch50-shared.js";
export type Input = Readonly<{
  readonly actualCutoff: number;
  readonly callerIndependentOffsetLiAtTwo: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "actualCutoff", label: "Actual cutoff", kind: "number" },
  {
    id: "callerIndependentOffsetLiAtTwo",
    label: "Caller independent offset li at two",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  bounded(input.actualCutoff, "cutoff", 2, 1000000);
  const p = primes(input.actualCutoff).length,
    l =
      input.callerIndependentOffsetLiAtTwo +
      simpson(
        (t) => Math.exp(t) / t,
        Math.LN2,
        Math.log(input.actualCutoff),
        2048,
      ),
    d = p - l;
  return {
    observedPi: p,
    conditionalLi: l,
    signedPiMinusConditionalLi: d,
    observedPositiveDiscrepancy: d > 0,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    actualCutoff: 10,
    callerIndependentOffsetLiAtTwo: 1.045163780117493,
  },
  output: {
    result: {
      observedPi: 4,
      conditionalLi: 6.165599504787299,
      signedPiMinusConditionalLi: -2.165599504787299,
      observedPositiveDiscrepancy: false,
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "math/littlewood-violation",
  title: "Littlewood Violation Calculator",
  description:
    "Finite\u03c0(x)\u2212offset logarithmic integral under independent li(2) calibration/transformed quadrature, noglobalLittlewoodsignchangeproof/no huge first crossover search. Explicit bounded resource/branch and actual observations or independently verified parameters; no unproved infinite assertion certified.",
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
