import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type MembraneStabilityIndexInput = {
  readonly boiledConductivityUs: number;
  readonly initialConductivityUs: number;
};

export type MembraneStabilityIndexOutput = {
  readonly membraneStabilityIndexPercent: number;
};

export const membraneStabilityIndexExample = {
  input: { boiledConductivityUs: 300, initialConductivityUs: 120 },
  output: { membraneStabilityIndexPercent: 60 },
} satisfies ToolExample<
  MembraneStabilityIndexInput,
  MembraneStabilityIndexOutput
>;

export const membraneStabilityIndexTool = createSimpleTool({
  id: "biology/membrane-stability-index",
  title: "MSI Percent",
  description:
    "Compute membrane stability as one minus the ratio of initial to boiled conductivity times 100, requiring a positive boiled conductivity and an initial conductivity that does not exceed it.",
  inputs: [
    {
      description:
        "Conductivity after boiling in microsiemens; must be greater than zero.",
      id: "boiledConductivityUs",
      kind: "number",
      label: "Boiled conductivity",
      unit: "uS",
    },
    {
      description:
        "Initial conductivity in microsiemens; must not exceed the boiled conductivity.",
      id: "initialConductivityUs",
      kind: "number",
      label: "Initial conductivity",
      unit: "uS",
    },
  ],
  outputs: [
    {
      description: "Membrane stability index percentage between 0 and 100.",
      id: "membraneStabilityIndexPercent",
      kind: "number",
      label: "Membrane stability index",
      unit: "%",
    },
  ],
  calculate: (input) => {
    const boiledConductivityUs = input.boiledConductivityUs as number;
    const initialConductivityUs = input.initialConductivityUs as number;
    if (!(
      boiledConductivityUs > 0 && initialConductivityUs <= boiledConductivityUs
    ))
      simpleError(
        "boiledConductivityUs",
        "The boiled conductivity must be positive and at least the initial conductivity.",
        "invalid_conductivities",
      );
    return {
      membraneStabilityIndexPercent:
        (1 - initialConductivityUs / boiledConductivityUs) * 100,
    };
  },
});
export const runMembraneStabilityIndex = membraneStabilityIndexTool.execute;
export default membraneStabilityIndexTool;
