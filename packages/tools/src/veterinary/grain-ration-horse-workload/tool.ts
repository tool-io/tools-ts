import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
} from "../batch47-shared.js";
export type Input = Readonly<{
  readonly callerVeterinarianEstablishedWorkloadEnergyBudgetKcal: number;
  readonly actualOtherRationEnergyKcal: number;
  readonly verifiedGrainEnergyKcalPerKg: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "callerVeterinarianEstablishedWorkloadEnergyBudgetKcal",
    label: "Caller veterinarian established workload energy budget kcal",
    kind: "number",
  },
  {
    id: "actualOtherRationEnergyKcal",
    label: "Actual other ration energy kcal",
    kind: "number",
  },
  {
    id: "verifiedGrainEnergyKcalPerKg",
    label: "Verified grain energy kcal per kg",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  positive(
    input.callerVeterinarianEstablishedWorkloadEnergyBudgetKcal,
    "independent-budget",
  );
  nonnegative(input.actualOtherRationEnergyKcal, "actual-ration");
  positive(input.verifiedGrainEnergyKcalPerKg, "energy-density");
  return {
    signedConditionalRemainingGrainEquivalentKg:
      (input.callerVeterinarianEstablishedWorkloadEnergyBudgetKcal -
        input.actualOtherRationEnergyKcal) /
      input.verifiedGrainEnergyKcalPerKg,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    callerVeterinarianEstablishedWorkloadEnergyBudgetKcal: 10000,
    actualOtherRationEnergyKcal: 7000,
    verifiedGrainEnergyKcalPerKg: 3000,
  },
  output: { result: { signedConditionalRemainingGrainEquivalentKg: 1 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "veterinary/grain-ration-horse-workload",
  title: "Horse Grain Ration By Workload Calculator",
  description:
    "Independent veterinarian workload-specific energy budget reconciliation to grain-energy equivalents only, not a grain feeding prescription, starch tolerance, complete ration or safe meal size. Signed excess retained.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Qualified observation, conditional calculation or reference",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
