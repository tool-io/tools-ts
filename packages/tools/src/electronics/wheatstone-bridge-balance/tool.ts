import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const wheatstoneBridgeBalanceExample = {
  input: { r1Ohms: 1000, r2Ohms: 1000, r3Ohms: 1000, r4Ohms: 1000 },
  output: { balanced: true },
} satisfies ToolExample<
  {
    readonly r1Ohms: number;
    readonly r2Ohms: number;
    readonly r3Ohms: number;
    readonly r4Ohms: number;
  },
  { readonly balanced: boolean }
>;

export const wheatstoneBridgeBalanceTool = createSimpleTool({
  id: "electronics/wheatstone-bridge-balance",
  title: "Bridge Balance Check",
  description:
    "Check whether a Wheatstone bridge with four resistive arms is balanced.",
  inputs: [
    { id: "r1Ohms", kind: "number", label: "R1", unit: "Ω" },
    { id: "r2Ohms", kind: "number", label: "R2", unit: "Ω" },
    { id: "r3Ohms", kind: "number", label: "R3", unit: "Ω" },
    { id: "r4Ohms", kind: "number", label: "R4", unit: "Ω" },
  ],
  outputs: [{ id: "balanced", kind: "boolean", label: "Balanced" }],
  calculate: (input) => {
    const r1 = input.r1Ohms as number;
    const r2 = input.r2Ohms as number;
    const r3 = input.r3Ohms as number;
    const r4 = input.r4Ohms as number;
    if (r1 <= 0 || r2 <= 0 || r3 <= 0 || r4 <= 0)
      simpleError(
        "r1Ohms",
        "All arm resistances must be greater than zero.",
        "invalid_resistance",
      );
    return { balanced: Math.abs(r1 / r2 - r3 / r4) < 1e-9 };
  },
});
export const runWheatstoneBridgeBalance = wheatstoneBridgeBalanceTool.execute;
export default wheatstoneBridgeBalanceTool;
