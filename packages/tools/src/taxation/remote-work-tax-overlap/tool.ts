import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly taxableRemoteIncome: number;
  readonly residenceTaxRatePercent: number;
  readonly workStateTaxRatePercent: number;
  readonly creditableWorkTaxPercent: number;
}>;
export type Output = Readonly<{
  readonly residenceTax: number;
  readonly workStateTax: number;
  readonly residenceCredit: number;
  readonly combinedTaxAfterCredit: number;
  readonly overlapTax: number;
}>;

export const calculate = (input: Input): Output => {
  const residenceTax =
    (input.taxableRemoteIncome * input.residenceTaxRatePercent) / 100;
  const workStateTax =
    (input.taxableRemoteIncome * input.workStateTaxRatePercent) / 100;
  const residenceCredit = Math.min(
    residenceTax,
    (workStateTax * input.creditableWorkTaxPercent) / 100,
  );
  return {
    residenceTax,
    workStateTax,
    residenceCredit,
    combinedTaxAfterCredit: residenceTax + workStateTax - residenceCredit,
    overlapTax: workStateTax - residenceCredit,
  };
};

export const exampleInput = {
  taxableRemoteIncome: 1000,
  residenceTaxRatePercent: 5,
  workStateTaxRatePercent: 4,
  creditableWorkTaxPercent: 100,
} satisfies Input;
export const exampleOutput = {
  residenceTax: 50,
  workStateTax: 40,
  residenceCredit: 40,
  combinedTaxAfterCredit: 50,
  overlapTax: 0,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  calculate: (input) =>
    calculate({
      taxableRemoteIncome: input.taxableRemoteIncome as number,
      residenceTaxRatePercent: input.residenceTaxRatePercent as number,
      workStateTaxRatePercent: input.workStateTaxRatePercent as number,
      creditableWorkTaxPercent: input.creditableWorkTaxPercent as number,
    }),
  description:
    "Estimate overlapping remote-work state taxes using caller-supplied rates and creditability.",
  id: "taxation/remote-work-tax-overlap",
  inputs: [
    {
      id: "taxableRemoteIncome",
      label: "Remote-work income",
      kind: "number",
      minimum: 0,
    },
    {
      id: "residenceTaxRatePercent",
      label: "Residence tax rate",
      kind: "number",
      minimum: 0,
      unit: "%",
    },
    {
      id: "workStateTaxRatePercent",
      label: "Work-state tax rate",
      kind: "number",
      minimum: 0,
      unit: "%",
    },
    {
      id: "creditableWorkTaxPercent",
      label: "Work-state tax creditable by residence",
      kind: "number",
      minimum: 0,
      maximum: 100,
      unit: "%",
    },
  ],
  outputs: [
    { id: "residenceTax", label: "Residence tax", kind: "number", minimum: 0 },
    { id: "workStateTax", label: "Work-state tax", kind: "number", minimum: 0 },
    {
      id: "residenceCredit",
      label: "Residence-state credit",
      kind: "number",
      minimum: 0,
    },
    {
      id: "combinedTaxAfterCredit",
      label: "Combined tax after credit",
      kind: "number",
      minimum: 0,
    },
    {
      id: "overlapTax",
      label: "Tax remaining from overlap",
      kind: "number",
      minimum: 0,
    },
  ],
  title: "Remote-Work Tax Overlap",
});

export const run = tool.execute;
export default tool;
