import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly displayIncrement: number;
  readonly conversionScale: number;
  readonly repeatabilitySd: number;
};
export type Output = {
  readonly roundingHalfWidth: number;
  readonly roundingSd: number;
  readonly combinedStandard: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    displayIncrement: { type: "number", minimum: 0 },
    conversionScale: { type: "number" },
    repeatabilitySd: { type: "number", minimum: 0 },
  },
  required: ["displayIncrement", "conversionScale", "repeatabilitySd"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    roundingHalfWidth: { type: "number" },
    roundingSd: { type: "number" },
    combinedStandard: { type: "number" },
  },
  required: ["roundingHalfWidth", "roundingSd", "combinedStandard"],
} as const;
/** Display-rounding uncertainty under an explicit uniform quantization model combined with independent supplied repeatability, not a device acceptance standard. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { displayIncrement, conversionScale, repeatabilitySd } = request;
  const compute = (): Output => {
    H.domain(displayIncrement >= 0 && repeatabilitySd >= 0);
    return {
      roundingHalfWidth: (displayIncrement * Math.abs(conversionScale)) / 2,
      roundingSd:
        (displayIncrement * Math.abs(conversionScale)) / Math.sqrt(12),
      combinedStandard: Math.hypot(
        (displayIncrement * Math.abs(conversionScale)) / Math.sqrt(12),
        repeatabilitySd,
      ),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { displayIncrement: 0.2, conversionScale: 1, repeatabilitySd: 0 },
  output: {
    roundingHalfWidth: 0.1,
    roundingSd: 0.05773502691896258,
    combinedStandard: 0.05773502691896258,
  },
} satisfies ToolExample<Input, Output>;
export const pediatricDeviceResolutionHalfwidthTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "pediatrics/pediatric-device-resolution-halfwidth",
    title: "Pediatric Device Resolution Halfwidth Tool",
    description:
      "Display-rounding uncertainty under an explicit uniform quantization model combined with independent supplied repeatability, not a device acceptance standard.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        displayIncrement: { type: "number", minimum: 0 },
        conversionScale: { type: "number" },
        repeatabilitySd: { type: "number", minimum: 0 },
      },
      required: ["displayIncrement", "conversionScale", "repeatabilitySd"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        roundingHalfWidth: { type: "number" },
        roundingSd: { type: "number" },
        combinedStandard: { type: "number" },
      },
      required: ["roundingHalfWidth", "roundingSd", "combinedStandard"],
    },
    ports: {
      inputs: [
        {
          id: "displayIncrement",
          label: "Display Increment",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "conversionScale",
          label: "Conversion Scale",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "repeatabilitySd",
          label: "Repeatability Sd",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "roundingHalfWidth",
          label: "Rounding Half Width",
          valueType: { type: "number" },
        },
        {
          id: "roundingSd",
          label: "Rounding Sd",
          valueType: { type: "number" },
        },
        {
          id: "combinedStandard",
          label: "Combined Standard",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = pediatricDeviceResolutionHalfwidthTool.execute;
export default pediatricDeviceResolutionHalfwidthTool;
