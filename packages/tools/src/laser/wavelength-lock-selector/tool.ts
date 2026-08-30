import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly absoluteAtomicReferenceRequired: boolean;
  readonly suitableAbsorptionLineAvailable: boolean;
  readonly requiredTuningRangeGhz: number;
  readonly etalonFreeSpectralRangeGhz: number;
}>;
export type Output = Readonly<{
  readonly recommendedLock: string;
  readonly etalonCoversTuningRange: boolean;
}>;

export const calculate = (input: Input): Output => {
  const etalonCoversTuningRange =
    input.etalonFreeSpectralRangeGhz >= input.requiredTuningRangeGhz;
  const recommendedLock =
    input.absoluteAtomicReferenceRequired &&
    input.suitableAbsorptionLineAvailable
      ? etalonCoversTuningRange
        ? "hybrid"
        : "absorption-cell"
      : "etalon";
  return { recommendedLock, etalonCoversTuningRange };
};

export const exampleInput = {
  absoluteAtomicReferenceRequired: true,
  suitableAbsorptionLineAvailable: true,
  requiredTuningRangeGhz: 5,
  etalonFreeSpectralRangeGhz: 10,
} satisfies Input;
export const exampleOutput = {
  recommendedLock: "hybrid",
  etalonCoversTuningRange: true,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  calculate: (input) =>
    calculate({
      absoluteAtomicReferenceRequired:
        input.absoluteAtomicReferenceRequired as boolean,
      suitableAbsorptionLineAvailable:
        input.suitableAbsorptionLineAvailable as boolean,
      requiredTuningRangeGhz: input.requiredTuningRangeGhz as number,
      etalonFreeSpectralRangeGhz: input.etalonFreeSpectralRangeGhz as number,
    }),
  description:
    "Select an absorption-cell, etalon, or hybrid wavelength lock from supplied requirements.",
  id: "laser/wavelength-lock-selector",
  inputs: [
    {
      id: "absoluteAtomicReferenceRequired",
      label: "Absolute atomic reference required",
      kind: "boolean",
    },
    {
      id: "suitableAbsorptionLineAvailable",
      label: "Suitable absorption line available",
      kind: "boolean",
    },
    {
      id: "requiredTuningRangeGhz",
      label: "Required tuning range",
      kind: "number",
      minimum: 0,
      unit: "GHz",
    },
    {
      id: "etalonFreeSpectralRangeGhz",
      label: "Etalon free spectral range",
      kind: "number",
      minimum: 0,
      unit: "GHz",
    },
  ],
  outputs: [
    {
      id: "recommendedLock",
      label: "Recommended lock",
      kind: "string",
      enum: ["absorption-cell", "etalon", "hybrid"],
    },
    {
      id: "etalonCoversTuningRange",
      label: "Etalon covers tuning range",
      kind: "boolean",
    },
  ],
  title: "Wavelength-Lock Selector",
});

export const run = tool.execute;
export default tool;
