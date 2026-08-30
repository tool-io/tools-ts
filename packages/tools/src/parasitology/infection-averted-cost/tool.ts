import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";
import { positive, nonnegative } from "../shared.js";

export type Input = Readonly<{
  readonly programmeCost: number;
  readonly estimatedInfectionsWithout: number;
  readonly observedInfectionsWith: number;
}>;
export type Output = Readonly<{
  readonly infectionsAverted: number;
  readonly costPerInfectionAverted: number;
}>;
export const calculate = (input: Input): Output => {
  nonnegative(input.programmeCost, "programmeCost");
  nonnegative(input.estimatedInfectionsWithout, "estimatedInfectionsWithout");
  nonnegative(input.observedInfectionsWith, "observedInfectionsWith");
  const infectionsAverted =
    input.estimatedInfectionsWithout - input.observedInfectionsWith;
  positive(infectionsAverted, "observedInfectionsWith");
  return {
    infectionsAverted,
    costPerInfectionAverted: input.programmeCost / infectionsAverted,
  };
};
export const exampleInput = {
  programmeCost: 10000,
  estimatedInfectionsWithout: 1000,
  observedInfectionsWith: 800,
} satisfies Input;
export const exampleOutput = {
  infectionsAverted: 200,
  costPerInfectionAverted: 50,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "parasitology/infection-averted-cost",
  title: "Infection Averted Cost",
  description:
    "Estimate cost per infection averted using explicit observed and counterfactual infection totals.",
  inputs: [
    { id: "programmeCost", label: "Programme cost", kind: "number" },
    {
      id: "estimatedInfectionsWithout",
      label: "Estimated infections without",
      kind: "number",
    },
    {
      id: "observedInfectionsWith",
      label: "Observed infections with",
      kind: "number",
    },
  ],
  outputs: [
    { id: "infectionsAverted", label: "Infections averted", kind: "number" },
    {
      id: "costPerInfectionAverted",
      label: "Cost per infection averted",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      programmeCost: value.programmeCost as number,
      estimatedInfectionsWithout: value.estimatedInfectionsWithout as number,
      observedInfectionsWith: value.observedInfectionsWith as number,
    }),
});
export const run = tool.execute;
export default tool;
