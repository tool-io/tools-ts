import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly treatmentRate: number;
  readonly controlRate: number;
  readonly exposedCount: number;
  readonly unitMargin: number;
};
export type Output = {
  readonly incrementalCount: number;
  readonly marginContribution: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    treatmentRate: { type: "number", minimum: 0, maximum: 1 },
    controlRate: { type: "number", minimum: 0, maximum: 1 },
    exposedCount: { type: "integer", minimum: 0 },
    unitMargin: { type: "number" },
  },
  required: ["treatmentRate", "controlRate", "exposedCount", "unitMargin"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    incrementalCount: { type: "number" },
    marginContribution: { type: "number" },
  },
  required: ["incrementalCount", "marginContribution"],
} as const;
/** Apply an independently estimated rate difference to exposure and unit margin; no causal lift is inferred. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { treatmentRate, controlRate, exposedCount, unitMargin } = request;
  const compute = (): Output => {
    H.probability(treatmentRate);
    H.probability(controlRate);
    H.integer(exposedCount, 0);
    return {
      incrementalCount: (treatmentRate - controlRate) * exposedCount,
      marginContribution:
        (treatmentRate - controlRate) * exposedCount * unitMargin,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    treatmentRate: 0.2,
    controlRate: 0.1,
    exposedCount: 1000,
    unitMargin: 5,
  },
  output: { incrementalCount: 100, marginContribution: 500 },
} satisfies ToolExample<Input, Output>;
export const campaignNetLiftContributionTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "marketing/campaign-net-lift-contribution",
    title: "Campaign Net Lift Contribution Tool",
    description:
      "Apply an independently estimated rate difference to exposure and unit margin; no causal lift is inferred.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        treatmentRate: { type: "number", minimum: 0, maximum: 1 },
        controlRate: { type: "number", minimum: 0, maximum: 1 },
        exposedCount: { type: "integer", minimum: 0 },
        unitMargin: { type: "number" },
      },
      required: ["treatmentRate", "controlRate", "exposedCount", "unitMargin"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        incrementalCount: { type: "number" },
        marginContribution: { type: "number" },
      },
      required: ["incrementalCount", "marginContribution"],
    },
    ports: {
      inputs: [
        {
          id: "treatmentRate",
          label: "Treatment Rate",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "controlRate",
          label: "Control Rate",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "exposedCount",
          label: "Exposed Count",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "unitMargin",
          label: "Unit Margin",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "incrementalCount",
          label: "Incremental Count",
          valueType: { type: "number" },
        },
        {
          id: "marginContribution",
          label: "Margin Contribution",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = campaignNetLiftContributionTool.execute;
export default campaignNetLiftContributionTool;
