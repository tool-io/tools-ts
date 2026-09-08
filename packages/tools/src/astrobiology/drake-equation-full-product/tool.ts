import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  nonnegative,
  fraction,
} from "../batch46-shared.js";
export type Input = Readonly<{
  readonly callerCalibratedStarFormationPerYear: number;
  readonly callerCalibratedPlanetHostingFraction: number;
  readonly callerCalibratedHabitableWorldsPerSystem: number;
  readonly callerCalibratedLifeFraction: number;
  readonly callerCalibratedIntelligenceFraction: number;
  readonly callerCalibratedCommunicatingFraction: number;
  readonly callerCalibratedCommunicatingLifetimeYears: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "callerCalibratedStarFormationPerYear",
    label: "Caller calibrated star formation per year",
    kind: "number",
  },
  {
    id: "callerCalibratedPlanetHostingFraction",
    label: "Caller calibrated planet hosting fraction",
    kind: "number",
  },
  {
    id: "callerCalibratedHabitableWorldsPerSystem",
    label: "Caller calibrated habitable worlds per system",
    kind: "number",
  },
  {
    id: "callerCalibratedLifeFraction",
    label: "Caller calibrated life fraction",
    kind: "number",
  },
  {
    id: "callerCalibratedIntelligenceFraction",
    label: "Caller calibrated intelligence fraction",
    kind: "number",
  },
  {
    id: "callerCalibratedCommunicatingFraction",
    label: "Caller calibrated communicating fraction",
    kind: "number",
  },
  {
    id: "callerCalibratedCommunicatingLifetimeYears",
    label: "Caller calibrated communicating lifetime years",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  [
    input.callerCalibratedStarFormationPerYear,
    input.callerCalibratedHabitableWorldsPerSystem,
    input.callerCalibratedCommunicatingLifetimeYears,
  ].forEach((v) => nonnegative(v, "rate/lifetime"));
  [
    input.callerCalibratedPlanetHostingFraction,
    input.callerCalibratedLifeFraction,
    input.callerCalibratedIntelligenceFraction,
    input.callerCalibratedCommunicatingFraction,
  ].forEach((v) => fraction(v, "fraction"));
  return {
    conditionalSimultaneouslyCommunicatingCivilizations:
      input.callerCalibratedStarFormationPerYear *
      input.callerCalibratedPlanetHostingFraction *
      input.callerCalibratedHabitableWorldsPerSystem *
      input.callerCalibratedLifeFraction *
      input.callerCalibratedIntelligenceFraction *
      input.callerCalibratedCommunicatingFraction *
      input.callerCalibratedCommunicatingLifetimeYears,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    callerCalibratedStarFormationPerYear: 2,
    callerCalibratedPlanetHostingFraction: 0.5,
    callerCalibratedHabitableWorldsPerSystem: 1,
    callerCalibratedLifeFraction: 0.1,
    callerCalibratedIntelligenceFraction: 0.1,
    callerCalibratedCommunicatingFraction: 0.5,
    callerCalibratedCommunicatingLifetimeYears: 1000,
  },
  output: {
    result: { conditionalSimultaneouslyCommunicatingCivilizations: 5 },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "astrobiology/drake-equation-full-product",
  title: "Drake Equation Full Product Civilizations Count Calculator",
  description:
    "Full conditional seven-factor Drake steady-state expected simultaneous communicating-civilization count. Caller independently establishes compatible formation, planet/world, life/intelligence/communication fractions and lifetime assumptions; no measured universal probability, integer census or evidence extraterrestrial civilizations exist.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculated observation or qualified reference",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
