import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  simpleError,
  positive,
  nonnegative,
  mean,
} from "../batch46-shared.js";
export type Input = Readonly<{
  readonly observedPositiveIncomes: readonly number[];
  readonly callerInequalityAversion: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "observedPositiveIncomes",
    label: "Observed positive incomes",
    kind: "numberList",
  },
  {
    id: "callerInequalityAversion",
    label: "Caller inequality aversion",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  if (!input.observedPositiveIncomes.length)
    simpleError("income", "Nonempty strictly positive sample.");
  input.observedPositiveIncomes.forEach((v) => positive(v, "income"));
  nonnegative(input.callerInequalityAversion, "aversion");
  const m = mean(input.observedPositiveIncomes),
    e = input.callerInequalityAversion,
    ede =
      e === 1
        ? Math.exp(mean(input.observedPositiveIncomes.map((v) => Math.log(v))))
        : Math.pow(
            mean(input.observedPositiveIncomes.map((v) => Math.pow(v, 1 - e))),
            1 / (1 - e),
          );
  return { conditionalAtkinsonIndex: 1 - ede / m };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: { observedPositiveIncomes: [1, 4], callerInequalityAversion: 1 },
  output: { result: { conditionalAtkinsonIndex: 0.2 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "sociology/atkinson-index",
  title: "Atkinson Index Calculator",
  description:
    "Conditional sample Atkinson index for strictly positive incomes and caller nonnegative inequality aversion; geometric case\u03b5=1handled separately. No universal preference parameter or causal distribution inference.",
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
