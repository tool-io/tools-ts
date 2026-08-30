import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly coveredEarnings: number;
  readonly homeCountryRatePercent: number;
  readonly hostCountryRatePercent: number;
  readonly applicableSystem: string;
}>;
export type Output = Readonly<{
  readonly homeContribution: number;
  readonly hostContribution: number;
  readonly applicableContribution: number;
  readonly savingsVersusOther: number;
}>;

export const calculate = (input: Input): Output => {
  const homeContribution =
    (input.coveredEarnings * input.homeCountryRatePercent) / 100;
  const hostContribution =
    (input.coveredEarnings * input.hostCountryRatePercent) / 100;
  const applicableContribution =
    input.applicableSystem === "home" ? homeContribution : hostContribution;
  return {
    homeContribution,
    hostContribution,
    applicableContribution,
    savingsVersusOther:
      (input.applicableSystem === "home"
        ? hostContribution
        : homeContribution) - applicableContribution,
  };
};

export const exampleInput = {
  coveredEarnings: 1000,
  homeCountryRatePercent: 10,
  hostCountryRatePercent: 15,
  applicableSystem: "home",
} satisfies Input;
export const exampleOutput = {
  homeContribution: 100,
  hostContribution: 150,
  applicableContribution: 100,
  savingsVersusOther: 50,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  calculate: (input) =>
    calculate({
      coveredEarnings: input.coveredEarnings as number,
      homeCountryRatePercent: input.homeCountryRatePercent as number,
      hostCountryRatePercent: input.hostCountryRatePercent as number,
      applicableSystem: input.applicableSystem as string,
    }),
  description:
    "Compare social contributions under caller-supplied totalization agreement assumptions.",
  id: "taxation/totalization-contribution-comparison",
  inputs: [
    {
      id: "coveredEarnings",
      label: "Covered earnings",
      kind: "number",
      minimum: 0,
    },
    {
      id: "homeCountryRatePercent",
      label: "Home-country contribution rate",
      kind: "number",
      minimum: 0,
      unit: "%",
    },
    {
      id: "hostCountryRatePercent",
      label: "Host-country contribution rate",
      kind: "number",
      minimum: 0,
      unit: "%",
    },
    {
      id: "applicableSystem",
      label: "Applicable system",
      kind: "string",
      enum: ["home", "host"],
    },
  ],
  outputs: [
    {
      id: "homeContribution",
      label: "Home-country contribution",
      kind: "number",
      minimum: 0,
    },
    {
      id: "hostContribution",
      label: "Host-country contribution",
      kind: "number",
      minimum: 0,
    },
    {
      id: "applicableContribution",
      label: "Applicable contribution",
      kind: "number",
      minimum: 0,
    },
    {
      id: "savingsVersusOther",
      label: "Savings versus other system",
      kind: "number",
    },
  ],
  title: "Totalization Contribution Comparison",
});

export const run = tool.execute;
export default tool;
