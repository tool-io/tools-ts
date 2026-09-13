import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, positive } from "../batch49-shared.js";
export type Input = Readonly<{
  readonly callerCalibratedTwoPlDiscrimination: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "callerCalibratedTwoPlDiscrimination",
    label: "Caller calibrated two pl discrimination",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  positive(
    input.callerCalibratedTwoPlDiscrimination,
    "callerCalibratedTwoPlDiscrimination",
  );
  return { value: input.callerCalibratedTwoPlDiscrimination ** 2 / 4 };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: { callerCalibratedTwoPlDiscrimination: 2 },
  output: { result: { value: 1 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "psychology/item-information-function-peak",
  title: "Item Information Function Peak Calculator",
  description:
    "Explicit2PL logistic item information peak a\u00b2/4at\u03b8=bwith no guessing/lapseandD=1. Not3PLpeak or independently fitted curve. Actual independently qualified instrument/cohort/matching units; no diagnosis, causal outcome, validated personal prediction or universal clinical cutoff.",
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
