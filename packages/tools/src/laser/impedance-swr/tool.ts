import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly loadResistanceOhms: number;
  readonly lineImpedanceOhms: number;
}>;
export type Output = Readonly<{
  readonly reflectionCoefficientMagnitude: number;
  readonly standingWaveRatio: number;
  readonly returnLossDb: number;
}>;

export const calculate = (input: Input): Output => {
  if (input.lineImpedanceOhms <= 0)
    simpleError(
      "lineImpedanceOhms",
      "Line impedance must be positive.",
      "invalid_impedance",
    );
  const reflectionCoefficientMagnitude = Math.abs(
    (input.loadResistanceOhms - input.lineImpedanceOhms) /
      (input.loadResistanceOhms + input.lineImpedanceOhms),
  );
  if (reflectionCoefficientMagnitude >= 1)
    return {
      reflectionCoefficientMagnitude,
      standingWaveRatio: Number.MAX_VALUE,
      returnLossDb: 0,
    };
  return {
    reflectionCoefficientMagnitude,
    standingWaveRatio:
      (1 + reflectionCoefficientMagnitude) /
      (1 - reflectionCoefficientMagnitude),
    returnLossDb:
      reflectionCoefficientMagnitude === 0
        ? Number.MAX_VALUE
        : -20 * Math.log10(reflectionCoefficientMagnitude),
  };
};

export const exampleInput = {
  loadResistanceOhms: 75,
  lineImpedanceOhms: 50,
} satisfies Input;
export const exampleOutput = {
  reflectionCoefficientMagnitude: 0.2,
  standingWaveRatio: 1.4999999999999998,
  returnLossDb: 13.979400086720375,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  calculate: (input) =>
    calculate({
      loadResistanceOhms: input.loadResistanceOhms as number,
      lineImpedanceOhms: input.lineImpedanceOhms as number,
    }),
  description:
    "Calculate resistive-load reflection coefficient, SWR, and return loss.",
  id: "laser/impedance-swr",
  inputs: [
    {
      id: "loadResistanceOhms",
      label: "Resistive load",
      kind: "number",
      minimum: 0,
      unit: "Ω",
    },
    {
      id: "lineImpedanceOhms",
      label: "Line impedance",
      kind: "number",
      minimum: 0,
      unit: "Ω",
    },
  ],
  outputs: [
    {
      id: "reflectionCoefficientMagnitude",
      label: "Reflection coefficient magnitude",
      kind: "number",
      minimum: 0,
      maximum: 1,
    },
    {
      id: "standingWaveRatio",
      label: "Standing-wave ratio",
      kind: "number",
      minimum: 1,
    },
    {
      id: "returnLossDb",
      label: "Return loss",
      kind: "number",
      minimum: 0,
      unit: "dB",
    },
  ],
  title: "Impedance SWR",
});

export const run = tool.execute;
export default tool;
