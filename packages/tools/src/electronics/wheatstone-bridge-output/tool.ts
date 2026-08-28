import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const wheatstoneBridgeOutputExample = {
  input: {
    r1Ohms: 900,
    r2Ohms: 100,
    r3Ohms: 500,
    r4Ohms: 500,
    supplyVolts: 5,
  },
  output: { bridgeOutputVolts: -2 },
} satisfies ToolExample<
  {
    readonly r1Ohms: number;
    readonly r2Ohms: number;
    readonly r3Ohms: number;
    readonly r4Ohms: number;
    readonly supplyVolts: number;
  },
  { readonly bridgeOutputVolts: number }
>;

export const wheatstoneBridgeOutputTool = createSimpleTool({
  id: "electronics/wheatstone-bridge-output",
  title: "Bridge Output Voltage",
  description:
    "Compute the signed differential output voltage of a Wheatstone bridge.",
  inputs: [
    { id: "supplyVolts", kind: "number", label: "Supply voltage", unit: "V" },
    { id: "r1Ohms", kind: "number", label: "R1", unit: "Ω" },
    { id: "r2Ohms", kind: "number", label: "R2", unit: "Ω" },
    { id: "r3Ohms", kind: "number", label: "R3", unit: "Ω" },
    { id: "r4Ohms", kind: "number", label: "R4", unit: "Ω" },
  ],
  outputs: [
    {
      id: "bridgeOutputVolts",
      kind: "number",
      label: "Bridge output",
      unit: "V",
    },
  ],
  calculate: (input) => {
    const supply = input.supplyVolts as number;
    const r1 = input.r1Ohms as number;
    const r2 = input.r2Ohms as number;
    const r3 = input.r3Ohms as number;
    const r4 = input.r4Ohms as number;
    if (supply <= 0)
      simpleError(
        "supplyVolts",
        "The supply voltage must be greater than zero.",
        "invalid_voltage",
      );
    if (r1 <= 0 || r2 <= 0 || r3 <= 0 || r4 <= 0)
      simpleError(
        "r1Ohms",
        "All arm resistances must be greater than zero.",
        "invalid_resistance",
      );
    return {
      bridgeOutputVolts: supply * (r3 / (r3 + r4) - r1 / (r1 + r2)),
    };
  },
});
export const runWheatstoneBridgeOutput = wheatstoneBridgeOutputTool.execute;
export default wheatstoneBridgeOutputTool;
