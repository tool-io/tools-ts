import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type PsrrDbInput = {
  readonly deltaSupplyV: number;
  readonly deltaOutputV: number;
};

export type PsrrDbOutput = {
  readonly psrrDb: number;
};

export const psrrDbExample = {
  input: { deltaSupplyV: 0.1, deltaOutputV: 0.00001 },
  output: { psrrDb: 80 },
} satisfies ToolExample<PsrrDbInput, PsrrDbOutput>;

export const psrrDbTool = createSimpleTool({
  id: "electronics/psrr-db",
  title: "PSRR dB",
  description:
    "Compute the power supply rejection ratio in decibels as 20 x log10(delta Vsupply / delta Vout); both deltas must be positive.",
  inputs: [
    { id: "deltaSupplyV", label: "Supply change", kind: "number", unit: "V" },
    { id: "deltaOutputV", label: "Output change", kind: "number", unit: "V" },
  ],
  outputs: [{ id: "psrrDb", label: "PSRR", kind: "number", unit: "dB" }],
  calculate: (input) => {
    const deltaSupplyV = input.deltaSupplyV as number;
    const deltaOutputV = input.deltaOutputV as number;
    if (!(deltaSupplyV > 0))
      simpleError(
        "deltaSupplyV",
        "Supply change must be positive.",
        "invalid_voltage",
      );
    if (!(deltaOutputV > 0))
      simpleError(
        "deltaOutputV",
        "Output change must be positive.",
        "invalid_voltage",
      );
    return {
      psrrDb: 20 * Math.log10(deltaSupplyV / deltaOutputV),
    };
  },
});
export const runPsrrDb = psrrDbTool.execute;
export default psrrDbTool;
