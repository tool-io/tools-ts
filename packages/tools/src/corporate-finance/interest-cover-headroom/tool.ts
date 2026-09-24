import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly operatingEarnings: number;
  readonly interest: number;
  readonly suppliedMinimumCoverage: number;
};
export type Output = {
  readonly coverage: number;
  readonly earningsHeadroom: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    operatingEarnings: { type: "number" },
    interest: { type: "number", exclusiveMinimum: 0 },
    suppliedMinimumCoverage: { type: "number", minimum: 0 },
  },
  required: ["operatingEarnings", "interest", "suppliedMinimumCoverage"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    coverage: { type: "number" },
    earningsHeadroom: { type: "number" },
  },
  required: ["coverage", "earningsHeadroom"],
} as const;
/** Compare supplied earnings/interest to an explicit covenant-style ratio without interpreting debt terms. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { operatingEarnings, interest, suppliedMinimumCoverage } = request;
  const compute = (): Output => {
    H.positive(interest);
    H.domain(suppliedMinimumCoverage >= 0);
    return {
      coverage: operatingEarnings / interest,
      earningsHeadroom: operatingEarnings - interest * suppliedMinimumCoverage,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { operatingEarnings: 100, interest: 20, suppliedMinimumCoverage: 3 },
  output: { coverage: 5, earningsHeadroom: 40 },
} satisfies ToolExample<Input, Output>;
export const interestCoverHeadroomTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "corporate-finance/interest-cover-headroom",
    title: "Interest Cover Headroom Tool",
    description:
      "Compare supplied earnings/interest to an explicit covenant-style ratio without interpreting debt terms.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        operatingEarnings: { type: "number" },
        interest: { type: "number", exclusiveMinimum: 0 },
        suppliedMinimumCoverage: { type: "number", minimum: 0 },
      },
      required: ["operatingEarnings", "interest", "suppliedMinimumCoverage"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        coverage: { type: "number" },
        earningsHeadroom: { type: "number" },
      },
      required: ["coverage", "earningsHeadroom"],
    },
    ports: {
      inputs: [
        {
          id: "operatingEarnings",
          label: "Operating Earnings",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "interest",
          label: "Interest",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "suppliedMinimumCoverage",
          label: "Supplied Minimum Coverage",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "coverage", label: "Coverage", valueType: { type: "number" } },
        {
          id: "earningsHeadroom",
          label: "Earnings Headroom",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = interestCoverHeadroomTool.execute;
export default interestCoverHeadroomTool;
