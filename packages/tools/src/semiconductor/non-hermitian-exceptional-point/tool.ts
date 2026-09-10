import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
} from "../batch48-shared.js";
export type Input = Readonly<{
  readonly callerVerifiedIdenticalModeCenterFrequency: number;
  readonly couplingFrequencyMagnitude: number;
  readonly balancedGainLossMagnitude: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "callerVerifiedIdenticalModeCenterFrequency",
    label: "Caller verified identical mode center frequency",
    kind: "number",
  },
  {
    id: "couplingFrequencyMagnitude",
    label: "Coupling frequency magnitude",
    kind: "number",
  },
  {
    id: "balancedGainLossMagnitude",
    label: "Balanced gain loss magnitude",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  positive(input.couplingFrequencyMagnitude, "coupling");
  nonnegative(input.balancedGainLossMagnitude, "balanced-gain-loss");
  return {
    signedSquaredModeSplitting:
      input.couplingFrequencyMagnitude ** 2 -
      input.balancedGainLossMagnitude ** 2,
    nominalExceptionalPointEquality:
      input.couplingFrequencyMagnitude === input.balancedGainLossMagnitude,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    callerVerifiedIdenticalModeCenterFrequency: 10,
    couplingFrequencyMagnitude: 2,
    balancedGainLossMagnitude: 2,
  },
  output: {
    result: {
      signedSquaredModeSplitting: 0,
      nominalExceptionalPointEquality: true,
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "semiconductor/non-hermitian-exceptional-point",
  title: "Semiconductor Non Hermitian Exceptional Point Calculator",
  description:
    "Explicit ideal symmetric2\u00d72PTmatrix with same real mode frequency, real\u03bacoupling and balanced\u00b1i\u03b3gain/loss. Discriminant\u03ba\u00b2\u2212\u03b3\u00b2and exact nominal\u03ba=\u03b3equality only; no complex eigenspectrum, noise robustness or generic non-Hermitian EPdetection.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Qualified observed calculation or explicit reference",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
