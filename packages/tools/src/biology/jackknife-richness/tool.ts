import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type JackknifeRichnessInput = {
  readonly observedSpeciesInt: number;
  readonly sampleCountInt: number;
  readonly uniquesInt: number;
};

export type JackknifeRichnessOutput = {
  readonly jackknifeEstimate: number;
};

export const jackknifeRichnessExample = {
  input: { observedSpeciesInt: 15, sampleCountInt: 5, uniquesInt: 6 },
  output: { jackknifeEstimate: 19.8 },
} satisfies ToolExample<JackknifeRichnessInput, JackknifeRichnessOutput>;

export const jackknifeRichnessTool = createSimpleTool({
  id: "biology/jackknife-richness",
  title: "First Order Jackknife",
  description:
    "Estimate species richness with the first order jackknife from unique species across incidence samples.",
  inputs: [
    {
      id: "observedSpeciesInt",
      kind: "integer",
      label: "Observed species",
      minimum: 0,
      unit: "species",
    },
    {
      id: "sampleCountInt",
      kind: "integer",
      label: "Sample count",
      minimum: 1,
      unit: "samples",
    },
    {
      id: "uniquesInt",
      kind: "integer",
      label: "Uniques",
      minimum: 0,
      unit: "species",
    },
  ],
  outputs: [
    {
      id: "jackknifeEstimate",
      kind: "number",
      label: "Jackknife estimate",
      unit: "species",
    },
  ],
  calculate: (input) => {
    const sampleCountInt = input.sampleCountInt as number;
    const uniquesInt = input.uniquesInt as number;
    const observedSpeciesInt = input.observedSpeciesInt as number;
    if (uniquesInt > observedSpeciesInt)
      simpleError(
        "uniquesInt",
        "Species unique to one sample must not exceed observed species.",
        "invalid_count",
      );
    return {
      jackknifeEstimate:
        observedSpeciesInt +
        (uniquesInt * (sampleCountInt - 1)) / sampleCountInt,
    };
  },
});
export const runJackknifeRichness = jackknifeRichnessTool.execute;
export default jackknifeRichnessTool;
