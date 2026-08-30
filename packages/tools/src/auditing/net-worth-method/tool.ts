import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly openingNetWorth: number;
  readonly closingNetWorth: number;
  readonly nondeductibleExpenditures: number;
  readonly knownNontaxableSources: number;
  readonly reportedTaxableIncome: number;
}>;
export type Output = Readonly<{
  readonly netWorthIncrease: number;
  readonly impliedTaxableIncome: number;
  readonly unexplainedIncome: number;
}>;

export const calculate = (input: Input): Output => {
  const netWorthIncrease = input.closingNetWorth - input.openingNetWorth,
    impliedTaxableIncome =
      netWorthIncrease +
      input.nondeductibleExpenditures -
      input.knownNontaxableSources;
  return {
    netWorthIncrease,
    impliedTaxableIncome,
    unexplainedIncome: impliedTaxableIncome - input.reportedTaxableIncome,
  };
};

export const exampleInput = {
  openingNetWorth: 1000,
  closingNetWorth: 1400,
  nondeductibleExpenditures: 200,
  knownNontaxableSources: 100,
  reportedTaxableIncome: 450,
} satisfies Input;
export const exampleOutput = {
  netWorthIncrease: 400,
  impliedTaxableIncome: 500,
  unexplainedIncome: 50,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  calculate: (input) =>
    calculate({
      openingNetWorth: input.openingNetWorth as number,
      closingNetWorth: input.closingNetWorth as number,
      nondeductibleExpenditures: input.nondeductibleExpenditures as number,
      knownNontaxableSources: input.knownNontaxableSources as number,
      reportedTaxableIncome: input.reportedTaxableIncome as number,
    }),
  description:
    "Apply a net-worth method reconciliation to supplied changes and sources.",
  id: "auditing/net-worth-method",
  inputs: [
    { id: "openingNetWorth", label: "Opening net worth", kind: "number" },
    { id: "closingNetWorth", label: "Closing net worth", kind: "number" },
    {
      id: "nondeductibleExpenditures",
      label: "Nondeductible expenditures",
      kind: "number",
      minimum: 0,
    },
    {
      id: "knownNontaxableSources",
      label: "Known nontaxable sources",
      kind: "number",
      minimum: 0,
    },
    {
      id: "reportedTaxableIncome",
      label: "Reported taxable income",
      kind: "number",
    },
  ],
  outputs: [
    { id: "netWorthIncrease", label: "Net-worth increase", kind: "number" },
    {
      id: "impliedTaxableIncome",
      label: "Implied taxable income",
      kind: "number",
    },
    {
      id: "unexplainedIncome",
      label: "Implied minus reported income",
      kind: "number",
    },
  ],
  title: "Net-Worth Method",
});

export const run = tool.execute;
export default tool;
