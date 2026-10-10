import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly observedFlow: number;
  readonly referenceFlow: number;
};
export type Output = {
  readonly observedToReference: number;
  readonly relativeDifference: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    observedFlow: { type: "number", minimum: 0 },
    referenceFlow: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["observedFlow", "referenceFlow"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    observedToReference: { type: "number" },
    relativeDifference: { type: "number" },
  },
  required: ["observedToReference", "relativeDifference"],
} as const;
/** Compare an explicit sampler flow with a supplied positive reference without selecting a calibration tolerance. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { observedFlow, referenceFlow } = request;
  const compute = (): Output => {
    H.domain(observedFlow >= 0, "observedFlow");
    (H.domain(referenceFlow > 0, "referenceFlow"), referenceFlow);
    return {
      observedToReference: observedFlow / referenceFlow,
      relativeDifference: (observedFlow - referenceFlow) / referenceFlow,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { observedFlow: 2.1, referenceFlow: 2 },
  output: {
    observedToReference: 1.05,
    relativeDifference: 0.050000000000000044,
  },
} satisfies ToolExample<Input, Output>;
export const occupationalSamplerCalibrationRatioTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      discovery: {
        aliases: [],
        collections: ["data"],
        fields: [
          "occupational-health",
          "occupational health",
          "health and medicine",
        ],
        keywords: ["occupational health", "health and medicine"],
      },
      id: "occupational-health/occupational-sampler-calibration-ratio",
      title: "Occupational Sampler Calibration Ratio",
      description:
        "Compare an explicit sampler flow with a supplied positive reference without selecting a calibration tolerance.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          observedFlow: { type: "number", minimum: 0 },
          referenceFlow: { type: "number", exclusiveMinimum: 0 },
        },
        required: ["observedFlow", "referenceFlow"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          observedToReference: { type: "number" },
          relativeDifference: { type: "number" },
        },
        required: ["observedToReference", "relativeDifference"],
      },
      ports: {
        inputs: [
          {
            id: "observedFlow",
            label: "Observed Flow",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "referenceFlow",
            label: "Reference Flow",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "observedToReference",
            label: "Observed To Reference",
            valueType: { type: "number" },
          },
          {
            id: "relativeDifference",
            label: "Relative Difference",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = occupationalSamplerCalibrationRatioTool.execute;
export default occupationalSamplerCalibrationRatioTool;
