import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly bloodFlow: number;
  readonly arterialOxygenContent: number;
  readonly venousOxygenContent: number;
  readonly contentUnitFactor: number;
};
export type Output = {
  readonly contentDifference: number;
  readonly oxygenConsumption: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    bloodFlow: { type: "number", minimum: 0 },
    arterialOxygenContent: { type: "number" },
    venousOxygenContent: { type: "number" },
    contentUnitFactor: { type: "number", exclusiveMinimum: 0 },
  },
  required: [
    "bloodFlow",
    "arterialOxygenContent",
    "venousOxygenContent",
    "contentUnitFactor",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    contentDifference: { type: "number" },
    oxygenConsumption: { type: "number" },
  },
  required: ["contentDifference", "oxygenConsumption"],
} as const;
/** Fick oxygen mass-balance product from independently supplied compatible flow and content observations; no clinical parameter is estimated. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const {
    bloodFlow,
    arterialOxygenContent,
    venousOxygenContent,
    contentUnitFactor,
  } = request;
  const compute = (): Output => {
    H.domain(bloodFlow >= 0);
    H.positive(contentUnitFactor);
    return {
      contentDifference: arterialOxygenContent - venousOxygenContent,
      oxygenConsumption:
        bloodFlow *
        (arterialOxygenContent - venousOxygenContent) *
        contentUnitFactor,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    bloodFlow: 5,
    arterialOxygenContent: 200,
    venousOxygenContent: 150,
    contentUnitFactor: 1,
  },
  output: { contentDifference: 50, oxygenConsumption: 250 },
} satisfies ToolExample<Input, Output>;
export const oxygenConsumptionFickOneFlowTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "physiology/oxygen-consumption-fick-one-flow-term",
    title: "Oxygen Consumption Fick One Flow Term Tool",
    description:
      "Fick oxygen mass-balance product from independently supplied compatible flow and content observations; no clinical parameter is estimated.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        bloodFlow: { type: "number", minimum: 0 },
        arterialOxygenContent: { type: "number" },
        venousOxygenContent: { type: "number" },
        contentUnitFactor: { type: "number", exclusiveMinimum: 0 },
      },
      required: [
        "bloodFlow",
        "arterialOxygenContent",
        "venousOxygenContent",
        "contentUnitFactor",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        contentDifference: { type: "number" },
        oxygenConsumption: { type: "number" },
      },
      required: ["contentDifference", "oxygenConsumption"],
    },
    ports: {
      inputs: [
        {
          id: "bloodFlow",
          label: "Blood Flow",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "arterialOxygenContent",
          label: "Arterial Oxygen Content",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "venousOxygenContent",
          label: "Venous Oxygen Content",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "contentUnitFactor",
          label: "Content Unit Factor",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "contentDifference",
          label: "Content Difference",
          valueType: { type: "number" },
        },
        {
          id: "oxygenConsumption",
          label: "Oxygen Consumption",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = oxygenConsumptionFickOneFlowTermTool.execute;
export default oxygenConsumptionFickOneFlowTermTool;
