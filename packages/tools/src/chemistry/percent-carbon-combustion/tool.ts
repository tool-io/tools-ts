import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
export const percentCarbonCombustionTool = createSimpleTool({
  id: "chemistry/percent-carbon-combustion",
  title: "Percent Carbon From Combustion Calculator",
  description:
    "Express the carbon recovered from combustion CO₂ as a percentage of the original sample mass.",
  inputs: [
    {
      description: "Carbon mass recovered from the CO₂ absorber.",
      id: "carbonMassG",
      label: "Carbon mass",
      kind: "number",
      minimum: 0,
      unit: "g",
    },
    {
      description: "Original sample mass; must be greater than zero.",
      id: "sampleMassG",
      label: "Sample mass",
      kind: "number",
      minimum: 0,
      unit: "g",
    },
  ],
  outputs: [
    {
      description: "Carbon as a percentage of sample mass.",
      id: "percentCarbon",
      label: "Percent carbon",
      kind: "number",
      unit: "%",
    },
  ],
  calculate: (input) => {
    const sample = input.sampleMassG as number;
    if (sample <= 0)
      simpleError(
        "sampleMassG",
        "The sample mass must be greater than zero.",
        "invalid_sample_mass",
      );
    return { percentCarbon: ((input.carbonMassG as number) / sample) * 100 };
  },
});
export const runPercentCarbonCombustion = percentCarbonCombustionTool.execute;
export default percentCarbonCombustionTool;

export type PercentCarbonCombustionInput = {
  readonly carbonMassG: number;
  readonly sampleMassG: number;
};

export type PercentCarbonCombustionOutput = {
  readonly percentCarbon: number;
};

export const percentCarbonCombustionExample = {
  input: {
    carbonMassG: 1,
    sampleMassG: 1,
  },
  output: {
    percentCarbon: 100,
  },
} satisfies ToolExample<
  PercentCarbonCombustionInput,
  PercentCarbonCombustionOutput
>;
