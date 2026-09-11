import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
} from "../batch47-shared.js";
export type Input = Readonly<{
  readonly callerVeterinarianEstablishedDailyEnergyBudgetKcal: number;
  readonly verifiedFoodMetabolizableEnergyKcalPerGram: number;
  readonly actualOtherFoodEnergyKcal: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "callerVeterinarianEstablishedDailyEnergyBudgetKcal",
    label: "Caller veterinarian established daily energy budget kcal",
    kind: "number",
  },
  {
    id: "verifiedFoodMetabolizableEnergyKcalPerGram",
    label: "Verified food metabolizable energy kcal per gram",
    kind: "number",
  },
  {
    id: "actualOtherFoodEnergyKcal",
    label: "Actual other food energy kcal",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  positive(
    input.callerVeterinarianEstablishedDailyEnergyBudgetKcal,
    "clinical-budget",
  );
  positive(
    input.verifiedFoodMetabolizableEnergyKcalPerGram,
    "verified-density",
  );
  nonnegative(input.actualOtherFoodEnergyKcal, "actual-other-energy");
  return {
    signedConditionalRemainingFoodGrams:
      (input.callerVeterinarianEstablishedDailyEnergyBudgetKcal -
        input.actualOtherFoodEnergyKcal) /
      input.verifiedFoodMetabolizableEnergyKcalPerGram,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    callerVeterinarianEstablishedDailyEnergyBudgetKcal: 400,
    verifiedFoodMetabolizableEnergyKcalPerGram: 4,
    actualOtherFoodEnergyKcal: 40,
  },
  output: { result: { signedConditionalRemainingFoodGrams: 90 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "veterinary/calorie-intake-weight-loss-pet",
  title: "Pet Weight Loss Calorie Intake Calculator",
  description:
    "Independently veterinarian established weight-management budget minus actual other-food energy divided by verified food energy density. Signed budget overrun retained; no target weight, calorie deficit, weight-loss efficacy or safety prescription.",
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
