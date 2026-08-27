import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type RecoveryFactorInput = {
  readonly producedVolumeSm3: number;
  readonly originalOilInPlaceSm3: number;
};

export type RecoveryFactorOutput = {
  readonly recoveryFactor: number;
};

export const calculateRecoveryFactor = (
  input: RecoveryFactorInput,
): RecoveryFactorOutput => {
  if (!(input.producedVolumeSm3 >= 0))
    simpleError(
      "producedVolumeSm3",
      "Produced volume cannot be negative.",
      "invalid_volume",
    );
  if (!(input.originalOilInPlaceSm3 > 0))
    simpleError(
      "originalOilInPlaceSm3",
      "Oil in place must be greater than zero.",
      "invalid_volume",
    );
  return {
    recoveryFactor: input.producedVolumeSm3 / input.originalOilInPlaceSm3,
  };
};

export const recoveryFactorExample = {
  input: { producedVolumeSm3: 12_500_000, originalOilInPlaceSm3: 100_000_000 },
  output: { recoveryFactor: 0.125 },
} satisfies ToolExample<RecoveryFactorInput, RecoveryFactorOutput>;

export const recoveryFactorTool = createSimpleTool({
  id: "geology/recovery-factor",
  title: "Recovery Factor Calculator",
  description:
    "Compute the recovery factor as cumulative produced volume divided by original oil in place.",
  inputs: [
    {
      description: "Cumulative produced volume at stock-tank conditions.",
      id: "producedVolumeSm3",
      kind: "number",
      label: "Produced volume",
      minimum: 0,
      unit: "m3",
    },
    {
      description: "Original oil in place at stock-tank conditions.",
      id: "originalOilInPlaceSm3",
      kind: "number",
      label: "OOIP",
      minimum: 0,
      unit: "m3",
    },
  ],
  outputs: [
    {
      description: "Recovery factor as a fraction of oil in place.",
      id: "recoveryFactor",
      kind: "number",
      label: "Recovery factor",
    },
  ],
  calculate: (input) =>
    calculateRecoveryFactor(input as unknown as RecoveryFactorInput),
});

export const runRecoveryFactor = recoveryFactorTool.execute;
export default recoveryFactorTool;
