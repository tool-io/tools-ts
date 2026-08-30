import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import { count } from "../shared.js";

export type Input = Readonly<{
  readonly treatedResidents: number;
  readonly eligibleResidents: number;
  readonly totalResidents: number;
}>;
export type Output = Readonly<{
  readonly eligibleCoveragePercent: number;
  readonly populationCoveragePercent: number;
  readonly untreatedEligibleResidents: number;
}>;
export const calculate = (input: Input): Output => {
  count(input.treatedResidents, "treatedResidents");
  count(input.eligibleResidents, "eligibleResidents", 1);
  count(input.totalResidents, "totalResidents", 1);
  if (
    input.treatedResidents > input.eligibleResidents ||
    input.eligibleResidents > input.totalResidents
  )
    simpleError(
      "treatedResidents",
      "Treated ≤ eligible ≤ total residents required.",
    );
  return {
    eligibleCoveragePercent:
      (100 * input.treatedResidents) / input.eligibleResidents,
    populationCoveragePercent:
      (100 * input.treatedResidents) / input.totalResidents,
    untreatedEligibleResidents:
      input.eligibleResidents - input.treatedResidents,
  };
};
export const exampleInput = {
  treatedResidents: 80,
  eligibleResidents: 100,
  totalResidents: 125,
} satisfies Input;
export const exampleOutput = {
  eligibleCoveragePercent: 80,
  populationCoveragePercent: 64,
  untreatedEligibleResidents: 20,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "parasitology/community-treatment-coverage",
  title: "Community Treatment Coverage",
  description:
    "Distinguish eligible-resident and total-population coverage in community-directed treatment.",
  inputs: [
    { id: "treatedResidents", label: "Treated residents", kind: "integer" },
    { id: "eligibleResidents", label: "Eligible residents", kind: "integer" },
    { id: "totalResidents", label: "Total residents", kind: "integer" },
  ],
  outputs: [
    {
      id: "eligibleCoveragePercent",
      label: "Eligible coverage percent",
      kind: "number",
    },
    {
      id: "populationCoveragePercent",
      label: "Population coverage percent",
      kind: "number",
    },
    {
      id: "untreatedEligibleResidents",
      label: "Untreated eligible residents",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      treatedResidents: value.treatedResidents as number,
      eligibleResidents: value.eligibleResidents as number,
      totalResidents: value.totalResidents as number,
    }),
});
export const run = tool.execute;
export default tool;
