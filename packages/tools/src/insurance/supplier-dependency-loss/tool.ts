import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly annualGrossProfit: number;
  readonly supplierDependencyPercent: number;
  readonly outageDays: number;
  readonly indemnityDays: number;
  readonly mitigationPercent: number;
}>;
export type Output = Readonly<{
  readonly coveredOutageDays: number;
  readonly grossDependencyLoss: number;
  readonly netDependencyLoss: number;
}>;

export const calculate = (input: Input): Output => {
  const coveredOutageDays = Math.min(input.outageDays, input.indemnityDays),
    grossDependencyLoss =
      (((input.annualGrossProfit * input.supplierDependencyPercent) / 100) *
        coveredOutageDays) /
      365;
  return {
    coveredOutageDays,
    grossDependencyLoss,
    netDependencyLoss:
      grossDependencyLoss * (1 - input.mitigationPercent / 100),
  };
};

export const exampleInput = {
  annualGrossProfit: 365000,
  supplierDependencyPercent: 50,
  outageDays: 20,
  indemnityDays: 30,
  mitigationPercent: 20,
} satisfies Input;
export const exampleOutput = {
  coveredOutageDays: 20,
  grossDependencyLoss: 10000,
  netDependencyLoss: 8000,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  calculate: (input) =>
    calculate({
      annualGrossProfit: input.annualGrossProfit as number,
      supplierDependencyPercent: input.supplierDependencyPercent as number,
      outageDays: input.outageDays as number,
      indemnityDays: input.indemnityDays as number,
      mitigationPercent: input.mitigationPercent as number,
    }),
  description:
    "Estimate contingent business-interruption loss from supplier dependency.",
  id: "insurance/supplier-dependency-loss",
  inputs: [
    {
      id: "annualGrossProfit",
      label: "Annual gross profit",
      kind: "number",
      minimum: 0,
    },
    {
      id: "supplierDependencyPercent",
      label: "Supplier dependency",
      kind: "number",
      minimum: 0,
      maximum: 100,
      unit: "%",
    },
    {
      id: "outageDays",
      label: "Supplier outage",
      kind: "number",
      minimum: 0,
      unit: "days",
    },
    {
      id: "indemnityDays",
      label: "Maximum indemnity period",
      kind: "number",
      minimum: 0,
      unit: "days",
    },
    {
      id: "mitigationPercent",
      label: "Loss mitigation",
      kind: "number",
      minimum: 0,
      maximum: 100,
      unit: "%",
    },
  ],
  outputs: [
    {
      id: "coveredOutageDays",
      label: "Covered outage days",
      kind: "number",
      minimum: 0,
      unit: "days",
    },
    {
      id: "grossDependencyLoss",
      label: "Gross dependency loss",
      kind: "number",
      minimum: 0,
    },
    {
      id: "netDependencyLoss",
      label: "Net dependency loss",
      kind: "number",
      minimum: 0,
    },
  ],
  title: "Supplier Dependency Loss",
});

export const run = tool.execute;
export default tool;
