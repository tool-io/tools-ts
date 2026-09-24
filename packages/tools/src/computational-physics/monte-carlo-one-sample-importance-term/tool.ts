import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly integrand: number;
  readonly proposalDensity: number;
  readonly targetDensity: number;
};
export type Output = {
  readonly importanceWeight: number;
  readonly contribution: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    integrand: { type: "number" },
    proposalDensity: { type: "number", exclusiveMinimum: 0 },
    targetDensity: { type: "number", minimum: 0 },
  },
  required: ["integrand", "proposalDensity", "targetDensity"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    importanceWeight: { type: "number" },
    contribution: { type: "number" },
  },
  required: ["importanceWeight", "contribution"],
} as const;
/** One importance-weighted sample contribution; normalized weights and effective sample size require the complete sample. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { integrand, proposalDensity, targetDensity } = request;
  const compute = (): Output => {
    H.positive(proposalDensity);
    H.domain(targetDensity >= 0);
    const importanceWeight = targetDensity / proposalDensity;
    return {
      importanceWeight,
      contribution: integrand * importanceWeight,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { integrand: 3, proposalDensity: 0.2, targetDensity: 0.4 },
  output: { importanceWeight: 2, contribution: 6 },
} satisfies ToolExample<Input, Output>;
export const monteCarloOneSampleImportanceTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "computational-physics/monte-carlo-one-sample-importance-term",
    title: "Monte Carlo One Sample Importance Term Tool",
    description:
      "One importance-weighted sample contribution; normalized weights and effective sample size require the complete sample.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        integrand: { type: "number" },
        proposalDensity: { type: "number", exclusiveMinimum: 0 },
        targetDensity: { type: "number", minimum: 0 },
      },
      required: ["integrand", "proposalDensity", "targetDensity"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        importanceWeight: { type: "number" },
        contribution: { type: "number" },
      },
      required: ["importanceWeight", "contribution"],
    },
    ports: {
      inputs: [
        {
          id: "integrand",
          label: "Integrand",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "proposalDensity",
          label: "Proposal Density",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "targetDensity",
          label: "Target Density",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "importanceWeight",
          label: "Importance Weight",
          valueType: { type: "number" },
        },
        {
          id: "contribution",
          label: "Contribution",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = monteCarloOneSampleImportanceTermTool.execute;
export default monteCarloOneSampleImportanceTermTool;
