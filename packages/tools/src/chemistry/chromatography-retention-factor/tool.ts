import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type ChromatographyRetentionFactorInput = {
  readonly deadTimeMin: number;
  readonly retentionTimeMin: number;
};

export type ChromatographyRetentionFactorOutput = {
  readonly retentionFactor: number;
};

export const chromatographyRetentionFactorExample = {
  input: { retentionTimeMin: 10, deadTimeMin: 2 },
  output: { retentionFactor: 4 },
} satisfies ToolExample<
  ChromatographyRetentionFactorInput,
  ChromatographyRetentionFactorOutput
>;

export const chromatographyRetentionFactorTool = createSimpleTool({
  id: "chemistry/chromatography-retention-factor",
  title: "Retention Factor k",
  description:
    "Compute the chromatographic retention factor k as adjusted retention time divided by the column dead time.",
  inputs: [
    {
      id: "retentionTimeMin",
      label: "Retention time",
      kind: "number",
      unit: "min",
    },
    { id: "deadTimeMin", label: "Dead time", kind: "number", unit: "min" },
  ],
  outputs: [
    { id: "retentionFactor", label: "Retention factor", kind: "number" },
  ],
  calculate: (input) => {
    const retentionTimeMin = input.retentionTimeMin as number;
    const deadTimeMin = input.deadTimeMin as number;
    if (!(retentionTimeMin > 0))
      simpleError(
        "retentionTimeMin",
        "Retention time must be positive.",
        "invalid_times",
      );
    if (!(deadTimeMin > 0))
      simpleError(
        "deadTimeMin",
        "Dead time must be positive.",
        "invalid_times",
      );
    if (retentionTimeMin < deadTimeMin)
      simpleError(
        "retentionTimeMin",
        "Retention time cannot precede the column dead time.",
        "invalid_times",
      );
    return {
      retentionFactor: (retentionTimeMin - deadTimeMin) / deadTimeMin,
    };
  },
});
export const runChromatographyRetentionFactor =
  chromatographyRetentionFactorTool.execute;
export default chromatographyRetentionFactorTool;
