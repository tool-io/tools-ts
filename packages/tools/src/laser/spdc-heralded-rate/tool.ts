import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly generatedPairRatePerSecond: number;
  readonly signalDetectionEfficiency: number;
  readonly idlerDetectionEfficiency: number;
}>;
export type Output = Readonly<{
  readonly coincidenceRatePerSecond: number;
  readonly signalSinglesRatePerSecond: number;
  readonly idlerHeraldingEfficiency: number;
}>;

export const calculate = (input: Input): Output => {
  const coincidenceRatePerSecond =
    input.generatedPairRatePerSecond *
    input.signalDetectionEfficiency *
    input.idlerDetectionEfficiency;
  const signalSinglesRatePerSecond =
    input.generatedPairRatePerSecond * input.signalDetectionEfficiency;
  return {
    coincidenceRatePerSecond,
    signalSinglesRatePerSecond,
    idlerHeraldingEfficiency:
      signalSinglesRatePerSecond === 0
        ? 0
        : coincidenceRatePerSecond / signalSinglesRatePerSecond,
  };
};

export const exampleInput = {
  generatedPairRatePerSecond: 1000000,
  signalDetectionEfficiency: 0.5,
  idlerDetectionEfficiency: 0.4,
} satisfies Input;
export const exampleOutput = {
  coincidenceRatePerSecond: 200000,
  signalSinglesRatePerSecond: 500000,
  idlerHeraldingEfficiency: 0.4,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  calculate: (input) =>
    calculate({
      generatedPairRatePerSecond: input.generatedPairRatePerSecond as number,
      signalDetectionEfficiency: input.signalDetectionEfficiency as number,
      idlerDetectionEfficiency: input.idlerDetectionEfficiency as number,
    }),
  description:
    "Estimate detected SPDC coincidence, singles, and heralding rates from supplied efficiencies.",
  id: "laser/spdc-heralded-rate",
  inputs: [
    {
      id: "generatedPairRatePerSecond",
      label: "Generated pair rate",
      kind: "number",
      minimum: 0,
      unit: "pairs/s",
    },
    {
      id: "signalDetectionEfficiency",
      label: "Signal detection efficiency",
      kind: "number",
      minimum: 0,
      maximum: 1,
    },
    {
      id: "idlerDetectionEfficiency",
      label: "Idler detection efficiency",
      kind: "number",
      minimum: 0,
      maximum: 1,
    },
  ],
  outputs: [
    {
      id: "coincidenceRatePerSecond",
      label: "Detected coincidence rate",
      kind: "number",
      minimum: 0,
      unit: "counts/s",
    },
    {
      id: "signalSinglesRatePerSecond",
      label: "Signal singles rate",
      kind: "number",
      minimum: 0,
      unit: "counts/s",
    },
    {
      id: "idlerHeraldingEfficiency",
      label: "Idler heralding efficiency",
      kind: "number",
      minimum: 0,
      maximum: 1,
    },
  ],
  title: "SPDC Heralded Rate",
});

export const run = tool.execute;
export default tool;
