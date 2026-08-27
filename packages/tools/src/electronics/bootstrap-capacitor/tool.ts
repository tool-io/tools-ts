import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type BootstrapCapacitorInput = {
  readonly allowedDropV: number;
  readonly totalGateChargeNc: number;
};

export type BootstrapCapacitorOutput = {
  readonly bootstrapCapacitanceUf: number;
};

export const bootstrapCapacitorExample = {
  input: { allowedDropV: 0.5, totalGateChargeNc: 20 },
  output: { bootstrapCapacitanceUf: 0.4 },
} satisfies ToolExample<BootstrapCapacitorInput, BootstrapCapacitorOutput>;

export const bootstrapCapacitorTool = createSimpleTool({
  calculate: (input) => {
    const totalGateChargeNc = input.totalGateChargeNc as number;
    const allowedDropV = input.allowedDropV as number;
    if (!(totalGateChargeNc > 0))
      simpleError(
        "totalGateChargeNc",
        "Total gate charge must be positive.",
        "invalid_charge",
      );
    if (!(allowedDropV > 0))
      simpleError(
        "allowedDropV",
        "Allowed voltage drop must be positive.",
        "invalid_voltage",
      );
    return {
      bootstrapCapacitanceUf: (10 * totalGateChargeNc) / (allowedDropV * 1000),
    };
  },
  description:
    "Size the bootstrap capacitor with the documented rule C >= 10 x Qg / dV, returned in microfarads.",
  id: "electronics/bootstrap-capacitor",
  inputs: [
    {
      id: "totalGateChargeNc",
      kind: "number",
      label: "Total gate charge",
      unit: "nC",
    },
    {
      id: "allowedDropV",
      kind: "number",
      label: "Allowed supply droop",
      unit: "V",
    },
  ],
  outputs: [
    {
      id: "bootstrapCapacitanceUf",
      kind: "number",
      label: "Bootstrap capacitance",
      unit: "uF",
    },
  ],
  title: "Bootstrap Capacitor",
});
export const runBootstrapCapacitor = bootstrapCapacitorTool.execute;
export default bootstrapCapacitorTool;
