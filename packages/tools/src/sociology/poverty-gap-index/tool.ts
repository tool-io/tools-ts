import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  sum,
  sampleIncome,
} from "../batch46-shared.js";
export type Input = Readonly<{
  readonly observedCompatibleIncomes: readonly number[];
  readonly callerPovertyLine: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "observedCompatibleIncomes",
    label: "Observed compatible incomes",
    kind: "numberList",
  },
  { id: "callerPovertyLine", label: "Caller poverty line", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  sampleIncome(input.observedCompatibleIncomes);
  positive(input.callerPovertyLine, "line");
  return {
    observedPovertyGapIndex:
      sum(
        input.observedCompatibleIncomes.map((v) =>
          Math.max(0, 1 - v / input.callerPovertyLine),
        ),
      ) / input.observedCompatibleIncomes.length,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: { observedCompatibleIncomes: [50, 100, 150], callerPovertyLine: 100 },
  output: { result: { observedPovertyGapIndex: 0.16666666666666666 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "sociology/poverty-gap-index",
  title: "Poverty Gap Index Calculator",
  description:
    "Actual equally weighted sample FGT1poverty-gap index under caller applicable income/line basis; negative incomes excluded in this restricted model, not whole-population or legal poverty status.",
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
