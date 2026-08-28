import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
export const percentIonizationTool = createSimpleTool({
  id: "chemistry/percent-ionization",
  title: "Percent Ionization Calculator",
  description:
    "Compute the percent ionization of a weak acid as ([H⁺]dissociated / [HA]initial) × 100.",
  inputs: [
    {
      description: "Dissolved hydronium concentration in mol/L.",
      id: "hConcentrationMolL",
      label: "[H⁺] dissociated",
      kind: "number",
      minimum: 0,
      unit: "mol/L",
    },
    {
      description: "Initial acid concentration; must be greater than zero.",
      id: "initialConcentrationMolL",
      label: "Initial concentration",
      kind: "number",
      unit: "mol/L",
    },
  ],
  outputs: [
    {
      description: "Percent of acid molecules ionized.",
      id: "percentIonization",
      label: "Percent ionization",
      kind: "number",
      unit: "%",
    },
  ],
  calculate: (input) => {
    const initial = input.initialConcentrationMolL as number;
    if (initial <= 0)
      simpleError(
        "initialConcentrationMolL",
        "The initial concentration must be greater than zero.",
        "invalid_concentration",
      );
    const ionized = input.hConcentrationMolL as number;
    if (ionized < 0 || ionized > initial)
      simpleError(
        "hConcentrationMolL",
        "Ionized concentration must be between zero and the initial concentration.",
        "invalid_ionized_concentration",
      );
    return {
      percentIonization: (ionized / initial) * 100,
    };
  },
});
export const runPercentIonization = percentIonizationTool.execute;
export default percentIonizationTool;

export type PercentIonizationInput = {
  readonly hConcentrationMolL: number;
  readonly initialConcentrationMolL: number;
};

export type PercentIonizationOutput = {
  readonly percentIonization: number;
};

export const percentIonizationExample = {
  input: {
    hConcentrationMolL: 1,
    initialConcentrationMolL: 1,
  },
  output: {
    percentIonization: 100,
  },
} satisfies ToolExample<PercentIonizationInput, PercentIonizationOutput>;
