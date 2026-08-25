import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";

export type DurhamTubeGasDetectorInput = {
  readonly gasTrapped: boolean;
};

export type DurhamTubeGasDetectorOutput = {
  readonly gasProductionDetected: boolean;
  readonly gasTrapped: boolean;
  readonly interpretation: string;
};

export const durhamTubeGasDetectorExample = {
  input: { gasTrapped: true },
  output: {
    gasProductionDetected: true,
    gasTrapped: true,
    interpretation:
      "Gas was trapped in the Durham tube; interpret acid production separately.",
  },
} satisfies ToolExample<
  DurhamTubeGasDetectorInput,
  DurhamTubeGasDetectorOutput
>;

export const durhamTubeGasDetectorTool = createSimpleTool({
  id: "mycology/durham-tube-gas-detector",
  title: "Durham Gas Detector",
  description:
    "Record whether gas is trapped in a Durham tube; this detects gas production but does not replace a separate acid or growth reading.",
  inputs: [{ id: "gasTrapped", kind: "boolean", label: "Gas trapped" }],
  outputs: [
    { id: "gasTrapped", kind: "boolean", label: "Gas trapped" },
    {
      id: "gasProductionDetected",
      kind: "boolean",
      label: "Gas production detected",
    },
    { id: "interpretation", kind: "string", label: "Interpretation" },
  ],
  calculate: (input) => {
    const gasTrapped = input.gasTrapped as boolean;
    return {
      gasProductionDetected: gasTrapped,
      gasTrapped,
      interpretation: gasTrapped
        ? "Gas was trapped in the Durham tube; interpret acid production separately."
        : "No gas was trapped in the Durham tube; this does not exclude acid-only fermentation.",
    };
  },
});
export const runDurhamTubeGasDetector = durhamTubeGasDetectorTool.execute;
export default durhamTubeGasDetectorTool;
