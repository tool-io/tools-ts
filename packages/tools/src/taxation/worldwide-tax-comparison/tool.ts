import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly worldwideIncome: number;
  readonly foreignSourceIncome: number;
  readonly citizenshipSystemRatePercent: number;
  readonly residenceSystemRatePercent: number;
  readonly foreignTaxPaid: number;
}>;
export type Output = Readonly<{
  readonly citizenshipSystemTaxBeforeCredit: number;
  readonly foreignTaxCredit: number;
  readonly citizenshipSystemTaxAfterCredit: number;
  readonly residenceSystemTax: number;
  readonly taxDifference: number;
}>;

export const calculate = (input: Input): Output => {
  if (input.foreignSourceIncome > input.worldwideIncome)
    simpleError(
      "foreignSourceIncome",
      "Foreign-source income cannot exceed worldwide income.",
      "invalid_income",
    );
  const citizenshipSystemTaxBeforeCredit =
    (input.worldwideIncome * input.citizenshipSystemRatePercent) / 100;
  const creditLimit =
    (input.foreignSourceIncome * input.citizenshipSystemRatePercent) / 100;
  const foreignTaxCredit = Math.min(input.foreignTaxPaid, creditLimit);
  const citizenshipSystemTaxAfterCredit = Math.max(
    0,
    citizenshipSystemTaxBeforeCredit - foreignTaxCredit,
  );
  const residenceSystemTax =
    (input.worldwideIncome * input.residenceSystemRatePercent) / 100;
  return {
    citizenshipSystemTaxBeforeCredit,
    foreignTaxCredit,
    citizenshipSystemTaxAfterCredit,
    residenceSystemTax,
    taxDifference: citizenshipSystemTaxAfterCredit - residenceSystemTax,
  };
};

export const exampleInput = {
  worldwideIncome: 1000,
  foreignSourceIncome: 500,
  citizenshipSystemRatePercent: 20,
  residenceSystemRatePercent: 10,
  foreignTaxPaid: 50,
} satisfies Input;
export const exampleOutput = {
  citizenshipSystemTaxBeforeCredit: 200,
  foreignTaxCredit: 50,
  citizenshipSystemTaxAfterCredit: 150,
  residenceSystemTax: 100,
  taxDifference: 50,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  calculate: (input) =>
    calculate({
      worldwideIncome: input.worldwideIncome as number,
      foreignSourceIncome: input.foreignSourceIncome as number,
      citizenshipSystemRatePercent:
        input.citizenshipSystemRatePercent as number,
      residenceSystemRatePercent: input.residenceSystemRatePercent as number,
      foreignTaxPaid: input.foreignTaxPaid as number,
    }),
  description:
    "Compare caller-parameterized citizenship- and residence-based tax scenarios.",
  id: "taxation/worldwide-tax-comparison",
  inputs: [
    {
      id: "worldwideIncome",
      label: "Worldwide income",
      kind: "number",
      minimum: 0,
    },
    {
      id: "foreignSourceIncome",
      label: "Foreign-source income",
      kind: "number",
      minimum: 0,
    },
    {
      id: "citizenshipSystemRatePercent",
      label: "Citizenship-system rate",
      kind: "number",
      minimum: 0,
      unit: "%",
    },
    {
      id: "residenceSystemRatePercent",
      label: "Residence-system rate",
      kind: "number",
      minimum: 0,
      unit: "%",
    },
    {
      id: "foreignTaxPaid",
      label: "Foreign tax paid",
      kind: "number",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "citizenshipSystemTaxBeforeCredit",
      label: "Citizenship-system tax before credit",
      kind: "number",
      minimum: 0,
    },
    {
      id: "foreignTaxCredit",
      label: "Foreign tax credit",
      kind: "number",
      minimum: 0,
    },
    {
      id: "citizenshipSystemTaxAfterCredit",
      label: "Citizenship-system tax after credit",
      kind: "number",
      minimum: 0,
    },
    {
      id: "residenceSystemTax",
      label: "Residence-system tax",
      kind: "number",
      minimum: 0,
    },
    {
      id: "taxDifference",
      label: "Citizenship minus residence tax",
      kind: "number",
    },
  ],
  title: "Worldwide Tax Comparison",
});

export const run = tool.execute;
export default tool;
