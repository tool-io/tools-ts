import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type QuantumYieldInput = {
  readonly photonsAbsorbed: number;
  readonly photonsEmitted: number;
};

export type QuantumYieldOutput = {
  readonly quantumYield: number;
};

export const quantumYieldExample = {
  input: { photonsEmitted: 8, photonsAbsorbed: 10 },
  output: { quantumYield: 0.8 },
} satisfies ToolExample<QuantumYieldInput, QuantumYieldOutput>;

export const quantumYieldTool = createSimpleTool({
  id: "chemistry/quantum-yield",
  title: "Quantum Yield Calculator",
  description:
    "Compute fluorescence quantum yield as the number of photons emitted divided by the number of photons absorbed.",
  inputs: [
    {
      id: "photonsEmitted",
      label: "Photons emitted",
      kind: "integer",
      minimum: 0,
    },
    {
      id: "photonsAbsorbed",
      label: "Photons absorbed",
      kind: "integer",
      minimum: 1,
    },
  ],
  outputs: [{ id: "quantumYield", label: "Quantum yield", kind: "number" }],
  calculate: (input) => {
    const photonsEmitted = input.photonsEmitted as number;
    const photonsAbsorbed = input.photonsAbsorbed as number;
    if (photonsEmitted > photonsAbsorbed)
      simpleError(
        "photonsEmitted",
        "Photons emitted must not exceed photons absorbed.",
        "invalid_counts",
      );
    return { quantumYield: photonsEmitted / photonsAbsorbed };
  },
});
export const runQuantumYield = quantumYieldTool.execute;
export default quantumYieldTool;
