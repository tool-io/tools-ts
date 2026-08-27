import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type DecouplingCapacitorValueInput = {
  readonly allowedDroopTimeNs: number;
  readonly allowedDroopVolts: number;
  readonly transientCurrentA: number;
};

export type DecouplingCapacitorValueOutput = {
  readonly decouplingCapacitanceUf: number;
};

export const decouplingCapacitorValueExample = {
  input: {
    allowedDroopTimeNs: 100,
    allowedDroopVolts: 0.3,
    transientCurrentA: 1,
  },
  output: { decouplingCapacitanceUf: 0.33333333333333337 },
} satisfies ToolExample<
  DecouplingCapacitorValueInput,
  DecouplingCapacitorValueOutput
>;

export const decouplingCapacitorValueTool = createSimpleTool({
  calculate: (input) => {
    const transientCurrentA = input.transientCurrentA as number;
    const allowedDroopTimeNs = input.allowedDroopTimeNs as number;
    const allowedDroopVolts = input.allowedDroopVolts as number;
    if (!(transientCurrentA > 0))
      simpleError(
        "transientCurrentA",
        "Transient current must be positive.",
        "invalid_current",
      );
    if (!(allowedDroopTimeNs > 0))
      simpleError(
        "allowedDroopTimeNs",
        "Droop time must be positive.",
        "invalid_time",
      );
    if (!(allowedDroopVolts > 0))
      simpleError(
        "allowedDroopVolts",
        "Allowed droop voltage must be positive.",
        "invalid_voltage",
      );
    return {
      decouplingCapacitanceUf:
        ((transientCurrentA * (allowedDroopTimeNs * 1e-9)) /
          allowedDroopVolts) *
        1e6,
    };
  },
  description:
    "Compute the decoupling capacitance C = I x dt / dV needed to supply a transient current for a droop time within an allowed droop voltage.",
  id: "electronics/decoupling-capacitor-value",
  inputs: [
    {
      id: "transientCurrentA",
      kind: "number",
      label: "Transient current",
      unit: "A",
    },
    {
      id: "allowedDroopTimeNs",
      kind: "number",
      label: "Allowed droop time",
      unit: "ns",
    },
    {
      id: "allowedDroopVolts",
      kind: "number",
      label: "Allowed droop voltage",
      unit: "V",
    },
  ],
  outputs: [
    {
      id: "decouplingCapacitanceUf",
      kind: "number",
      label: "Decoupling capacitance",
      unit: "uF",
    },
  ],
  title: "Decoupling Cap Value",
});
export const runDecouplingCapacitorValue = decouplingCapacitorValueTool.execute;
export default decouplingCapacitorValueTool;
