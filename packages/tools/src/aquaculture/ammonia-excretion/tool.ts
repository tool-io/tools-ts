import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type AmmoniaExcretionInput = Readonly<{
  readonly biomassKilograms: number;
  readonly excretionGramsTanPerKgDay: number;
}>;
export type AmmoniaExcretionOutput = Readonly<{
  readonly tanExcretionKgPerDay: number;
}>;

export const calculateAmmoniaExcretion = (
  x: AmmoniaExcretionInput,
): AmmoniaExcretionOutput => {
  if (!Number.isFinite(x.biomassKilograms) || x.biomassKilograms < 0)
    simpleError("biomassKilograms", "Provide a finite nonnegative number.");
  if (
    !Number.isFinite(x.excretionGramsTanPerKgDay) ||
    x.excretionGramsTanPerKgDay < 0
  )
    simpleError(
      "excretionGramsTanPerKgDay",
      "Provide a finite nonnegative number.",
    );
  const tanExcretionKgPerDay =
    (x.biomassKilograms * x.excretionGramsTanPerKgDay) / 1000;
  if (!Number.isFinite(tanExcretionKgPerDay))
    simpleError(
      "tanExcretionKgPerDay",
      "Inputs produce an undefined or out-of-range result.",
    );
  return {
    tanExcretionKgPerDay: Object.is(tanExcretionKgPerDay, -0)
      ? 0
      : tanExcretionKgPerDay,
  };
};

export const example = {
  input: {
    biomassKilograms: 1000,
    excretionGramsTanPerKgDay: 0.2,
  },
  output: { tanExcretionKgPerDay: 0.2 },
} satisfies ToolExample<AmmoniaExcretionInput, AmmoniaExcretionOutput>;

export const tool = createSimpleTool({
  id: "aquaculture/ammonia-excretion",
  title: "Ammonia Excretion",
  description:
    "Estimate daily total-ammonia-nitrogen excretion from biomass and an externally determined excretion rate.",
  inputs: [
    {
      id: "biomassKilograms",
      kind: "number",
      label: "Biomass Kilograms",
      unit: "kg",
    },
    {
      id: "excretionGramsTanPerKgDay",
      kind: "number",
      label: "Excretion Grams TAN Per Kg Day",
      unit: "g TAN/(kg·day)",
    },
  ],
  outputs: [
    {
      id: "tanExcretionKgPerDay",
      kind: "number",
      label: "TAN Excretion Kg Per Day",
      unit: "kg TAN/day",
    },
  ],
  calculate: (input) =>
    calculateAmmoniaExcretion({
      biomassKilograms: input.biomassKilograms as number,
      excretionGramsTanPerKgDay: input.excretionGramsTanPerKgDay as number,
    }),
});
export const runAmmoniaExcretion = tool.execute;
export default tool;
