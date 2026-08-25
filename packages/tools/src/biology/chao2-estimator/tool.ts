import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";

export type Chao2EstimatorInput = {
  readonly observedSpeciesInt: number;
  readonly sampleCountInt: number;
  readonly uniquesInt: number;
  readonly doubletonsInt: number;
};

export type Chao2EstimatorOutput = {
  readonly chao2Estimate: number;
};

export const chao2EstimatorExample = {
  input: {
    observedSpeciesInt: 8,
    sampleCountInt: 5,
    uniquesInt: 3,
    doubletonsInt: 4,
  },
  output: { chao2Estimate: 8.9 },
} satisfies ToolExample<Chao2EstimatorInput, Chao2EstimatorOutput>;

export const chao2EstimatorTool = createSimpleTool({
  id: "biology/chao2-estimator",
  title: "Chao2 Estimator",
  description:
    "Estimate total species richness from incidence data across samples using the Chao2 estimator.",
  inputs: [
    {
      id: "observedSpeciesInt",
      kind: "integer",
      label: "Observed species",
      minimum: 1,
      unit: "species",
    },
    {
      id: "sampleCountInt",
      kind: "integer",
      label: "Sample count",
      minimum: 2,
      unit: "samples",
    },
    {
      id: "uniquesInt",
      kind: "integer",
      label: "Uniques",
      minimum: 0,
      unit: "species",
    },
    {
      id: "doubletonsInt",
      kind: "integer",
      label: "Doubletons",
      minimum: 0,
      unit: "species",
    },
  ],
  outputs: [
    {
      id: "chao2Estimate",
      kind: "number",
      label: "Chao2 estimate",
      unit: "species",
    },
  ],
  calculate: (input) => {
    const observedSpeciesInt = input.observedSpeciesInt as number;
    const sampleCountInt = input.sampleCountInt as number;
    const uniquesInt = input.uniquesInt as number;
    const doubletonsInt = input.doubletonsInt as number;
    if (doubletonsInt === 0)
      return {
        chao2Estimate:
          observedSpeciesInt +
          ((sampleCountInt - 1) / sampleCountInt) *
            ((uniquesInt * (uniquesInt - 1)) / 2),
      };
    return {
      chao2Estimate:
        observedSpeciesInt +
        ((sampleCountInt - 1) / sampleCountInt) *
          ((uniquesInt * uniquesInt) / (2 * doubletonsInt)),
    };
  },
});
export const runChao2Estimator = chao2EstimatorTool.execute;
export default chao2EstimatorTool;
