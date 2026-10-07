import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly measuredRadius: number;
  readonly referenceMinimumRadius: number;
};
export type Output = { readonly radiusRatio: number; readonly margin: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    measuredRadius: { type: "number", minimum: 0 },
    referenceMinimumRadius: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["measuredRadius", "referenceMinimumRadius"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { radiusRatio: { type: "number" }, margin: { type: "number" } },
  required: ["radiusRatio", "margin"],
} as const;
/** Compare a measured wearable bend radius with an explicitly supplied positive reference radius without selecting a device safety limit. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { measuredRadius, referenceMinimumRadius } = request;
  const compute = (): Output => {
    H.domain(measuredRadius >= 0, "measuredRadius");
    (H.domain(referenceMinimumRadius > 0, "referenceMinimumRadius"),
      referenceMinimumRadius);
    return {
      radiusRatio: measuredRadius / referenceMinimumRadius,
      margin: measuredRadius - referenceMinimumRadius,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { measuredRadius: 30, referenceMinimumRadius: 20 },
  output: { radiusRatio: 1.5, margin: 10 },
} satisfies ToolExample<Input, Output>;
export const wearableBendRadiusRatioTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data", "learn"],
      fields: ["bioengineering", "engineering"],
      keywords: ["bioengineering", "engineering"],
    },
    id: "bioengineering/wearable-bend-radius-ratio",
    title: "Wearable Bend Radius Ratio",
    description:
      "Compare a measured wearable bend radius with an explicitly supplied positive reference radius without selecting a device safety limit.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        measuredRadius: { type: "number", minimum: 0 },
        referenceMinimumRadius: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["measuredRadius", "referenceMinimumRadius"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        radiusRatio: { type: "number" },
        margin: { type: "number" },
      },
      required: ["radiusRatio", "margin"],
    },
    ports: {
      inputs: [
        {
          id: "measuredRadius",
          label: "Measured Radius",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "referenceMinimumRadius",
          label: "Reference Minimum Radius",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "radiusRatio",
          label: "Radius Ratio",
          valueType: { type: "number" },
        },
        { id: "margin", label: "Margin", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = wearableBendRadiusRatioTool.execute;
export default wearableBendRadiusRatioTool;
