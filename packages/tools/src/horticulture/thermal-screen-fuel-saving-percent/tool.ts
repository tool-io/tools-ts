import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  aligned,
  sum,
} from "../batch34-shared.js";
export type Input = Readonly<{
  readonly matchedUnscreenedFuelUnits: readonly number[];
  readonly matchedScreenedFuelUnits: readonly number[];
  readonly pairedHeatingDegreeHours: readonly number[];
}>;
export type Output = Readonly<{
  readonly unscreenedFuelPerDegreeHour: number;
  readonly screenedFuelPerDegreeHour: number;
  readonly matchedNormalizedFuelSavingFraction: number;
}>;
const inputFields = [
  {
    id: "matchedUnscreenedFuelUnits",
    label: "Matched unscreened fuel units",
    kind: "numberList",
  },
  {
    id: "matchedScreenedFuelUnits",
    label: "Matched screened fuel units",
    kind: "numberList",
  },
  {
    id: "pairedHeatingDegreeHours",
    label: "Paired heating degree hours",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.pairedHeatingDegreeHours.forEach((v) =>
    positive(v, "pairedHeatingDegreeHours"),
  );
  input.matchedUnscreenedFuelUnits.forEach((v) =>
    nonnegative(v, "matchedUnscreenedFuelUnits"),
  );
  input.matchedScreenedFuelUnits.forEach((v) =>
    nonnegative(v, "matchedScreenedFuelUnits"),
  );
  aligned(
    input.matchedUnscreenedFuelUnits,
    input.matchedScreenedFuelUnits,
    "matchedUnscreenedFuelUnits",
  );
  aligned(
    input.matchedUnscreenedFuelUnits,
    input.pairedHeatingDegreeHours,
    "matchedUnscreenedFuelUnits",
  );
  const baseline = sum(input.matchedUnscreenedFuelUnits),
    screened = sum(input.matchedScreenedFuelUnits),
    exposure = sum(input.pairedHeatingDegreeHours);
  positive(baseline, "baseline");
  return {
    unscreenedFuelPerDegreeHour: baseline / exposure,
    screenedFuelPerDegreeHour: screened / exposure,
    matchedNormalizedFuelSavingFraction: (baseline - screened) / baseline,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  matchedUnscreenedFuelUnits: [10, 20],
  matchedScreenedFuelUnits: [8, 15],
  pairedHeatingDegreeHours: [100, 200],
} satisfies Input;
export const exampleOutput = {
  unscreenedFuelPerDegreeHour: 0.1,
  screenedFuelPerDegreeHour: 0.07666666666666666,
  matchedNormalizedFuelSavingFraction: 0.23333333333333334,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "horticulture/thermal-screen-fuel-saving-percent",
  title: "Thermal Screen Fuel Saving Percent Calculator",
  description:
    "Compare actual matched thermal-screen fuel exposures normalized to caller same heating-degree hours; signed increases retained, no universal fuel saving or causal correction for ventilation/crop/weather confounds.",
  inputs: inputFields,
  outputs: [
    {
      id: "unscreenedFuelPerDegreeHour",
      label: "Unscreened fuel per degree hour",
      kind: "number",
    },
    {
      id: "screenedFuelPerDegreeHour",
      label: "Screened fuel per degree hour",
      kind: "number",
    },
    {
      id: "matchedNormalizedFuelSavingFraction",
      label: "Matched normalized fuel saving fraction",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      matchedUnscreenedFuelUnits:
        value.matchedUnscreenedFuelUnits as readonly number[],
      matchedScreenedFuelUnits:
        value.matchedScreenedFuelUnits as readonly number[],
      pairedHeatingDegreeHours:
        value.pairedHeatingDegreeHours as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
