import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, sum, sampleIncome } from "../batch46-shared.js";
export type Input = Readonly<{
  readonly observedCompatibleIncomes: readonly number[];
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "observedCompatibleIncomes",
    label: "Observed compatible incomes",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  const m =
    sampleIncome(input.observedCompatibleIncomes) /
    input.observedCompatibleIncomes.length;
  return {
    observedTheilT:
      sum(
        input.observedCompatibleIncomes.map((v) =>
          v === 0 ? 0 : (v / m) * Math.log(v / m),
        ),
      ) / input.observedCompatibleIncomes.length,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: { observedCompatibleIncomes: [0, 2] },
  output: { result: { observedTheilT: 0.6931471805599453 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "sociology/theil-index",
  title: "Theil Index Calculator",
  description:
    "Sample Theil Tinequality using actual nonnegative incomes; zero contributes limiting0log0, all-zero sample undefined. Not a protected-group assessment or sampling-adjusted population estimate.",
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
