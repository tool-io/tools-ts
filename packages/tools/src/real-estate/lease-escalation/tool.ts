import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type LeaseEscalationInput = Readonly<{
  readonly startingAnnualRent: number;
  readonly annualIncreasePercent: number;
  readonly years: number;
}>;
export type LeaseEscalationOutput = Readonly<{
  readonly futureAnnualRent: number;
}>;

export const calculateLeaseEscalation = (
  x: LeaseEscalationInput,
): LeaseEscalationOutput => {
  if (!Number.isFinite(x.startingAnnualRent) || x.startingAnnualRent < 0)
    simpleError("startingAnnualRent", "Provide a finite nonnegative number.");
  if (!Number.isFinite(x.annualIncreasePercent))
    simpleError("annualIncreasePercent", "Provide a finite number.");
  if (!Number.isFinite(x.years) || x.years < 0)
    simpleError("years", "Provide a finite nonnegative number.");
  if (!(x.annualIncreasePercent >= -100 && Number.isInteger(x.years)))
    simpleError("input", "Inputs violate the stated model or operating range.");
  const futureAnnualRent =
    x.startingAnnualRent * (1 + x.annualIncreasePercent / 100) ** x.years;
  if (!Number.isFinite(futureAnnualRent))
    simpleError(
      "futureAnnualRent",
      "Inputs produce an undefined or out-of-range result.",
    );
  return {
    futureAnnualRent: Object.is(futureAnnualRent, -0) ? 0 : futureAnnualRent,
  };
};

export const example = {
  input: {
    startingAnnualRent: 12000,
    annualIncreasePercent: 3,
    years: 2,
  },
  output: { futureAnnualRent: 12730.8 },
} satisfies ToolExample<LeaseEscalationInput, LeaseEscalationOutput>;

export const tool = createSimpleTool({
  id: "real-estate/lease-escalation",
  title: "Lease Escalation",
  description:
    "Future rent after compounding an annual escalation rate for a whole number of years.",
  inputs: [
    {
      id: "startingAnnualRent",
      kind: "number",
      label: "Starting Annual Rent",
      unit: "currency",
      minimum: 0,
    },
    {
      id: "annualIncreasePercent",
      kind: "number",
      label: "Annual Increase Percent",
      unit: "percent",
    },
    { id: "years", kind: "number", label: "Years", minimum: 0 },
  ],
  outputs: [
    {
      id: "futureAnnualRent",
      kind: "number",
      label: "Future Annual Rent",
      unit: "currency",
    },
  ],
  calculate: (input) =>
    calculateLeaseEscalation({
      startingAnnualRent: input.startingAnnualRent as number,
      annualIncreasePercent: input.annualIncreasePercent as number,
      years: input.years as number,
    }),
});
export const leaseEscalationTool = tool;
export const runLeaseEscalation = tool.execute;
export default tool;
