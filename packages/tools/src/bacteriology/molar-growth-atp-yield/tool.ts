import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";
import { positive, nonnegative } from "../shared.js";

export type Input = Readonly<{
  readonly atpMolesProduced: number;
  readonly substrateMolesConsumed: number;
  readonly biomassGramsProduced: number;
}>;
export type Output = Readonly<{
  readonly atpMolesPerSubstrateMole: number;
  readonly biomassGramsPerSubstrateMole: number;
  readonly biomassGramsPerAtpMole: number;
}>;
export const calculate = (input: Input): Output => {
  positive(input.atpMolesProduced, "atpMolesProduced");
  positive(input.substrateMolesConsumed, "substrateMolesConsumed");
  nonnegative(input.biomassGramsProduced, "biomassGramsProduced");
  return {
    atpMolesPerSubstrateMole:
      input.atpMolesProduced / input.substrateMolesConsumed,
    biomassGramsPerSubstrateMole:
      input.biomassGramsProduced / input.substrateMolesConsumed,
    biomassGramsPerAtpMole: input.biomassGramsProduced / input.atpMolesProduced,
  };
};
export const exampleInput = {
  atpMolesProduced: 2,
  substrateMolesConsumed: 0.1,
  biomassGramsProduced: 10,
} satisfies Input;
export const exampleOutput = {
  atpMolesPerSubstrateMole: 20,
  biomassGramsPerSubstrateMole: 100,
  biomassGramsPerAtpMole: 5,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "bacteriology/molar-growth-atp-yield",
  title: "Molar Growth Atp Yield",
  description:
    "Compare observed ATP and biomass yields on a molar substrate basis; no metabolic stoichiometry is embedded.",
  inputs: [
    { id: "atpMolesProduced", label: "Atp moles produced", kind: "number" },
    {
      id: "substrateMolesConsumed",
      label: "Substrate moles consumed",
      kind: "number",
    },
    {
      id: "biomassGramsProduced",
      label: "Biomass grams produced",
      kind: "number",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "atpMolesPerSubstrateMole",
      label: "Atp moles per substrate mole",
      kind: "number",
    },
    {
      id: "biomassGramsPerSubstrateMole",
      label: "Biomass grams per substrate mole",
      kind: "number",
    },
    {
      id: "biomassGramsPerAtpMole",
      label: "Biomass grams per atp mole",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      atpMolesProduced: value.atpMolesProduced as number,
      substrateMolesConsumed: value.substrateMolesConsumed as number,
      biomassGramsProduced: value.biomassGramsProduced as number,
    }),
});
export const run = tool.execute;
export default tool;
