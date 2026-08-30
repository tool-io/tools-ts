import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type PetFeeIncomeInput = Readonly<{
  readonly payingPets: number;
  readonly monthlyFeePerPet: number;
}>;
export type PetFeeIncomeOutput = Readonly<{
  readonly monthlyIncome: number;
}>;

export const calculatePetFeeIncome = (
  x: PetFeeIncomeInput,
): PetFeeIncomeOutput => {
  if (!Number.isFinite(x.payingPets) || x.payingPets < 0)
    simpleError("payingPets", "Provide a finite nonnegative number.");
  if (!Number.isFinite(x.monthlyFeePerPet) || x.monthlyFeePerPet < 0)
    simpleError("monthlyFeePerPet", "Provide a finite nonnegative number.");
  if (!Number.isInteger(x.payingPets))
    simpleError("input", "Inputs violate the stated model or operating range.");
  const monthlyIncome = x.payingPets * x.monthlyFeePerPet;
  if (!Number.isFinite(monthlyIncome))
    simpleError(
      "monthlyIncome",
      "Inputs produce an undefined or out-of-range result.",
    );
  return { monthlyIncome: Object.is(monthlyIncome, -0) ? 0 : monthlyIncome };
};

export const example = {
  input: {
    payingPets: 12,
    monthlyFeePerPet: 25,
  },
  output: { monthlyIncome: 300 },
} satisfies ToolExample<PetFeeIncomeInput, PetFeeIncomeOutput>;

export const tool = createSimpleTool({
  id: "real-estate/pet-fee-income",
  title: "Pet Fee Income",
  description:
    "Monthly pet-fee income from paying pets and monthly fee per pet.",
  inputs: [
    { id: "payingPets", kind: "number", label: "Paying Pets", minimum: 0 },
    {
      id: "monthlyFeePerPet",
      kind: "number",
      label: "Monthly Fee Per Pet",
      unit: "currency",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "monthlyIncome",
      kind: "number",
      label: "Monthly Income",
      unit: "currency",
    },
  ],
  calculate: (input) =>
    calculatePetFeeIncome({
      payingPets: input.payingPets as number,
      monthlyFeePerPet: input.monthlyFeePerPet as number,
    }),
});
export const petFeeIncomeTool = tool;
export const runPetFeeIncome = tool.execute;
export default tool;
