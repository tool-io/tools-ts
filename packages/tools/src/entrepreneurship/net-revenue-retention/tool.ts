import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import { nonnegative, positive } from "../shared.js";

export type Input = Readonly<{
  readonly startingRevenue: number;
  readonly churnedRevenue: number;
  readonly contractedRevenue: number;
  readonly expandedRevenue: number;
}>;
export type Output = Readonly<{
  readonly endingCohortRevenue: number;
  readonly nrrPercent: number;
}>;
export const calculate = (input: Input): Output => {
  positive(input.startingRevenue, "startingRevenue");
  [
    input.churnedRevenue,
    input.contractedRevenue,
    input.expandedRevenue,
  ].forEach((v) => nonnegative(v, "expandedRevenue"));
  if (input.churnedRevenue + input.contractedRevenue > input.startingRevenue)
    simpleError("churnedRevenue", "Losses exceed starting cohort revenue.");
  const endingCohortRevenue =
    input.startingRevenue -
    input.churnedRevenue -
    input.contractedRevenue +
    input.expandedRevenue;
  return {
    endingCohortRevenue,
    nrrPercent: (100 * endingCohortRevenue) / input.startingRevenue,
  };
};
export const exampleInput = {
  startingRevenue: 100,
  churnedRevenue: 10,
  contractedRevenue: 5,
  expandedRevenue: 25,
} satisfies Input;
export const exampleOutput = {
  endingCohortRevenue: 110,
  nrrPercent: 110,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "entrepreneurship/net-revenue-retention",
  title: "Net Revenue Retention",
  description:
    "Compute net revenue retention including expansion within the starting customer cohort.",
  inputs: [
    { id: "startingRevenue", label: "Starting revenue", kind: "number" },
    { id: "churnedRevenue", label: "Churned revenue", kind: "number" },
    { id: "contractedRevenue", label: "Contracted revenue", kind: "number" },
    { id: "expandedRevenue", label: "Expanded revenue", kind: "number" },
  ],
  outputs: [
    {
      id: "endingCohortRevenue",
      label: "Ending cohort revenue",
      kind: "number",
    },
    { id: "nrrPercent", label: "Nrr percent", kind: "number" },
  ],
  calculate: (value) =>
    calculate({
      startingRevenue: value.startingRevenue as number,
      churnedRevenue: value.churnedRevenue as number,
      contractedRevenue: value.contractedRevenue as number,
      expandedRevenue: value.expandedRevenue as number,
    }),
});
export const run = tool.execute;
export default tool;
