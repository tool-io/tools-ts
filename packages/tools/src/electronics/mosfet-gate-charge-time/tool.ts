import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type MosfetGateChargeTimeInput = {
  readonly gateDriveCurrentA: number;
  readonly totalGateChargeNc: number;
};

export type MosfetGateChargeTimeOutput = {
  readonly gateChargeTimeNs: number;
};

export const mosfetGateChargeTimeExample = {
  input: { gateDriveCurrentA: 9, totalGateChargeNc: 45 },
  output: { gateChargeTimeNs: 5 },
} satisfies ToolExample<MosfetGateChargeTimeInput, MosfetGateChargeTimeOutput>;

export const mosfetGateChargeTimeTool = createSimpleTool({
  calculate: (input) => {
    const totalGateChargeNc = input.totalGateChargeNc as number;
    const gateDriveCurrentA = input.gateDriveCurrentA as number;
    if (!(totalGateChargeNc > 0))
      simpleError(
        "totalGateChargeNc",
        "Total gate charge must be positive.",
        "invalid_charge",
      );
    if (!(gateDriveCurrentA > 0))
      simpleError(
        "gateDriveCurrentA",
        "Gate drive current must be positive.",
        "invalid_current",
      );
    return {
      gateChargeTimeNs: totalGateChargeNc / gateDriveCurrentA,
    };
  },
  description:
    "Compute MOSFET gate charge time in nanoseconds as total gate charge in nC divided by gate drive current in A.",
  id: "electronics/mosfet-gate-charge-time",
  inputs: [
    {
      id: "totalGateChargeNc",
      kind: "number",
      label: "Total gate charge",
      unit: "nC",
    },
    {
      id: "gateDriveCurrentA",
      kind: "number",
      label: "Gate drive current",
      unit: "A",
    },
  ],
  outputs: [
    {
      id: "gateChargeTimeNs",
      kind: "number",
      label: "Gate charge time",
      unit: "ns",
    },
  ],
  title: "Gate Charge Time",
});
export const runMosfetGateChargeTime = mosfetGateChargeTimeTool.execute;
export default mosfetGateChargeTimeTool;
