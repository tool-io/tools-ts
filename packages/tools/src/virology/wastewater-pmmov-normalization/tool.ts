import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import { positive, nonnegative, fraction } from "../shared.js";

export type Input = Readonly<{
  readonly pathogenCopiesPerReaction: number;
  readonly pmmovCopiesPerReaction: number;
  readonly extractVolumeUl: number;
  readonly templateVolumeUl: number;
  readonly processedWastewaterMl: number;
  readonly recoveryFraction: number;
}>;
export type Output = Readonly<{
  readonly pathogenCopiesPerLiter: number;
  readonly pmmovCopiesPerLiter: number;
  readonly pathogenPmmovRatio: number;
}>;
export const calculate = (input: Input): Output => {
  nonnegative(input.pathogenCopiesPerReaction, "pathogenCopiesPerReaction");
  positive(input.pmmovCopiesPerReaction, "pmmovCopiesPerReaction");
  positive(input.extractVolumeUl, "extractVolumeUl");
  positive(input.templateVolumeUl, "templateVolumeUl");
  positive(input.processedWastewaterMl, "processedWastewaterMl");
  fraction(input.recoveryFraction, "recoveryFraction");
  positive(input.recoveryFraction, "recoveryFraction");
  if (input.templateVolumeUl > input.extractVolumeUl)
    simpleError(
      "templateVolumeUl",
      "Template volume cannot exceed extract volume.",
    );
  const multiplier =
    ((input.extractVolumeUl / input.templateVolumeUl) * 1000) /
    input.processedWastewaterMl /
    input.recoveryFraction;
  return {
    pathogenCopiesPerLiter: input.pathogenCopiesPerReaction * multiplier,
    pmmovCopiesPerLiter: input.pmmovCopiesPerReaction * multiplier,
    pathogenPmmovRatio:
      input.pathogenCopiesPerReaction / input.pmmovCopiesPerReaction,
  };
};
export const exampleInput = {
  pathogenCopiesPerReaction: 10,
  pmmovCopiesPerReaction: 100,
  extractVolumeUl: 100,
  templateVolumeUl: 5,
  processedWastewaterMl: 100,
  recoveryFraction: 0.5,
} satisfies Input;
export const exampleOutput = {
  pathogenCopiesPerLiter: 4000,
  pmmovCopiesPerLiter: 40000,
  pathogenPmmovRatio: 0.1,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "virology/wastewater-pmmov-normalization",
  title: "Wastewater PMMOV Normalization",
  description:
    "Normalize wastewater gene copies by assayed/extraction volumes, shared recovery, and PMMoV concentration; not a case-count estimate.",
  inputs: [
    {
      id: "pathogenCopiesPerReaction",
      label: "Pathogen copies per reaction",
      kind: "number",
      minimum: 0,
    },
    {
      id: "pmmovCopiesPerReaction",
      label: "Pmmov copies per reaction",
      kind: "number",
    },
    { id: "extractVolumeUl", label: "Extract volume ul", kind: "number" },
    { id: "templateVolumeUl", label: "Template volume ul", kind: "number" },
    {
      id: "processedWastewaterMl",
      label: "Processed wastewater ml",
      kind: "number",
    },
    {
      id: "recoveryFraction",
      label: "Recovery fraction",
      kind: "number",
      minimum: 0,
      maximum: 1,
    },
  ],
  outputs: [
    {
      id: "pathogenCopiesPerLiter",
      label: "Pathogen copies per liter",
      kind: "number",
    },
    {
      id: "pmmovCopiesPerLiter",
      label: "Pmmov copies per liter",
      kind: "number",
    },
    { id: "pathogenPmmovRatio", label: "Pathogen pmmov ratio", kind: "number" },
  ],
  calculate: (value) =>
    calculate({
      pathogenCopiesPerReaction: value.pathogenCopiesPerReaction as number,
      pmmovCopiesPerReaction: value.pmmovCopiesPerReaction as number,
      extractVolumeUl: value.extractVolumeUl as number,
      templateVolumeUl: value.templateVolumeUl as number,
      processedWastewaterMl: value.processedWastewaterMl as number,
      recoveryFraction: value.recoveryFraction as number,
    }),
});
export const run = tool.execute;
export default tool;
