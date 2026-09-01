import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  fraction,
} from "../batch35-shared.js";
export type Input = Readonly<{
  readonly observedWaterLitersDay: number;
  readonly observedHardnessMgCaco3Liter: number;
  readonly callerDaysBetweenRegeneration: number;
  readonly callerUsableResinCapacityFraction: number;
}>;
export type Output = Readonly<{
  readonly requiredUsableHardnessCapacityGramsCaco3: number;
  readonly requiredRatedHardnessCapacityGramsCaco3: number;
}>;
const inputFields = [
  {
    id: "observedWaterLitersDay",
    label: "Observed water liters day",
    kind: "number",
  },
  {
    id: "observedHardnessMgCaco3Liter",
    label: "Observed hardness mg caco3 liter",
    kind: "number",
  },
  {
    id: "callerDaysBetweenRegeneration",
    label: "Caller days between regeneration",
    kind: "number",
  },
  {
    id: "callerUsableResinCapacityFraction",
    label: "Caller usable resin capacity fraction",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(
    input.callerUsableResinCapacityFraction,
    "callerUsableResinCapacityFraction",
  );
  nonnegative(input.observedWaterLitersDay, "observedWaterLitersDay");
  nonnegative(
    input.observedHardnessMgCaco3Liter,
    "observedHardnessMgCaco3Liter",
  );
  nonnegative(
    input.callerDaysBetweenRegeneration,
    "callerDaysBetweenRegeneration",
  );
  fraction(
    input.callerUsableResinCapacityFraction,
    "callerUsableResinCapacityFraction",
  );
  const load =
    ((input.observedWaterLitersDay * input.observedHardnessMgCaco3Liter) /
      1000) *
    input.callerDaysBetweenRegeneration;
  return {
    requiredUsableHardnessCapacityGramsCaco3: load,
    requiredRatedHardnessCapacityGramsCaco3:
      load / input.callerUsableResinCapacityFraction,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedWaterLitersDay: 100,
  observedHardnessMgCaco3Liter: 200,
  callerDaysBetweenRegeneration: 3,
  callerUsableResinCapacityFraction: 0.8,
} satisfies Input;
export const exampleOutput = {
  requiredUsableHardnessCapacityGramsCaco3: 60,
  requiredRatedHardnessCapacityGramsCaco3: 75,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "plumbing/water-softener-capacity",
  title: "Plumbing Water Softener Capacity Calculator",
  description:
    "Budget measured hardness-volume duty over caller regeneration interval and usable resin fraction, explicit CaCO3-equivalent grams; not nominal grains conversion or softener efficacy/dosing advice.",
  inputs: inputFields,
  outputs: [
    {
      id: "requiredUsableHardnessCapacityGramsCaco3",
      label: "Required usable hardness capacity grams caco3",
      kind: "number",
    },
    {
      id: "requiredRatedHardnessCapacityGramsCaco3",
      label: "Required rated hardness capacity grams caco3",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      observedWaterLitersDay: value.observedWaterLitersDay as number,
      observedHardnessMgCaco3Liter:
        value.observedHardnessMgCaco3Liter as number,
      callerDaysBetweenRegeneration:
        value.callerDaysBetweenRegeneration as number,
      callerUsableResinCapacityFraction:
        value.callerUsableResinCapacityFraction as number,
    }),
});
export const run = tool.execute;
export default tool;
