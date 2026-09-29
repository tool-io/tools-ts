import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly coefficients: readonly number[];
  readonly channelMeasured: readonly boolean[];
  readonly requiredSupport: readonly boolean[];
};
export type Output = {
  readonly requiredChannels: number;
  readonly missingRequiredChannels: number;
  readonly unsupportedCoefficientMass: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    coefficients: { type: "array", maxItems: 256, items: { type: "number" } },
    channelMeasured: {
      type: "array",
      maxItems: 256,
      items: { type: "boolean" },
    },
    requiredSupport: {
      type: "array",
      maxItems: 256,
      items: { type: "boolean" },
    },
  },
  required: ["coefficients", "channelMeasured", "requiredSupport"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    requiredChannels: { type: "integer" },
    missingRequiredChannels: { type: "integer" },
    unsupportedCoefficientMass: { type: "number" },
  },
  required: [
    "requiredChannels",
    "missingRequiredChannels",
    "unsupportedCoefficientMass",
  ],
} as const;
/** Inspect missing channel support for an explicit compensation row without estimating spillover or interpreting immunity. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { coefficients, channelMeasured, requiredSupport } = request;
  const compute = (): Output => {
    H.sameLength(coefficients, channelMeasured);
    H.sameLength(coefficients, requiredSupport);
    return {
      requiredChannels: requiredSupport.filter(Boolean).length,
      missingRequiredChannels: requiredSupport.filter(
        (x, i) => x && !channelMeasured[i],
      ).length,
      unsupportedCoefficientMass: coefficients.reduce(
        (s, x, i) => s + (channelMeasured[i] ? 0 : Math.abs(x)),
        0,
      ),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    coefficients: [1, -0.2, 0.1],
    channelMeasured: [true, false, false],
    requiredSupport: [true, true, false],
  },
  output: {
    requiredChannels: 2,
    missingRequiredChannels: 1,
    unsupportedCoefficientMass: 0.30000000000000004,
  },
} satisfies ToolExample<Input, Output>;
export const compensationRowSupportGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "immunology/compensation-row-support-gap",
    title: "Compensation Row Support Gap Tool",
    description:
      "Inspect missing channel support for an explicit compensation row without estimating spillover or interpreting immunity.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        coefficients: {
          type: "array",
          maxItems: 256,
          items: { type: "number" },
        },
        channelMeasured: {
          type: "array",
          maxItems: 256,
          items: { type: "boolean" },
        },
        requiredSupport: {
          type: "array",
          maxItems: 256,
          items: { type: "boolean" },
        },
      },
      required: ["coefficients", "channelMeasured", "requiredSupport"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        requiredChannels: { type: "integer" },
        missingRequiredChannels: { type: "integer" },
        unsupportedCoefficientMass: { type: "number" },
      },
      required: [
        "requiredChannels",
        "missingRequiredChannels",
        "unsupportedCoefficientMass",
      ],
    },
    ports: {
      inputs: [
        {
          id: "coefficients",
          label: "Coefficients",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
        {
          id: "channelMeasured",
          label: "Channel Measured",
          required: true,
          valueType: { type: "list", items: { type: "boolean" } },
        },
        {
          id: "requiredSupport",
          label: "Required Support",
          required: true,
          valueType: { type: "list", items: { type: "boolean" } },
        },
      ],
      outputs: [
        {
          id: "requiredChannels",
          label: "Required Channels",
          valueType: { type: "integer" },
        },
        {
          id: "missingRequiredChannels",
          label: "Missing Required Channels",
          valueType: { type: "integer" },
        },
        {
          id: "unsupportedCoefficientMass",
          label: "Unsupported Coefficient Mass",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = compensationRowSupportGapTool.execute;
export default compensationRowSupportGapTool;
