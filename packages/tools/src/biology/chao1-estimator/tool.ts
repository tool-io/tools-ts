import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Chao1EstimatorInput = {
  readonly observedSpeciesInt: number;
  readonly singletonInt: number;
  readonly doubletonInt: number;
};

export type Chao1EstimatorOutput = {
  readonly chao1Estimate: number;
};

export const chao1EstimatorExample = {
  input: { observedSpeciesInt: 10, singletonInt: 3, doubletonInt: 2 },
  output: { chao1Estimate: 12.25 },
} satisfies ToolExample<Chao1EstimatorInput, Chao1EstimatorOutput>;

export const chao1EstimatorTool = createSimpleTool({
  id: "biology/chao1-estimator",
  title: "Chao1 Estimator",
  description:
    "Estimate total species richness from singletons and doubletons in a single sample using the Chao1 estimator.",
  inputs: [
    {
      id: "observedSpeciesInt",
      kind: "integer",
      label: "Observed species",
      minimum: 1,
      unit: "species",
    },
    {
      id: "singletonInt",
      kind: "integer",
      label: "Singletons",
      minimum: 0,
      unit: "species",
    },
    {
      id: "doubletonInt",
      kind: "integer",
      label: "Doubletons",
      minimum: 0,
      unit: "species",
    },
  ],
  outputs: [
    {
      id: "chao1Estimate",
      kind: "number",
      label: "Chao1 estimate",
      unit: "species",
    },
  ],
  calculate: (input) => {
    const singletonInt = input.singletonInt as number;
    const doubletonInt = input.doubletonInt as number;
    if (doubletonInt === 0)
      return {
        chao1Estimate:
          (input.observedSpeciesInt as number) +
          (singletonInt * (singletonInt - 1)) / 2,
      };
    return {
      chao1Estimate:
        (input.observedSpeciesInt as number) +
        (singletonInt * singletonInt) / (2 * doubletonInt),
    };
  },
});
export const runChao1Estimator = chao1EstimatorTool.execute;
export default chao1EstimatorTool;
