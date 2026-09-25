import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly workers: number;
  readonly wage: number;
  readonly contributionRate: number;
  readonly beneficiaries: number;
  readonly benefit: number;
};
export type Output = {
  readonly contributions: number;
  readonly payments: number;
  readonly balance: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    workers: { type: "integer", minimum: 0 },
    wage: { type: "number", minimum: 0 },
    contributionRate: { type: "number", minimum: 0, maximum: 1 },
    beneficiaries: { type: "integer", minimum: 0 },
    benefit: { type: "number", minimum: 0 },
  },
  required: ["workers", "wage", "contributionRate", "beneficiaries", "benefit"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    contributions: { type: "number" },
    payments: { type: "number" },
    balance: { type: "number" },
  },
  required: ["contributions", "payments", "balance"],
} as const;
/** Calculate pension paygo balance one worker from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { workers, wage, contributionRate, beneficiaries, benefit } = request;
  const compute = (): Output => {
    H.integer(workers, 0);
    H.integer(beneficiaries, 0);
    H.domain(wage >= 0 && benefit >= 0);
    H.probability(contributionRate);
    return {
      contributions: workers * wage * contributionRate,
      payments: beneficiaries * benefit,
      balance: workers * wage * contributionRate - beneficiaries * benefit,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    workers: 100,
    wage: 1000,
    contributionRate: 0.2,
    beneficiaries: 25,
    benefit: 600,
  },
  output: { contributions: 20000, payments: 15000, balance: 5000 },
} satisfies ToolExample<Input, Output>;
export const pensionPaygoBalanceOneWorkerTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "demographic-economics/pension-paygo-balance-one-worker",
    title: "Pension Paygo Balance One Worker Tool",
    description:
      "Calculate pension paygo balance one worker from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        workers: { type: "integer", minimum: 0 },
        wage: { type: "number", minimum: 0 },
        contributionRate: { type: "number", minimum: 0, maximum: 1 },
        beneficiaries: { type: "integer", minimum: 0 },
        benefit: { type: "number", minimum: 0 },
      },
      required: [
        "workers",
        "wage",
        "contributionRate",
        "beneficiaries",
        "benefit",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        contributions: { type: "number" },
        payments: { type: "number" },
        balance: { type: "number" },
      },
      required: ["contributions", "payments", "balance"],
    },
    ports: {
      inputs: [
        {
          id: "workers",
          label: "Workers",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "wage",
          label: "Wage",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "contributionRate",
          label: "Contribution Rate",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "beneficiaries",
          label: "Beneficiaries",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "benefit",
          label: "Benefit",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "contributions",
          label: "Contributions",
          valueType: { type: "number" },
        },
        { id: "payments", label: "Payments", valueType: { type: "number" } },
        { id: "balance", label: "Balance", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = pensionPaygoBalanceOneWorkerTool.execute;
export default pensionPaygoBalanceOneWorkerTool;
