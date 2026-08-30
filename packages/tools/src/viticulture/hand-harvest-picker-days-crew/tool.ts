import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  fraction,
  count,
  aligned,
  safeCeil,
} from "../shared.js";
export type Input = Readonly<{
  readonly blockHarvestMassesKg: readonly number[];
  readonly observedPickerRatesKgPerProductiveHour: readonly number[];
  readonly scheduledHoursPerPickerDay: number;
  readonly productiveTimeFractions: readonly number[];
  readonly availableWholeDays: number;
}>;
export type Output = Readonly<{
  readonly requiredPickerDaysByBlock: readonly number[];
  readonly totalRequiredPickerDays: number;
  readonly minimumWholeCrewForAvailableDays: number;
}>;
const inputFields = [
  {
    id: "blockHarvestMassesKg",
    label: "Block harvest masses kg",
    kind: "numberList",
  },
  {
    id: "observedPickerRatesKgPerProductiveHour",
    label: "Observed picker rates kg per productive hour",
    kind: "numberList",
  },
  {
    id: "scheduledHoursPerPickerDay",
    label: "Scheduled hours per picker day",
    kind: "number",
  },
  {
    id: "productiveTimeFractions",
    label: "Productive time fractions",
    kind: "numberList",
  },
  { id: "availableWholeDays", label: "Available whole days", kind: "integer" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.observedPickerRatesKgPerProductiveHour.forEach((v) =>
    positive(v, "observedPickerRatesKgPerProductiveHour"),
  );
  positive(input.scheduledHoursPerPickerDay, "scheduledHoursPerPickerDay");
  input.productiveTimeFractions.forEach((v) =>
    positive(v, "productiveTimeFractions"),
  );
  positive(input.availableWholeDays, "availableWholeDays");
  input.blockHarvestMassesKg.forEach((v) =>
    nonnegative(v, "blockHarvestMassesKg"),
  );
  input.productiveTimeFractions.forEach((v) =>
    fraction(v, "productiveTimeFractions"),
  );
  count(input.availableWholeDays, "availableWholeDays");
  aligned(
    input.blockHarvestMassesKg,
    input.observedPickerRatesKgPerProductiveHour,
    "blockHarvestMassesKg",
  );
  aligned(
    input.blockHarvestMassesKg,
    input.productiveTimeFractions,
    "blockHarvestMassesKg",
  );
  const requiredPickerDaysByBlock = input.blockHarvestMassesKg.map(
      (m, i) =>
        m /
        (input.observedPickerRatesKgPerProductiveHour[i] *
          input.scheduledHoursPerPickerDay *
          input.productiveTimeFractions[i]),
    ),
    totalRequiredPickerDays = requiredPickerDaysByBlock.reduce(
      (a, b) => a + b,
      0,
    );
  return {
    requiredPickerDaysByBlock,
    totalRequiredPickerDays,
    minimumWholeCrewForAvailableDays: safeCeil(
      totalRequiredPickerDays / input.availableWholeDays,
      "crew",
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  blockHarvestMassesKg: [1000, 2000],
  observedPickerRatesKgPerProductiveHour: [100, 200],
  scheduledHoursPerPickerDay: 8,
  productiveTimeFractions: [0.5, 1],
  availableWholeDays: 2,
} satisfies Input;
export const exampleOutput = {
  requiredPickerDaysByBlock: [2.5, 1.25],
  totalRequiredPickerDays: 3.75,
  minimumWholeCrewForAvailableDays: 2,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "viticulture/hand-harvest-picker-days-crew",
  title: "Hand Harvest Picker Days Crew",
  description:
    "Budget heterogeneous block picker-day exposure with measured productive rates and explicit scheduled-time utilization, assuming freely allocatable crew-days; not a harvesting completion/welfare or work-safety guarantee.",
  inputs: inputFields,
  outputs: [
    {
      id: "requiredPickerDaysByBlock",
      label: "Required picker days by block",
      kind: "numberList",
    },
    {
      id: "totalRequiredPickerDays",
      label: "Total required picker days",
      kind: "number",
    },
    {
      id: "minimumWholeCrewForAvailableDays",
      label: "Minimum whole crew for available days",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      blockHarvestMassesKg: value.blockHarvestMassesKg as readonly number[],
      observedPickerRatesKgPerProductiveHour:
        value.observedPickerRatesKgPerProductiveHour as readonly number[],
      scheduledHoursPerPickerDay: value.scheduledHoursPerPickerDay as number,
      productiveTimeFractions:
        value.productiveTimeFractions as readonly number[],
      availableWholeDays: value.availableWholeDays as number,
    }),
});
export const run = tool.execute;
export default tool;
