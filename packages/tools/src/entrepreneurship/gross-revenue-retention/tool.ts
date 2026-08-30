import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import { nonnegative, positive } from "../shared.js";

export type Input = Readonly<{
  readonly startingRevenue: number;
  readonly churnedRevenue: number;
  readonly contractedRevenue: number;
}>;
export type Output = Readonly<{
  readonly retainedRevenue: number;
  readonly grrPercent: number;
}>;
export const calculate = (input: Input): Output => {
  positive(input.startingRevenue, "startingRevenue");
  nonnegative(input.churnedRevenue, "churnedRevenue");
  nonnegative(input.contractedRevenue, "contractedRevenue");
  if (input.churnedRevenue + input.contractedRevenue > input.startingRevenue)
    simpleError(
      "churnedRevenue",
      "Revenue losses exceed starting cohort revenue.",
    );
  const retainedRevenue =
    input.startingRevenue - input.churnedRevenue - input.contractedRevenue;
  return {
    retainedRevenue,
    grrPercent: (100 * retainedRevenue) / input.startingRevenue,
  };
};
export const exampleInput = {
  startingRevenue: 100,
  churnedRevenue: 10,
  contractedRevenue: 5,
} satisfies Input;
export const exampleOutput = {
  retainedRevenue: 85,
  grrPercent: 85,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "entrepreneurship/gross-revenue-retention",
  title: "Gross Revenue Retention",
  description:
    "Compute gross revenue retention excluding expansions and new customers.",
  inputs: [
    { id: "startingRevenue", label: "Starting revenue", kind: "number" },
    { id: "churnedRevenue", label: "Churned revenue", kind: "number" },
    { id: "contractedRevenue", label: "Contracted revenue", kind: "number" },
  ],
  outputs: [
    { id: "retainedRevenue", label: "Retained revenue", kind: "number" },
    { id: "grrPercent", label: "Grr percent", kind: "number" },
  ],
  calculate: (value) =>
    calculate({
      startingRevenue: value.startingRevenue as number,
      churnedRevenue: value.churnedRevenue as number,
      contractedRevenue: value.contractedRevenue as number,
    }),
});
export const run = tool.execute;
export default tool;
