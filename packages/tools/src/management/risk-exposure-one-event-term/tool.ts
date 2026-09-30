import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly probability: number;
  readonly impact: number;
  readonly mitigationCost: number;
  readonly residualProbability: number;
};
export type Output = {
  readonly initialExposure: number;
  readonly residualExposure: number;
  readonly netReduction: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    probability: { type: "number", minimum: 0, maximum: 1 },
    impact: { type: "number", minimum: 0 },
    mitigationCost: { type: "number", minimum: 0 },
    residualProbability: { type: "number", minimum: 0, maximum: 1 },
  },
  required: ["probability", "impact", "mitigationCost", "residualProbability"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    initialExposure: { type: "number" },
    residualExposure: { type: "number" },
    netReduction: { type: "number" },
  },
  required: ["initialExposure", "residualExposure", "netReduction"],
} as const;
/** Expected single-event loss reduction net of a supplied mitigation cost, without estimating probabilities. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { probability, impact, mitigationCost, residualProbability } = request;
  const compute = (): Output => {
    H.probability(probability);
    H.probability(residualProbability);
    H.domain(impact >= 0 && mitigationCost >= 0);
    return {
      initialExposure: probability * impact,
      residualExposure: residualProbability * impact,
      netReduction:
        (probability - residualProbability) * impact - mitigationCost,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    probability: 0.2,
    impact: 1000,
    mitigationCost: 50,
    residualProbability: 0.1,
  },
  output: { initialExposure: 200, residualExposure: 100, netReduction: 50 },
} satisfies ToolExample<Input, Output>;
export const riskExposureOneEventTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "management/risk-exposure-one-event-term",
    title: "Risk Exposure One Event Term Tool",
    description:
      "Expected single-event loss reduction net of a supplied mitigation cost, without estimating probabilities.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        probability: { type: "number", minimum: 0, maximum: 1 },
        impact: { type: "number", minimum: 0 },
        mitigationCost: { type: "number", minimum: 0 },
        residualProbability: { type: "number", minimum: 0, maximum: 1 },
      },
      required: [
        "probability",
        "impact",
        "mitigationCost",
        "residualProbability",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        initialExposure: { type: "number" },
        residualExposure: { type: "number" },
        netReduction: { type: "number" },
      },
      required: ["initialExposure", "residualExposure", "netReduction"],
    },
    ports: {
      inputs: [
        {
          id: "probability",
          label: "Probability",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "impact",
          label: "Impact",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "mitigationCost",
          label: "Mitigation Cost",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "residualProbability",
          label: "Residual Probability",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "initialExposure",
          label: "Initial Exposure",
          valueType: { type: "number" },
        },
        {
          id: "residualExposure",
          label: "Residual Exposure",
          valueType: { type: "number" },
        },
        {
          id: "netReduction",
          label: "Net Reduction",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = riskExposureOneEventTermTool.execute;
export default riskExposureOneEventTermTool;
