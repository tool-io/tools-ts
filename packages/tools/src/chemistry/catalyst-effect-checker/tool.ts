import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
export const catalystEffectCheckerTool = createSimpleTool({
  id: "chemistry/catalyst-effect-checker",
  title: "Catalyst Effect Check",
  description: "Calculate catalyst effect check.",
  inputs: [
    {
      description: "Ea without catalyst.",
      id: "activationEnergyUncatalyzedJPerMol",
      kind: "number",
      label: "Uncat Ea",
      minimum: 0,
    },
    {
      description: "Ea with catalyst.",
      id: "activationEnergyCatalyzedJPerMol",
      kind: "number",
      label: "Cat Ea",
      minimum: 0,
    },
    {
      description: "Temperature.",
      id: "temperatureK",
      kind: "number",
      label: "Temp",
      minimum: 0,
    },
  ],
  outputs: [
    {
      description: "Rate enhancement factor.",
      id: "rateEnhancementFactor",
      kind: "number",
      label: "Enhancement",
    },
  ],
  calculate: (input) => {
    const RJ = 8.314;
    if ((input.temperatureK as number) <= 0)
      simpleError("temperatureK", ">0 K required.", "invalid_temp");
    return {
      rateEnhancementFactor: Math.exp(
        ((input.activationEnergyUncatalyzedJPerMol as number) -
          (input.activationEnergyCatalyzedJPerMol as number)) /
          (RJ * (input.temperatureK as number)),
      ),
    };
  },
});
export default catalystEffectCheckerTool;
export const runCatalystEffectChecker = catalystEffectCheckerTool.execute;

export type CatalystEffectCheckerInput = {
  readonly activationEnergyUncatalyzedJPerMol: number;
  readonly activationEnergyCatalyzedJPerMol: number;
  readonly temperatureK: number;
};

export type CatalystEffectCheckerOutput = {
  readonly rateEnhancementFactor: number;
};

export const catalystEffectCheckerExample = {
  input: {
    activationEnergyUncatalyzedJPerMol: 1,
    activationEnergyCatalyzedJPerMol: 1,
    temperatureK: 1,
  },
  output: {
    rateEnhancementFactor: 1,
  },
} satisfies ToolExample<
  CatalystEffectCheckerInput,
  CatalystEffectCheckerOutput
>;
