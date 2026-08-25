import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";

export type AceEstimatorInput = {
  readonly observedSpeciesInt: number;
  readonly singletonInt: number;
  readonly doubletonInt: number;
};

export type AceEstimatorOutput = {
  readonly aceEstimate: number;
};

export const aceEstimatorExample = {
  input: { observedSpeciesInt: 12, singletonInt: 4, doubletonInt: 3 },
  output: { aceEstimate: 14.666666666666666 },
} satisfies ToolExample<AceEstimatorInput, AceEstimatorOutput>;

export const aceEstimatorTool = createSimpleTool({
  id: "biology/ace-estimator",
  title: "ACE Proxy Estimator",
  description:
    "Compute the singleton-doubleton proxy Sobs + F1 squared divided by 2 F2, substituting one when F2 is zero. This is not the full abundance-based coverage estimator, which requires the rare-species frequency distribution.",
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
      id: "aceEstimate",
      kind: "number",
      label: "ACE estimate",
      unit: "species",
    },
  ],
  calculate: (input) => {
    const singletonInt = input.singletonInt as number;
    const doubletonInt = input.doubletonInt as number;
    return {
      aceEstimate:
        (input.observedSpeciesInt as number) +
        (singletonInt * singletonInt) /
          (2 * (doubletonInt === 0 ? 1 : doubletonInt)),
    };
  },
});
export const runAceEstimator = aceEstimatorTool.execute;
export default aceEstimatorTool;
