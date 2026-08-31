import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
} from "../batch32-shared.js";
export type Input = Readonly<{
  readonly referenceRateFactor: number;
  readonly referenceTemperatureKelvin: number;
  readonly targetTemperatureKelvin: number;
  readonly activationEnergyJMol: number;
  readonly gasConstantJMolKelvin: number;
}>;
export type Output = Readonly<{
  readonly targetRateFactor: number;
  readonly rateFactorTemperatureRatio: number;
}>;
const inputFields = [
  { id: "referenceRateFactor", label: "Reference rate factor", kind: "number" },
  {
    id: "referenceTemperatureKelvin",
    label: "Reference temperature kelvin",
    kind: "number",
  },
  {
    id: "targetTemperatureKelvin",
    label: "Target temperature kelvin",
    kind: "number",
  },
  {
    id: "activationEnergyJMol",
    label: "Activation energy j mol",
    kind: "number",
  },
  {
    id: "gasConstantJMolKelvin",
    label: "Gas constant j mol kelvin",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.referenceRateFactor, "referenceRateFactor");
  positive(input.referenceTemperatureKelvin, "referenceTemperatureKelvin");
  positive(input.targetTemperatureKelvin, "targetTemperatureKelvin");
  positive(input.gasConstantJMolKelvin, "gasConstantJMolKelvin");
  nonnegative(input.activationEnergyJMol, "activationEnergyJMol");
  if (
    input.referenceTemperatureKelvin > 273.15 ||
    input.targetTemperatureKelvin > 273.15
  )
    simpleError(
      "temperature",
      "Submelting positive Kelvin ice temperatures required; pressure and regime applicability caller supplied.",
    );
  const logRatio =
      (input.activationEnergyJMol / input.gasConstantJMolKelvin) *
      (1 / input.referenceTemperatureKelvin -
        1 / input.targetTemperatureKelvin),
    ratio = Math.exp(logRatio);
  if (!Number.isFinite(ratio) || ratio === 0)
    simpleError(
      "range",
      "Arrhenius factor outside finite representable positive range.",
    );
  return {
    targetRateFactor: input.referenceRateFactor * ratio,
    rateFactorTemperatureRatio: ratio,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  referenceRateFactor: 2,
  referenceTemperatureKelvin: 250,
  targetTemperatureKelvin: 250,
  activationEnergyJMol: 60000,
  gasConstantJMolKelvin: 8.314,
} satisfies Input;
export const exampleOutput = {
  targetRateFactor: 2,
  rateFactorTemperatureRatio: 1,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "glaciology/rate-factor-arrhenius-temperature",
  title: "Rate Factor Arrhenius Temperature Calculator",
  description:
    "Scale reference Glen rate factor by explicit activation energy over one caller Arrhenius regime; no universal two-regime switch, pressure-melting correction or stress/strain fit.",
  inputs: inputFields,
  outputs: [
    { id: "targetRateFactor", label: "Target rate factor", kind: "number" },
    {
      id: "rateFactorTemperatureRatio",
      label: "Rate factor temperature ratio",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      referenceRateFactor: value.referenceRateFactor as number,
      referenceTemperatureKelvin: value.referenceTemperatureKelvin as number,
      targetTemperatureKelvin: value.targetTemperatureKelvin as number,
      activationEnergyJMol: value.activationEnergyJMol as number,
      gasConstantJMolKelvin: value.gasConstantJMolKelvin as number,
    }),
});
export const run = tool.execute;
export default tool;
