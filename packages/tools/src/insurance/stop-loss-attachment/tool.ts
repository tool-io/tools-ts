import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly claimAmount: number;
  readonly specificAttachment: number;
  readonly specificLimit: number;
  readonly annualAggregateClaims: number;
  readonly aggregateAttachment: number;
  readonly aggregateLimit: number;
}>;
export type Output = Readonly<{
  readonly specificRecovery: number;
  readonly aggregateRecovery: number;
  readonly totalRecovery: number;
}>;

export const calculate = (input: Input): Output => {
  const specificRecovery = Math.min(
      input.specificLimit,
      Math.max(0, input.claimAmount - input.specificAttachment),
    ),
    aggregateRecovery = Math.min(
      input.aggregateLimit,
      Math.max(0, input.annualAggregateClaims - input.aggregateAttachment),
    );
  return {
    specificRecovery,
    aggregateRecovery,
    totalRecovery: specificRecovery + aggregateRecovery,
  };
};

export const exampleInput = {
  claimAmount: 500000,
  specificAttachment: 100000,
  specificLimit: 300000,
  annualAggregateClaims: 2000000,
  aggregateAttachment: 1800000,
  aggregateLimit: 500000,
} satisfies Input;
export const exampleOutput = {
  specificRecovery: 300000,
  aggregateRecovery: 200000,
  totalRecovery: 500000,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  calculate: (input) =>
    calculate({
      claimAmount: input.claimAmount as number,
      specificAttachment: input.specificAttachment as number,
      specificLimit: input.specificLimit as number,
      annualAggregateClaims: input.annualAggregateClaims as number,
      aggregateAttachment: input.aggregateAttachment as number,
      aggregateLimit: input.aggregateLimit as number,
    }),
  description:
    "Calculate specific and aggregate stop-loss recoveries from supplied attachments.",
  id: "insurance/stop-loss-attachment",
  inputs: [
    { id: "claimAmount", label: "Claim amount", kind: "number", minimum: 0 },
    {
      id: "specificAttachment",
      label: "Specific attachment",
      kind: "number",
      minimum: 0,
    },
    {
      id: "specificLimit",
      label: "Specific limit",
      kind: "number",
      minimum: 0,
    },
    {
      id: "annualAggregateClaims",
      label: "Annual aggregate claims",
      kind: "number",
      minimum: 0,
    },
    {
      id: "aggregateAttachment",
      label: "Aggregate attachment",
      kind: "number",
      minimum: 0,
    },
    {
      id: "aggregateLimit",
      label: "Aggregate limit",
      kind: "number",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "specificRecovery",
      label: "Specific stop-loss recovery",
      kind: "number",
      minimum: 0,
    },
    {
      id: "aggregateRecovery",
      label: "Aggregate stop-loss recovery",
      kind: "number",
      minimum: 0,
    },
    {
      id: "totalRecovery",
      label: "Total modeled recovery",
      kind: "number",
      minimum: 0,
    },
  ],
  title: "Stop-Loss Attachment",
});

export const run = tool.execute;
export default tool;
