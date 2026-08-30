import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import { positive, fraction } from "../shared.js";

export type Input = Readonly<{
  readonly plaqueFormingUnitsPerMl: number;
  readonly physicalParticlesPerMl: number;
  readonly minimumInfectiousFraction: number;
}>;
export type Output = Readonly<{
  readonly infectiousFraction: number;
  readonly physicalParticlesPerPfu: number;
  readonly meetsSuppliedCriterion: boolean;
}>;
export const calculate = (input: Input): Output => {
  positive(input.plaqueFormingUnitsPerMl, "plaqueFormingUnitsPerMl");
  positive(input.physicalParticlesPerMl, "physicalParticlesPerMl");
  fraction(input.minimumInfectiousFraction, "minimumInfectiousFraction");
  if (input.plaqueFormingUnitsPerMl > input.physicalParticlesPerMl)
    simpleError(
      "plaqueFormingUnitsPerMl",
      "Assay infectious count cannot exceed the supplied physical particle count in this ratio model.",
    );
  const infectiousFraction =
    input.plaqueFormingUnitsPerMl / input.physicalParticlesPerMl;
  return {
    infectiousFraction,
    physicalParticlesPerPfu: 1 / infectiousFraction,
    meetsSuppliedCriterion:
      infectiousFraction >= input.minimumInfectiousFraction,
  };
};
export const exampleInput = {
  plaqueFormingUnitsPerMl: 100,
  physicalParticlesPerMl: 10000,
  minimumInfectiousFraction: 0.005,
} satisfies Input;
export const exampleOutput = {
  infectiousFraction: 0.01,
  physicalParticlesPerPfu: 100,
  meetsSuppliedCriterion: true,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "virology/infectious-physical-particle-ratio",
  title: "Infectious Physical Particle Ratio",
  description:
    "Compare infectious and physical particle concentrations on compatible assays; supplied criterion is not a universal quality specification.",
  inputs: [
    {
      id: "plaqueFormingUnitsPerMl",
      label: "Plaque forming units per ml",
      kind: "number",
    },
    {
      id: "physicalParticlesPerMl",
      label: "Physical particles per ml",
      kind: "number",
    },
    {
      id: "minimumInfectiousFraction",
      label: "Minimum infectious fraction",
      kind: "number",
      minimum: 0,
      maximum: 1,
    },
  ],
  outputs: [
    { id: "infectiousFraction", label: "Infectious fraction", kind: "number" },
    {
      id: "physicalParticlesPerPfu",
      label: "Physical particles per pfu",
      kind: "number",
    },
    {
      id: "meetsSuppliedCriterion",
      label: "Meets supplied criterion",
      kind: "boolean",
    },
  ],
  calculate: (value) =>
    calculate({
      plaqueFormingUnitsPerMl: value.plaqueFormingUnitsPerMl as number,
      physicalParticlesPerMl: value.physicalParticlesPerMl as number,
      minimumInfectiousFraction: value.minimumInfectiousFraction as number,
    }),
});
export const run = tool.execute;
export default tool;
