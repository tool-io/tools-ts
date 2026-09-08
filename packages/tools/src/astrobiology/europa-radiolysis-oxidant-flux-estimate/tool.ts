import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  nonnegative,
  fraction,
} from "../batch46-shared.js";
export type Input = Readonly<{
  readonly callerCalibratedDepositedEnergyEvPerSquareCmPerSecond: number;
  readonly callerValidatedOxidantMoleculesPer100Ev: number;
  readonly callerCalibratedSurvivingFraction: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "callerCalibratedDepositedEnergyEvPerSquareCmPerSecond",
    label: "Caller calibrated deposited energy ev per square cm per second",
    kind: "number",
  },
  {
    id: "callerValidatedOxidantMoleculesPer100Ev",
    label: "Caller validated oxidant molecules per100 ev",
    kind: "number",
  },
  {
    id: "callerCalibratedSurvivingFraction",
    label: "Caller calibrated surviving fraction",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  nonnegative(
    input.callerCalibratedDepositedEnergyEvPerSquareCmPerSecond,
    "energy",
  );
  nonnegative(input.callerValidatedOxidantMoleculesPer100Ev, "yield");
  fraction(input.callerCalibratedSurvivingFraction, "survival");
  return {
    conditionalOxidantMoleculesPerSquareCmPerSecond:
      ((input.callerCalibratedDepositedEnergyEvPerSquareCmPerSecond *
        input.callerValidatedOxidantMoleculesPer100Ev) /
        100) *
      input.callerCalibratedSurvivingFraction,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    callerCalibratedDepositedEnergyEvPerSquareCmPerSecond: 100,
    callerValidatedOxidantMoleculesPer100Ev: 2,
    callerCalibratedSurvivingFraction: 0.5,
  },
  output: { result: { conditionalOxidantMoleculesPerSquareCmPerSecond: 1 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "astrobiology/europa-radiolysis-oxidant-flux-estimate",
  title: "Europa Radiolysis Oxidant Flux molecules/cm2/s Estimate Calculator",
  description:
    "Conditional Europan radiolysis G-value yield with actual modeled energy deposition and independently validated matched molecule/100eVyield/survival. Not transport into ocean, life-supporting flux or measured biosignature.",
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
