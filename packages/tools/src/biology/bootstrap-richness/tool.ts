import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";

export type BootstrapRichnessInput = {
  readonly observedSpeciesInt: number;
  readonly sampleCountInt: number;
  readonly singletonInt: number;
};

export type BootstrapRichnessOutput = {
  readonly bootstrapEstimate: number;
};

export const bootstrapRichnessExample = {
  input: { observedSpeciesInt: 20, sampleCountInt: 4, singletonInt: 5 },
  output: { bootstrapEstimate: 21.25 },
} satisfies ToolExample<BootstrapRichnessInput, BootstrapRichnessOutput>;

export const bootstrapRichnessTool = createSimpleTool({
  id: "biology/bootstrap-richness",
  title: "Bootstrap Richness Proxy",
  description:
    "Compute the limited richness proxy Sobs + singletons divided by sample count. A full bootstrap richness estimator requires each species' observed incidence frequency.",
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
      id: "singletonInt",
      kind: "integer",
      label: "Singletons",
      minimum: 0,
      unit: "species",
    },
  ],
  outputs: [
    {
      id: "bootstrapEstimate",
      kind: "number",
      label: "Bootstrap estimate",
      unit: "species",
    },
  ],
  calculate: (input) => {
    const sampleCountInt = input.sampleCountInt as number;
    return {
      bootstrapEstimate:
        (input.observedSpeciesInt as number) +
        (input.singletonInt as number) / sampleCountInt,
    };
  },
});
export const runBootstrapRichness = bootstrapRichnessTool.execute;
export default bootstrapRichnessTool;
