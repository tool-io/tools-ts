import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";

export type Input = Readonly<{
  readonly randomMating: boolean;
  readonly largePopulation: boolean;
  readonly noMigration: boolean;
  readonly noMutation: boolean;
  readonly noSelection: boolean;
}>;
export type Output = Readonly<{
  readonly violatedAssumptions: readonly string[];
  readonly assumptionsSatisfied: boolean;
}>;
export const calculate = (input: Input): Output => {
  const pairs: [[string, boolean], ...Array<[string, boolean]>] = [
      ["random-mating", input.randomMating],
      ["large-population", input.largePopulation],
      ["no-migration", input.noMigration],
      ["no-mutation", input.noMutation],
      ["no-selection", input.noSelection],
    ],
    violatedAssumptions = pairs
      .filter(([, satisfied]) => !satisfied)
      .map(([label]) => label);
  return {
    violatedAssumptions,
    assumptionsSatisfied: violatedAssumptions.length === 0,
  };
};
export const exampleInput = {
  randomMating: true,
  largePopulation: true,
  noMigration: false,
  noMutation: true,
  noSelection: true,
} satisfies Input;
export const exampleOutput = {
  violatedAssumptions: ["no-migration"],
  assumptionsSatisfied: false,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "genetics/hardy-weinberg-assumption-audit",
  title: "Hardy Weinberg Assumption Audit",
  description:
    "Audit caller-assessed Hardy–Weinberg assumptions without testing observed genotype equilibrium.",
  inputs: [
    { id: "randomMating", label: "Random mating", kind: "boolean" },
    { id: "largePopulation", label: "Large population", kind: "boolean" },
    { id: "noMigration", label: "No migration", kind: "boolean" },
    { id: "noMutation", label: "No mutation", kind: "boolean" },
    { id: "noSelection", label: "No selection", kind: "boolean" },
  ],
  outputs: [
    {
      id: "violatedAssumptions",
      label: "Violated assumptions",
      kind: "stringList",
    },
    {
      id: "assumptionsSatisfied",
      label: "Assumptions satisfied",
      kind: "boolean",
    },
  ],
  calculate: (value) =>
    calculate({
      randomMating: value.randomMating as boolean,
      largePopulation: value.largePopulation as boolean,
      noMigration: value.noMigration as boolean,
      noMutation: value.noMutation as boolean,
      noSelection: value.noSelection as boolean,
    }),
});
export const run = tool.execute;
export default tool;
