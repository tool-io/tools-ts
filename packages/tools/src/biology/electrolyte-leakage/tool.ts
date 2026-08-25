import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type ElectrolyteLeakageInput = {
  readonly boiledConductivityUs: number;
  readonly initialConductivityUs: number;
};

export type ElectrolyteLeakageOutput = {
  readonly electrolyteLeakagePercent: number;
};

export const electrolyteLeakageExample = {
  input: { boiledConductivityUs: 300, initialConductivityUs: 120 },
  output: { electrolyteLeakagePercent: 40 },
} satisfies ToolExample<ElectrolyteLeakageInput, ElectrolyteLeakageOutput>;

export const electrolyteLeakageTool = createSimpleTool({
  id: "biology/electrolyte-leakage",
  title: "Electrolyte Leakage %",
  description:
    "Compute electrolyte leakage as initial conductivity divided by boiled conductivity times 100, requiring a positive boiled conductivity and an initial conductivity that does not exceed it.",
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
      description: "Electrolyte leakage percentage between 0 and 100.",
      id: "electrolyteLeakagePercent",
      kind: "number",
      label: "Electrolyte leakage",
      unit: "%",
    },
  ],
  calculate: (input) => {
    const boiledConductivityUs = input.boiledConductivityUs as number;
    const initialConductivityUs = input.initialConductivityUs as number;
    if (!(
      boiledConductivityUs > 0 &&
      initialConductivityUs >= 0 &&
      initialConductivityUs <= boiledConductivityUs
    ))
      simpleError(
        "boiledConductivityUs",
        "The boiled conductivity must be positive and at least the initial conductivity.",
        "invalid_conductivities",
      );
    return {
      electrolyteLeakagePercent:
        (initialConductivityUs / boiledConductivityUs) * 100,
    };
  },
});
export const runElectrolyteLeakage = electrolyteLeakageTool.execute;
export default electrolyteLeakageTool;
