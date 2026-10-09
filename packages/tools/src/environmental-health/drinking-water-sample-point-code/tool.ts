import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly specimenId: string;
  readonly pointCode: string;
  readonly samplingPlanSource: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    specimenId: { type: "string", maxLength: 8192, minLength: 1 },
    pointCode: { type: "string", maxLength: 8192, minLength: 1 },
    samplingPlanSource: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["specimenId", "pointCode", "samplingPlanSource"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Qualify an explicitly supplied drinking-water sampling point by its plan source without assessing water safety. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { specimenId, pointCode, samplingPlanSource } = request;
  const compute = (): Output => {
    H.domain(specimenId.length > 0, "specimenId");
    H.domain(pointCode.length > 0, "pointCode");
    H.domain(samplingPlanSource.length > 0, "samplingPlanSource");
    return {
      token: JSON.stringify([specimenId, pointCode, samplingPlanSource]),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    specimenId: "S17",
    pointCode: "TAP3",
    samplingPlanSource: "Plan A v2",
  },
  output: { token: '["S17","TAP3","Plan A v2"]' },
} satisfies ToolExample<Input, Output>;
export const drinkingWaterSamplePointCodeTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: [
        "environmental-health",
        "environmental health",
        "health and medicine",
      ],
      keywords: ["environmental health", "health and medicine"],
    },
    id: "environmental-health/drinking-water-sample-point-code",
    title: "Drinking Water Sample Point Code",
    description:
      "Qualify an explicitly supplied drinking-water sampling point by its plan source without assessing water safety.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        specimenId: { type: "string", maxLength: 8192, minLength: 1 },
        pointCode: { type: "string", maxLength: 8192, minLength: 1 },
        samplingPlanSource: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["specimenId", "pointCode", "samplingPlanSource"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { token: { type: "string", maxLength: 8192 } },
      required: ["token"],
    },
    ports: {
      inputs: [
        {
          id: "specimenId",
          label: "Specimen Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "pointCode",
          label: "Point Code",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "samplingPlanSource",
          label: "Sampling Plan Source",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "token", label: "Token", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = drinkingWaterSamplePointCodeTool.execute;
export default drinkingWaterSamplePointCodeTool;
