import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";
export const heatQMcatTool = createSimpleTool({
  id: "chemistry/heat-q-mcat",
  title: "Heat Q MCAT Calculator",
  description: "Calculate heat q mcat calculator.",
  inputs: [
    {
      description: "Mass.",
      id: "massG",
      kind: "number",
      label: "Mass",
      minimum: 0,
    },
    {
      description: "Specific heat capacity.",
      id: "specificHeatJGK",
      kind: "number",
      label: "Specific heat",
      minimum: 0,
    },
    {
      description: "Temperature change.",
      id: "deltaTK",
      kind: "number",
      label: "dT",
    },
  ],
  outputs: [
    {
      description: "Heat absorbed or released.",
      id: "heatJoules",
      kind: "number",
      label: "Heat q",
    },
  ],
  calculate: (input) => {
    return {
      heatJoules:
        (input.massG as number) *
        (input.specificHeatJGK as number) *
        (input.deltaTK as number),
    };
  },
});
export default heatQMcatTool;
export const runHeatQMcat = heatQMcatTool.execute;

export type HeatQMcatInput = {
  readonly massG: number;
  readonly specificHeatJGK: number;
  readonly deltaTK: number;
};

export type HeatQMcatOutput = {
  readonly heatJoules: number;
};

export const heatQMcatExample = {
  input: {
    massG: 1,
    specificHeatJGK: 1,
    deltaTK: 1,
  },
  output: {
    heatJoules: 1,
  },
} satisfies ToolExample<HeatQMcatInput, HeatQMcatOutput>;
