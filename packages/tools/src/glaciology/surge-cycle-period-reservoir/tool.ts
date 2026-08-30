import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, positive, nonnegative } from "../shared.js";
export type Input = Readonly<{
  readonly reservoirSwingKg: number;
  readonly quietInflowKgPerYear: number;
  readonly quietOutflowKgPerYear: number;
  readonly activeInflowKgPerYear: number;
  readonly activeOutflowKgPerYear: number;
}>;
export type Output = Readonly<{
  readonly rechargeYears: number;
  readonly activeDepletionYears: number;
  readonly idealCycleYears: number;
}>;
const inputFields = [
  { id: "reservoirSwingKg", label: "Reservoir swing kg", kind: "number" },
  {
    id: "quietInflowKgPerYear",
    label: "Quiet inflow kg per year",
    kind: "number",
  },
  {
    id: "quietOutflowKgPerYear",
    label: "Quiet outflow kg per year",
    kind: "number",
  },
  {
    id: "activeInflowKgPerYear",
    label: "Active inflow kg per year",
    kind: "number",
  },
  {
    id: "activeOutflowKgPerYear",
    label: "Active outflow kg per year",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.reservoirSwingKg, "reservoirSwingKg");
  nonnegative(input.quietInflowKgPerYear, "quietInflowKgPerYear");
  nonnegative(input.quietOutflowKgPerYear, "quietOutflowKgPerYear");
  nonnegative(input.activeInflowKgPerYear, "activeInflowKgPerYear");
  nonnegative(input.activeOutflowKgPerYear, "activeOutflowKgPerYear");
  const rechargeYears =
      input.reservoirSwingKg /
      positive(
        input.quietInflowKgPerYear - input.quietOutflowKgPerYear,
        "quietInflowKgPerYear",
      ),
    activeDepletionYears =
      input.reservoirSwingKg /
      positive(
        input.activeOutflowKgPerYear - input.activeInflowKgPerYear,
        "activeOutflowKgPerYear",
      );
  return {
    rechargeYears,
    activeDepletionYears,
    idealCycleYears: rechargeYears + activeDepletionYears,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  reservoirSwingKg: 100,
  quietInflowKgPerYear: 20,
  quietOutflowKgPerYear: 10,
  activeInflowKgPerYear: 20,
  activeOutflowKgPerYear: 70,
} satisfies Input;
export const exampleOutput = {
  rechargeYears: 10,
  activeDepletionYears: 2,
  idealCycleYears: 12,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "glaciology/surge-cycle-period-reservoir",
  title: "Surge Cycle Period Reservoir",
  description:
    "Estimate recharge/depletion surge-cycle timing from an explicit reservoir mass swing and fixed phase fluxes; thermal/hydraulic switching and actual surge occurrence are not predicted.",
  inputs: inputFields,
  outputs: [
    { id: "rechargeYears", label: "Recharge years", kind: "number" },
    {
      id: "activeDepletionYears",
      label: "Active depletion years",
      kind: "number",
    },
    { id: "idealCycleYears", label: "Ideal cycle years", kind: "number" },
  ],
  calculate: (value) =>
    calculate({
      reservoirSwingKg: value.reservoirSwingKg as number,
      quietInflowKgPerYear: value.quietInflowKgPerYear as number,
      quietOutflowKgPerYear: value.quietOutflowKgPerYear as number,
      activeInflowKgPerYear: value.activeInflowKgPerYear as number,
      activeOutflowKgPerYear: value.activeOutflowKgPerYear as number,
    }),
});
export const run = tool.execute;
export default tool;
