import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  simpleError,
  positive,
  nonnegative,
  sum,
} from "../batch49-shared.js";
export type Input = Readonly<{
  readonly actualDispensedSupplyDays: readonly number[];
  readonly actualReferencePeriodDays: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "actualDispensedSupplyDays",
    label: "Actual dispensed supply days",
    kind: "numberList",
  },
  {
    id: "actualReferencePeriodDays",
    label: "Actual reference period days",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  if (!input.actualDispensedSupplyDays.length)
    simpleError("actualDispensedSupplyDays", "Actual nonempty observations.");
  input.actualDispensedSupplyDays.forEach((v) =>
    nonnegative(v, "actualDispensedSupplyDays"),
  );
  positive(input.actualReferencePeriodDays, "actualReferencePeriodDays");
  return {
    value:
      sum(input.actualDispensedSupplyDays) / input.actualReferencePeriodDays,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: { actualDispensedSupplyDays: [6, 6], actualReferencePeriodDays: 10 },
  output: { result: { value: 1.2 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "pharmacy/medication-possession-ratio",
  title: "Medication Possession Ratio Calculator",
  description:
    "Declared gross MPR sum dispensed days/reference period, OVERLAPS not removed and over1retained; not PDCor proof ingestion, independently defined denominator policy. All patient/product/route/units and applicable inputs independently clinically established; no dose, route, frequency, eligibility, titration, diagnosis or permission to administer is supplied.",
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
