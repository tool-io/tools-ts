import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly processTemperatureKelvin: number;
  readonly processSeconds: number;
  readonly referenceTemperatureKelvin: number;
  readonly activationEnergyEv: number;
}>;
export type Output = Readonly<{
  readonly rateRatioToReference: number;
  readonly equivalentReferenceSeconds: number;
}>;

export const calculate = (input: Input): Output => {
  if (
    input.processTemperatureKelvin <= 0 ||
    input.referenceTemperatureKelvin <= 0
  )
    simpleError(
      "processTemperatureKelvin",
      "Temperatures must be positive.",
      "invalid_temperature",
    );
  const rateRatioToReference = Math.exp(
    (-input.activationEnergyEv / 8.617333262145e-5) *
      (1 / input.processTemperatureKelvin -
        1 / input.referenceTemperatureKelvin),
  );
  return {
    rateRatioToReference,
    equivalentReferenceSeconds: input.processSeconds * rateRatioToReference,
  };
};

export const exampleInput = {
  processTemperatureKelvin: 1000,
  processSeconds: 10,
  referenceTemperatureKelvin: 1000,
  activationEnergyEv: 1,
} satisfies Input;
export const exampleOutput = {
  rateRatioToReference: 1,
  equivalentReferenceSeconds: 10,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  calculate: (input) =>
    calculate({
      processTemperatureKelvin: input.processTemperatureKelvin as number,
      processSeconds: input.processSeconds as number,
      referenceTemperatureKelvin: input.referenceTemperatureKelvin as number,
      activationEnergyEv: input.activationEnergyEv as number,
    }),
  description:
    "Convert an annealing step to an Arrhenius-equivalent thermal budget.",
  id: "laser/annealing-thermal-budget",
  inputs: [
    {
      id: "processTemperatureKelvin",
      label: "Process temperature",
      kind: "number",
      minimum: 0,
      unit: "K",
    },
    {
      id: "processSeconds",
      label: "Process duration",
      kind: "number",
      minimum: 0,
      unit: "s",
    },
    {
      id: "referenceTemperatureKelvin",
      label: "Reference temperature",
      kind: "number",
      minimum: 0,
      unit: "K",
    },
    {
      id: "activationEnergyEv",
      label: "Activation energy",
      kind: "number",
      minimum: 0,
      unit: "eV",
    },
  ],
  outputs: [
    {
      id: "rateRatioToReference",
      label: "Arrhenius rate ratio",
      kind: "number",
      minimum: 0,
    },
    {
      id: "equivalentReferenceSeconds",
      label: "Equivalent reference-temperature time",
      kind: "number",
      minimum: 0,
      unit: "s",
    },
  ],
  title: "Annealing Thermal Budget",
});

export const run = tool.execute;
export default tool;
