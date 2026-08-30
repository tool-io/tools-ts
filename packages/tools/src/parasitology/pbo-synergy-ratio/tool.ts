import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";
import { fraction, positive } from "../shared.js";

export type Input = Readonly<{
  readonly insecticideOnlyMortality: number;
  readonly pboMortality: number;
  readonly minimumSynergyRatio: number;
}>;
export type Output = Readonly<{
  readonly mortalityRatio: number;
  readonly mortalityGainPoints: number;
  readonly aboveThreshold: boolean;
}>;
export const calculate = (input: Input): Output => {
  fraction(input.insecticideOnlyMortality, "insecticideOnlyMortality");
  positive(input.insecticideOnlyMortality, "insecticideOnlyMortality");
  fraction(input.pboMortality, "pboMortality");
  positive(input.minimumSynergyRatio, "minimumSynergyRatio");
  const mortalityRatio = input.pboMortality / input.insecticideOnlyMortality;
  return {
    mortalityRatio,
    mortalityGainPoints:
      100 * (input.pboMortality - input.insecticideOnlyMortality),
    aboveThreshold: mortalityRatio >= input.minimumSynergyRatio,
  };
};
export const exampleInput = {
  insecticideOnlyMortality: 0.4,
  pboMortality: 0.8,
  minimumSynergyRatio: 1.5,
} satisfies Input;
export const exampleOutput = {
  mortalityRatio: 2,
  mortalityGainPoints: 40,
  aboveThreshold: true,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "parasitology/pbo-synergy-ratio",
  title: "PBO Synergy Ratio",
  description:
    "Compare insecticide mortality with and without PBO; a ratio alone does not identify resistance mechanism.",
  inputs: [
    {
      id: "insecticideOnlyMortality",
      label: "Insecticide only mortality",
      kind: "number",
    },
    { id: "pboMortality", label: "Pbo mortality", kind: "number" },
    {
      id: "minimumSynergyRatio",
      label: "Minimum synergy ratio",
      kind: "number",
    },
  ],
  outputs: [
    { id: "mortalityRatio", label: "Mortality ratio", kind: "number" },
    {
      id: "mortalityGainPoints",
      label: "Mortality gain points",
      kind: "number",
    },
    { id: "aboveThreshold", label: "Above threshold", kind: "boolean" },
  ],
  calculate: (value) =>
    calculate({
      insecticideOnlyMortality: value.insecticideOnlyMortality as number,
      pboMortality: value.pboMortality as number,
      minimumSynergyRatio: value.minimumSynergyRatio as number,
    }),
});
export const run = tool.execute;
export default tool;
