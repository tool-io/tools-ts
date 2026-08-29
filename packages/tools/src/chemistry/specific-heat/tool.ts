import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
export const specificHeatTool = createSimpleTool({
  id: "chemistry/specific-heat",
  title: "Specific Heat Calculator",
  description: "Calculate specific heat calculator.",
  inputs: [
    {
      description: "Heat absorbed.",
      id: "heatJoules",
      kind: "number",
      label: "q",
    },
    {
      description: "Mass.",
      id: "massG",
      kind: "number",
      label: "Mass",
      minimum: 0,
    },
    {
      description: "Temperature change; nonzero.",
      id: "deltaTK",
      kind: "number",
      label: "dT",
    },
  ],
  outputs: [
    {
      description: "Computed specific heat.",
      id: "specificHeatJGK",
      kind: "number",
      label: "Specific heat",
    },
  ],
  calculate: (input) => {
    if ((input.massG as number) <= 0 || (input.deltaTK as number) === 0)
      simpleError("massG", "Invalid mass or dT.", "invalid_input");
    return {
      specificHeatJGK:
        (input.heatJoules as number) /
        ((input.massG as number) * (input.deltaTK as number)),
    };
  },
});
export default specificHeatTool;
export const runSpecificHeat = specificHeatTool.execute;

export type SpecificHeatInput = {
  readonly heatJoules: number;
  readonly massG: number;
  readonly deltaTK: number;
};

export type SpecificHeatOutput = {
  readonly specificHeatJGK: number;
};

export const specificHeatExample = {
  input: {
    heatJoules: 1,
    massG: 1,
    deltaTK: 1,
  },
  output: {
    specificHeatJGK: 1,
  },
} satisfies ToolExample<SpecificHeatInput, SpecificHeatOutput>;
