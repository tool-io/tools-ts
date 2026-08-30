import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import { count } from "../shared.js";

export type Input = Readonly<{
  readonly therapeuticCoveredPeople: number;
  readonly eligiblePeople: number;
  readonly coveredAreas: number;
  readonly totalAreas: number;
}>;
export type Output = Readonly<{
  readonly therapeuticCoveragePercent: number;
  readonly geographicCoveragePercent: number;
  readonly coverageGapPoints: number;
}>;
export const calculate = (input: Input): Output => {
  count(input.therapeuticCoveredPeople, "therapeuticCoveredPeople");
  count(input.eligiblePeople, "eligiblePeople", 1);
  count(input.coveredAreas, "coveredAreas");
  count(input.totalAreas, "totalAreas", 1);
  if (
    input.therapeuticCoveredPeople > input.eligiblePeople ||
    input.coveredAreas > input.totalAreas
  )
    simpleError(
      "coveredAreas",
      "Coverage numerators cannot exceed denominators.",
    );
  const therapeuticCoveragePercent =
      (100 * input.therapeuticCoveredPeople) / input.eligiblePeople,
    geographicCoveragePercent = (100 * input.coveredAreas) / input.totalAreas;
  return {
    therapeuticCoveragePercent,
    geographicCoveragePercent,
    coverageGapPoints: geographicCoveragePercent - therapeuticCoveragePercent,
  };
};
export const exampleInput = {
  therapeuticCoveredPeople: 60,
  eligiblePeople: 100,
  coveredAreas: 8,
  totalAreas: 10,
} satisfies Input;
export const exampleOutput = {
  therapeuticCoveragePercent: 60,
  geographicCoveragePercent: 80,
  coverageGapPoints: 20,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "parasitology/therapeutic-geographic-coverage-gap",
  title: "Therapeutic Geographic Coverage Gap",
  description:
    "Compare person-level therapeutic coverage with area-level geographic coverage.",
  inputs: [
    {
      id: "therapeuticCoveredPeople",
      label: "Therapeutic covered people",
      kind: "integer",
    },
    { id: "eligiblePeople", label: "Eligible people", kind: "integer" },
    { id: "coveredAreas", label: "Covered areas", kind: "integer" },
    { id: "totalAreas", label: "Total areas", kind: "integer" },
  ],
  outputs: [
    {
      id: "therapeuticCoveragePercent",
      label: "Therapeutic coverage percent",
      kind: "number",
    },
    {
      id: "geographicCoveragePercent",
      label: "Geographic coverage percent",
      kind: "number",
    },
    { id: "coverageGapPoints", label: "Coverage gap points", kind: "number" },
  ],
  calculate: (value) =>
    calculate({
      therapeuticCoveredPeople: value.therapeuticCoveredPeople as number,
      eligiblePeople: value.eligiblePeople as number,
      coveredAreas: value.coveredAreas as number,
      totalAreas: value.totalAreas as number,
    }),
});
export const run = tool.execute;
export default tool;
