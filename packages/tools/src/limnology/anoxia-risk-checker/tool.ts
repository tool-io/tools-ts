import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, positive, nonnegative } from "../shared.js";
export type Input = Readonly<{
  readonly waterVolumeM3: number;
  readonly initialOxygenMgPerLiter: number;
  readonly comparisonOxygenMgPerLiter: number;
  readonly demandKgPerDay: number;
  readonly supplyKgPerDay: number;
  readonly horizonDays: number;
}>;
export type Output = Readonly<{
  readonly netDepletionKgPerDay: number;
  readonly timeToComparisonDays: number;
  readonly signedProjectedOxygenBalanceKg: number;
  readonly comparisonReachedWithinHorizon: boolean;
}>;
const inputFields = [
  { id: "waterVolumeM3", label: "Water volume m3", kind: "number" },
  {
    id: "initialOxygenMgPerLiter",
    label: "Initial oxygen mg per liter",
    kind: "number",
  },
  {
    id: "comparisonOxygenMgPerLiter",
    label: "Comparison oxygen mg per liter",
    kind: "number",
  },
  { id: "demandKgPerDay", label: "Demand kg per day", kind: "number" },
  { id: "supplyKgPerDay", label: "Supply kg per day", kind: "number" },
  { id: "horizonDays", label: "Horizon days", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.waterVolumeM3, "waterVolumeM3");
  nonnegative(input.initialOxygenMgPerLiter, "initialOxygenMgPerLiter");
  nonnegative(input.comparisonOxygenMgPerLiter, "comparisonOxygenMgPerLiter");
  nonnegative(input.demandKgPerDay, "demandKgPerDay");
  nonnegative(input.supplyKgPerDay, "supplyKgPerDay");
  nonnegative(input.horizonDays, "horizonDays");
  const netDepletionKgPerDay = positive(
      input.demandKgPerDay - input.supplyKgPerDay,
      "demandKgPerDay",
    ),
    initial = (input.waterVolumeM3 * input.initialOxygenMgPerLiter) / 1000,
    target = (input.waterVolumeM3 * input.comparisonOxygenMgPerLiter) / 1000,
    timeToComparisonDays = Math.max(
      0,
      (initial - target) / netDepletionKgPerDay,
    );
  return {
    netDepletionKgPerDay,
    timeToComparisonDays,
    signedProjectedOxygenBalanceKg:
      initial - netDepletionKgPerDay * input.horizonDays,
    comparisonReachedWithinHorizon: timeToComparisonDays <= input.horizonDays,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  waterVolumeM3: 1000,
  initialOxygenMgPerLiter: 5,
  comparisonOxygenMgPerLiter: 1,
  demandKgPerDay: 2,
  supplyKgPerDay: 1,
  horizonDays: 5,
} satisfies Input;
export const exampleOutput = {
  netDepletionKgPerDay: 1,
  timeToComparisonDays: 4,
  signedProjectedOxygenBalanceKg: 0,
  comparisonReachedWithinHorizon: true,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "limnology/anoxia-risk-checker",
  title: "Anoxia Risk Checker",
  description:
    "Screen finite time to a caller oxygen comparison under positive constant net depletion; negative projected balance is an unmet-demand model deficit, not physical negative oxygen or a diagnosis of anoxia.",
  inputs: inputFields,
  outputs: [
    {
      id: "netDepletionKgPerDay",
      label: "Net depletion kg per day",
      kind: "number",
    },
    {
      id: "timeToComparisonDays",
      label: "Time to comparison days",
      kind: "number",
    },
    {
      id: "signedProjectedOxygenBalanceKg",
      label: "Signed projected oxygen balance kg",
      kind: "number",
    },
    {
      id: "comparisonReachedWithinHorizon",
      label: "Comparison reached within horizon",
      kind: "boolean",
    },
  ],
  calculate: (value) =>
    calculate({
      waterVolumeM3: value.waterVolumeM3 as number,
      initialOxygenMgPerLiter: value.initialOxygenMgPerLiter as number,
      comparisonOxygenMgPerLiter: value.comparisonOxygenMgPerLiter as number,
      demandKgPerDay: value.demandKgPerDay as number,
      supplyKgPerDay: value.supplyKgPerDay as number,
      horizonDays: value.horizonDays as number,
    }),
});
export const run = tool.execute;
export default tool;
