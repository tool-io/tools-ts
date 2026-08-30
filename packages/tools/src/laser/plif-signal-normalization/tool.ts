import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly measuredSignal: number;
  readonly backgroundSignal: number;
  readonly laserSheetEnergyMillijoules: number;
  readonly collectionGain: number;
}>;
export type Output = Readonly<{
  readonly backgroundCorrectedSignal: number;
  readonly normalizedSignalPerMillijoule: number;
}>;

export const calculate = (input: Input): Output => {
  const denominator = input.laserSheetEnergyMillijoules * input.collectionGain;
  if (denominator <= 0)
    simpleError(
      "laserSheetEnergyMillijoules",
      "Energy and collection gain must produce a positive denominator.",
      "invalid_denominator",
    );
  const backgroundCorrectedSignal =
    input.measuredSignal - input.backgroundSignal;
  return {
    backgroundCorrectedSignal,
    normalizedSignalPerMillijoule: backgroundCorrectedSignal / denominator,
  };
};

export const exampleInput = {
  measuredSignal: 110,
  backgroundSignal: 10,
  laserSheetEnergyMillijoules: 2,
  collectionGain: 5,
} satisfies Input;
export const exampleOutput = {
  backgroundCorrectedSignal: 100,
  normalizedSignalPerMillijoule: 10,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  calculate: (input) =>
    calculate({
      measuredSignal: input.measuredSignal as number,
      backgroundSignal: input.backgroundSignal as number,
      laserSheetEnergyMillijoules: input.laserSheetEnergyMillijoules as number,
      collectionGain: input.collectionGain as number,
    }),
  description:
    "Background-correct and normalize PLIF signal by sheet energy and collection gain.",
  id: "laser/plif-signal-normalization",
  inputs: [
    {
      id: "measuredSignal",
      label: "Measured PLIF signal",
      kind: "number",
      minimum: 0,
    },
    {
      id: "backgroundSignal",
      label: "Background signal",
      kind: "number",
      minimum: 0,
    },
    {
      id: "laserSheetEnergyMillijoules",
      label: "Laser-sheet energy",
      kind: "number",
      minimum: 0,
      unit: "mJ",
    },
    {
      id: "collectionGain",
      label: "Collection gain",
      kind: "number",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "backgroundCorrectedSignal",
      label: "Background-corrected signal",
      kind: "number",
    },
    {
      id: "normalizedSignalPerMillijoule",
      label: "Normalized signal",
      kind: "number",
      unit: "1/mJ",
    },
  ],
  title: "PLIF Signal Normalization",
});

export const run = tool.execute;
export default tool;
