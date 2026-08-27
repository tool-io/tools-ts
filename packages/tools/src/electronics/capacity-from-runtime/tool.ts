import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type CapacityFromRuntimeInput = {
  readonly loadCurrentA: number;
  readonly runtimeHours: number;
};

export type CapacityFromRuntimeOutput = {
  readonly capacityAh: number;
};

export const capacityFromRuntimeExample = {
  input: { loadCurrentA: 0.5, runtimeHours: 8 },
  output: { capacityAh: 4 },
} satisfies ToolExample<CapacityFromRuntimeInput, CapacityFromRuntimeOutput>;

export const capacityFromRuntimeTool = createSimpleTool({
  id: "electronics/capacity-from-runtime",
  title: "Capacity From Runtime",
  description:
    "Compute required battery capacity in ampere-hours as load current multiplied by runtime hours.",
  inputs: [
    { id: "loadCurrentA", label: "Load current", kind: "number", unit: "A" },
    { id: "runtimeHours", label: "Runtime", kind: "number", unit: "h" },
  ],
  outputs: [
    { id: "capacityAh", label: "Capacity", kind: "number", unit: "Ah" },
  ],
  calculate: (input) => {
    const loadCurrentA = input.loadCurrentA as number;
    const runtimeHours = input.runtimeHours as number;
    if (!(loadCurrentA > 0))
      simpleError(
        "loadCurrentA",
        "Load current must be positive.",
        "invalid_current",
      );
    if (!(runtimeHours > 0))
      simpleError(
        "runtimeHours",
        "Runtime must be positive.",
        "invalid_runtime",
      );
    return { capacityAh: loadCurrentA * runtimeHours };
  },
});
export const runCapacityFromRuntime = capacityFromRuntimeTool.execute;
export default capacityFromRuntimeTool;
