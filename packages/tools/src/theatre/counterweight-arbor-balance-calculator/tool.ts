import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, nonnegative } from "../batch46-shared.js";
export type Input = Readonly<{
  readonly independentlyMeasuredSuspendedMassKg: number;
  readonly independentlyMeasuredArborAndExistingBallastMassKg: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "independentlyMeasuredSuspendedMassKg",
    label: "Independently measured suspended mass kg",
    kind: "number",
  },
  {
    id: "independentlyMeasuredArborAndExistingBallastMassKg",
    label: "Independently measured arbor and existing ballast mass kg",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  nonnegative(input.independentlyMeasuredSuspendedMassKg, "load");
  nonnegative(
    input.independentlyMeasuredArborAndExistingBallastMassKg,
    "arbor",
  );
  return {
    signedIdealBalanceMassDifferenceKg:
      input.independentlyMeasuredSuspendedMassKg -
      input.independentlyMeasuredArborAndExistingBallastMassKg,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    independentlyMeasuredSuspendedMassKg: 100,
    independentlyMeasuredArborAndExistingBallastMassKg: 90,
  },
  output: { result: { signedIdealBalanceMassDifferenceKg: 10 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "theatre/counterweight-arbor-balance-calculator",
  title: "Counterweight Arbor Balance Calculator",
  description:
    "Ideal static mass discrepancy only; caller supplies independently measured complete compatible suspended/arbor inventories. Not a loading procedure, recommend operating a lineset, allowable imbalance or rigging safety.",
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
