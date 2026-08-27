import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type CapacitorLeakageCurrentInput = {
  readonly appliedVolts: number;
  readonly insulationResistanceMohm: number;
};

export type CapacitorLeakageCurrentOutput = {
  readonly leakageCurrentMicroamps: number;
};

export const capacitorLeakageCurrentExample = {
  input: { appliedVolts: 25, insulationResistanceMohm: 100 },
  output: { leakageCurrentMicroamps: 0.25 },
} satisfies ToolExample<
  CapacitorLeakageCurrentInput,
  CapacitorLeakageCurrentOutput
>;

export const calculateCapacitorLeakageCurrent = (
  input: CapacitorLeakageCurrentInput,
): CapacitorLeakageCurrentOutput => {
  if (!(input.appliedVolts > 0))
    simpleError(
      "appliedVolts",
      "Applied voltage must be positive.",
      "invalid_voltage",
    );
  if (!(input.insulationResistanceMohm > 0))
    simpleError(
      "insulationResistanceMohm",
      "Insulation resistance must be positive.",
      "invalid_resistance",
    );
  return {
    leakageCurrentMicroamps:
      input.appliedVolts / input.insulationResistanceMohm,
  };
};

export const capacitorLeakageCurrentTool = createSimpleTool({
  calculate: (input) =>
    calculateCapacitorLeakageCurrent(
      input as unknown as CapacitorLeakageCurrentInput,
    ),
  description:
    "Estimate the leakage current of a capacitor from the applied voltage and its insulation resistance.",
  id: "electronics/capacitor-leakage-current",
  inputs: [
    {
      description: "DC voltage applied across the capacitor.",
      format: "voltage",
      id: "appliedVolts",
      kind: "number",
      label: "Applied voltage",
      unit: "V",
    },
    {
      description: "Insulation resistance of the dielectric.",
      format: "resistance",
      id: "insulationResistanceMohm",
      kind: "number",
      label: "Insulation resistance",
      unit: "MΩ",
    },
  ],
  outputs: [
    {
      description: "Leakage current through the dielectric.",
      format: "current",
      id: "leakageCurrentMicroamps",
      kind: "number",
      label: "Leakage current",
      unit: "µA",
    },
  ],
  title: "Leakage Current",
});
export const runCapacitorLeakageCurrent = capacitorLeakageCurrentTool.execute;
export default capacitorLeakageCurrentTool;
