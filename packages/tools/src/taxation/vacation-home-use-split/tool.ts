import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly personalUseDays: number;
  readonly rentalDays: number;
  readonly fixedPersonalDayThreshold: number;
  readonly rentalDayPercentThreshold: number;
}>;
export type Output = Readonly<{
  readonly percentageBasedThresholdDays: number;
  readonly applicablePersonalUseThresholdDays: number;
  readonly exceedsPersonalUseThreshold: boolean;
  readonly rentalUsePercent: number;
}>;

export const calculate = (input: Input): Output => {
  const totalDays = input.personalUseDays + input.rentalDays;
  if (totalDays === 0)
    simpleError("rentalDays", "At least one use day is required.", "zero_use");
  const percentageBasedThresholdDays =
    (input.rentalDays * input.rentalDayPercentThreshold) / 100;
  const applicablePersonalUseThresholdDays = Math.max(
    input.fixedPersonalDayThreshold,
    percentageBasedThresholdDays,
  );
  return {
    percentageBasedThresholdDays,
    applicablePersonalUseThresholdDays,
    exceedsPersonalUseThreshold:
      input.personalUseDays > applicablePersonalUseThresholdDays,
    rentalUsePercent: (input.rentalDays / totalDays) * 100,
  };
};

export const exampleInput = {
  personalUseDays: 20,
  rentalDays: 100,
  fixedPersonalDayThreshold: 14,
  rentalDayPercentThreshold: 10,
} satisfies Input;
export const exampleOutput = {
  percentageBasedThresholdDays: 10,
  applicablePersonalUseThresholdDays: 14,
  exceedsPersonalUseThreshold: true,
  rentalUsePercent: 83.33333333333334,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  calculate: (input) =>
    calculate({
      personalUseDays: input.personalUseDays as number,
      rentalDays: input.rentalDays as number,
      fixedPersonalDayThreshold: input.fixedPersonalDayThreshold as number,
      rentalDayPercentThreshold: input.rentalDayPercentThreshold as number,
    }),
  description:
    "Split vacation-home use and compare personal days with caller-supplied fixed and percentage thresholds.",
  id: "taxation/vacation-home-use-split",
  inputs: [
    {
      id: "personalUseDays",
      label: "Personal-use days",
      kind: "integer",
      minimum: 0,
    },
    { id: "rentalDays", label: "Rental days", kind: "integer", minimum: 0 },
    {
      id: "fixedPersonalDayThreshold",
      label: "Fixed personal-day threshold",
      kind: "integer",
      minimum: 0,
    },
    {
      id: "rentalDayPercentThreshold",
      label: "Rental-day percentage threshold",
      kind: "number",
      minimum: 0,
      maximum: 100,
      unit: "%",
    },
  ],
  outputs: [
    {
      id: "percentageBasedThresholdDays",
      label: "Percentage-based threshold",
      kind: "number",
      minimum: 0,
      unit: "days",
    },
    {
      id: "applicablePersonalUseThresholdDays",
      label: "Applicable personal-use threshold",
      kind: "number",
      minimum: 0,
      unit: "days",
    },
    {
      id: "exceedsPersonalUseThreshold",
      label: "Exceeds personal-use threshold",
      kind: "boolean",
    },
    {
      id: "rentalUsePercent",
      label: "Rental-use percentage",
      kind: "number",
      minimum: 0,
      maximum: 100,
      unit: "%",
    },
  ],
  title: "Vacation-Home Use Split",
});

export const run = tool.execute;
export default tool;
