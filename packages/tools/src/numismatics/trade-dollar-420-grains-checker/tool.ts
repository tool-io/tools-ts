import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
} from "../batch45-shared.js";
export type Input = Readonly<{
  readonly observedMassGrams: number;
  readonly callerApplicableToleranceGrams: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "observedMassGrams", label: "Observed mass grams", kind: "number" },
  {
    id: "callerApplicableToleranceGrams",
    label: "Caller applicable tolerance grams",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  positive(input.observedMassGrams, "mass");
  nonnegative(input.callerApplicableToleranceGrams, "tolerance");
  const nominal = 420 * 0.06479891,
    delta = input.observedMassGrams - nominal;
  return {
    nominal420GrainsGrams: nominal,
    signedMassDifferenceGrams: delta,
    withinCallerMassTolerance:
      Math.abs(delta) <= input.callerApplicableToleranceGrams,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: { observedMassGrams: 27.216, callerApplicableToleranceGrams: 0.01 },
  output: {
    result: {
      nominal420GrainsGrams: 27.2155422,
      signedMassDifferenceGrams: 0.0004578,
      withinCallerMassTolerance: true,
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "numismatics/trade-dollar-420-grains-checker",
  title: "Trade Dollar 420 Grains Checker",
  description:
    "Compare actual US trade-dollar mass to nominal420grains using1grain=0.06479891 gram. Caller verifies issue and tolerance; not composition or authentication and wear/loss remain.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculated observation or qualified reference",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
