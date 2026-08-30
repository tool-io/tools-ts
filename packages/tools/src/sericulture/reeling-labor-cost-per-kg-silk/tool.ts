import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  aligned,
} from "../shared.js";
export type Input = Readonly<{
  readonly workerHoursByRole: readonly number[];
  readonly hourlyWagesByRole: readonly number[];
  readonly employerCostFractionsByRole: readonly number[];
  readonly paidDowntimeHoursByRole: readonly number[];
  readonly saleableSilkKg: number;
}>;
export type Output = Readonly<{
  readonly laborCostByRole: readonly number[];
  readonly totalLaborCost: number;
  readonly laborCostPerSaleableKg: number;
}>;
const inputFields = [
  {
    id: "workerHoursByRole",
    label: "Worker hours by role",
    kind: "numberList",
  },
  {
    id: "hourlyWagesByRole",
    label: "Hourly wages by role",
    kind: "numberList",
  },
  {
    id: "employerCostFractionsByRole",
    label: "Employer cost fractions by role",
    kind: "numberList",
  },
  {
    id: "paidDowntimeHoursByRole",
    label: "Paid downtime hours by role",
    kind: "numberList",
  },
  { id: "saleableSilkKg", label: "Saleable silk kg", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.saleableSilkKg, "saleableSilkKg");
  input.workerHoursByRole.forEach((v) => nonnegative(v, "workerHoursByRole"));
  input.hourlyWagesByRole.forEach((v) => nonnegative(v, "hourlyWagesByRole"));
  input.employerCostFractionsByRole.forEach((v) =>
    nonnegative(v, "employerCostFractionsByRole"),
  );
  input.paidDowntimeHoursByRole.forEach((v) =>
    nonnegative(v, "paidDowntimeHoursByRole"),
  );
  aligned(
    input.workerHoursByRole,
    input.hourlyWagesByRole,
    "workerHoursByRole",
  );
  aligned(
    input.workerHoursByRole,
    input.employerCostFractionsByRole,
    "workerHoursByRole",
  );
  aligned(
    input.workerHoursByRole,
    input.paidDowntimeHoursByRole,
    "workerHoursByRole",
  );
  const laborCostByRole = input.workerHoursByRole.map(
      (v, i) =>
        (v + input.paidDowntimeHoursByRole[i]) *
        input.hourlyWagesByRole[i] *
        (1 + input.employerCostFractionsByRole[i]),
    ),
    totalLaborCost = laborCostByRole.reduce((a, b) => a + b, 0);
  return {
    laborCostByRole,
    totalLaborCost,
    laborCostPerSaleableKg: totalLaborCost / input.saleableSilkKg,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  workerHoursByRole: [10, 20],
  hourlyWagesByRole: [2, 3],
  employerCostFractionsByRole: [0.1, 0.2],
  paidDowntimeHoursByRole: [1, 2],
  saleableSilkKg: 5,
} satisfies Input;
export const exampleOutput = {
  laborCostByRole: [24.2, 79.2],
  totalLaborCost: 103.4,
  laborCostPerSaleableKg: 20.68,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "sericulture/reeling-labor-cost-per-kg-silk",
  title: "Reeling Labor Cost Per KG Silk",
  description:
    "Allocate role-specific productive and additional paid downtime labor plus employer load to actual saleable silk kg; supplied productive hours must exclude the separate downtime.",
  inputs: inputFields,
  outputs: [
    { id: "laborCostByRole", label: "Labor cost by role", kind: "numberList" },
    { id: "totalLaborCost", label: "Total labor cost", kind: "number" },
    {
      id: "laborCostPerSaleableKg",
      label: "Labor cost per saleable kg",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      workerHoursByRole: value.workerHoursByRole as readonly number[],
      hourlyWagesByRole: value.hourlyWagesByRole as readonly number[],
      employerCostFractionsByRole:
        value.employerCostFractionsByRole as readonly number[],
      paidDowntimeHoursByRole:
        value.paidDowntimeHoursByRole as readonly number[],
      saleableSilkKg: value.saleableSilkKg as number,
    }),
});
export const run = tool.execute;
export default tool;
