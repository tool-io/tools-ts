import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type ChromatographyCapacityFactorInput = {
  readonly deadTimeMin: number;
  readonly retentionTimeMin: number;
};

export type ChromatographyCapacityFactorOutput = {
  readonly capacityFactor: number;
};

export const chromatographyCapacityFactorExample = {
  input: { retentionTimeMin: 8, deadTimeMin: 2 },
  output: { capacityFactor: 3 },
} satisfies ToolExample<
  ChromatographyCapacityFactorInput,
  ChromatographyCapacityFactorOutput
>;

export const chromatographyCapacityFactorTool = createSimpleTool({
  id: "chemistry/chromatography-capacity-factor",
  title: "Capacity Factor k'",
  description:
    "Compute the capacity factor k-prime as adjusted retention time over dead time for a retained analyte.",
  inputs: [
    {
      id: "retentionTimeMin",
      label: "Retention time",
      kind: "number",
      unit: "min",
    },
    { id: "deadTimeMin", label: "Dead time", kind: "number", unit: "min" },
  ],
  outputs: [{ id: "capacityFactor", label: "Capacity factor", kind: "number" }],
  calculate: (input) => {
    const retentionTimeMin = input.retentionTimeMin as number;
    const deadTimeMin = input.deadTimeMin as number;
    if (!(deadTimeMin > 0))
      simpleError(
        "deadTimeMin",
        "Dead time must be positive.",
        "invalid_times",
      );
    if (!(retentionTimeMin > deadTimeMin))
      simpleError(
        "retentionTimeMin",
        "Retention time must exceed the dead time.",
        "invalid_times",
      );
    return {
      capacityFactor: (retentionTimeMin - deadTimeMin) / deadTimeMin,
    };
  },
});
export const runChromatographyCapacityFactor =
  chromatographyCapacityFactorTool.execute;
export default chromatographyCapacityFactorTool;
