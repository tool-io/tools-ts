import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  fraction,
} from "../shared.js";
export type Input = Readonly<{
  readonly contactingWaterMassKg: number;
  readonly availableMagmaHeatJoules: number;
  readonly waterHeatingJoulesPerKg: number;
  readonly waterVaporizationJoulesPerKg: number;
  readonly callerMinimumVaporizedFraction: number;
}>;
export type Output = Readonly<{
  readonly energyLimitedVaporizedWaterFraction: number;
  readonly aboveCallerInteractionCriterion: boolean;
}>;
const inputFields = [
  {
    id: "contactingWaterMassKg",
    label: "Contacting water mass kg",
    kind: "number",
  },
  {
    id: "availableMagmaHeatJoules",
    label: "Available magma heat joules",
    kind: "number",
  },
  {
    id: "waterHeatingJoulesPerKg",
    label: "Water heating joules per kg",
    kind: "number",
  },
  {
    id: "waterVaporizationJoulesPerKg",
    label: "Water vaporization joules per kg",
    kind: "number",
  },
  {
    id: "callerMinimumVaporizedFraction",
    label: "Caller minimum vaporized fraction",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.contactingWaterMassKg, "contactingWaterMassKg");
  positive(input.waterVaporizationJoulesPerKg, "waterVaporizationJoulesPerKg");
  nonnegative(input.availableMagmaHeatJoules, "availableMagmaHeatJoules");
  nonnegative(input.waterHeatingJoulesPerKg, "waterHeatingJoulesPerKg");
  fraction(
    input.callerMinimumVaporizedFraction,
    "callerMinimumVaporizedFraction",
  );
  const energyLimitedVaporizedWaterFraction = Math.min(
    1,
    input.availableMagmaHeatJoules /
      (input.contactingWaterMassKg *
        (input.waterHeatingJoulesPerKg + input.waterVaporizationJoulesPerKg)),
  );
  return {
    energyLimitedVaporizedWaterFraction,
    aboveCallerInteractionCriterion:
      energyLimitedVaporizedWaterFraction >=
      input.callerMinimumVaporizedFraction,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  contactingWaterMassKg: 10,
  availableMagmaHeatJoules: 10000000,
  waterHeatingJoulesPerKg: 100000,
  waterVaporizationJoulesPerKg: 2000000,
  callerMinimumVaporizedFraction: 0.5,
} satisfies Input;
export const exampleOutput = {
  energyLimitedVaporizedWaterFraction: 0.47619047619047616,
  aboveCallerInteractionCriterion: false,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "volcanology/phreatomagmatic-maar-interaction-checker",
  title: "Phreatomagmatic Maar Interaction Checker",
  description:
    "Screen an upper-limit contacting-water vaporization budget including sensible/latent energy with a caller criterion; assumes all available heat transfers and cannot establish explosive phreatomagmatism or safe interaction.",
  inputs: inputFields,
  outputs: [
    {
      id: "energyLimitedVaporizedWaterFraction",
      label: "Energy limited vaporized water fraction",
      kind: "number",
    },
    {
      id: "aboveCallerInteractionCriterion",
      label: "Above caller interaction criterion",
      kind: "boolean",
    },
  ],
  calculate: (value) =>
    calculate({
      contactingWaterMassKg: value.contactingWaterMassKg as number,
      availableMagmaHeatJoules: value.availableMagmaHeatJoules as number,
      waterHeatingJoulesPerKg: value.waterHeatingJoulesPerKg as number,
      waterVaporizationJoulesPerKg:
        value.waterVaporizationJoulesPerKg as number,
      callerMinimumVaporizedFraction:
        value.callerMinimumVaporizedFraction as number,
    }),
});
export const run = tool.execute;
export default tool;
