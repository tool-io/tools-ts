import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";

export type EffectivePopulationSizeInput = {
  readonly females: number;
  readonly males: number;
};

export type EffectivePopulationSizeOutput = {
  readonly effectiveSize: number;
};

export const effectivePopulationSizeExample = {
  input: { females: 60, males: 40 },
  output: { effectiveSize: 96 },
} satisfies ToolExample<
  EffectivePopulationSizeInput,
  EffectivePopulationSizeOutput
>;

export const effectivePopulationSizeTool = createSimpleTool({
  id: "biology/effective-population-size",
  title: "Effective Population Size",
  description:
    "Compute the sex-ratio effective population size ne = (4 * males * females) / (males + females).",
  inputs: [
    { id: "males", label: "Males", kind: "integer", minimum: 1 },
    { id: "females", label: "Females", kind: "integer", minimum: 1 },
  ],
  outputs: [{ id: "effectiveSize", label: "Effective size", kind: "number" }],
  calculate: (input) => ({
    effectiveSize:
      (4 * (input.males as number) * (input.females as number)) /
      ((input.males as number) + (input.females as number)),
  }),
});
export const runEffectivePopulationSize = effectivePopulationSizeTool.execute;
export default effectivePopulationSizeTool;
