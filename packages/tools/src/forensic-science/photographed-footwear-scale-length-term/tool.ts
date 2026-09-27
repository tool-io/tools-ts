import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly impressionPixels: number;
  readonly referencePixels: number;
  readonly referenceLength: number;
  readonly enlargementFactor: number;
};
export type Output = {
  readonly imageScale: number;
  readonly originalLength: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    impressionPixels: { type: "number", minimum: 0 },
    referencePixels: { type: "number", exclusiveMinimum: 0 },
    referenceLength: { type: "number", exclusiveMinimum: 0 },
    enlargementFactor: { type: "number", exclusiveMinimum: 0 },
  },
  required: [
    "impressionPixels",
    "referencePixels",
    "referenceLength",
    "enlargementFactor",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    imageScale: { type: "number" },
    originalLength: { type: "number" },
  },
  required: ["imageScale", "originalLength"],
} as const;
/** Calibrated impression length with an explicit additional relative enlargement factor; no footwear-source or wearer inference. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const {
    impressionPixels,
    referencePixels,
    referenceLength,
    enlargementFactor,
  } = request;
  const compute = (): Output => {
    H.domain(impressionPixels >= 0);
    H.positive(referencePixels);
    H.positive(referenceLength);
    H.positive(enlargementFactor);
    return {
      imageScale: referenceLength / referencePixels,
      originalLength:
        (impressionPixels * referenceLength) /
        (referencePixels * enlargementFactor),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    impressionPixels: 600,
    referencePixels: 200,
    referenceLength: 100,
    enlargementFactor: 1,
  },
  output: { imageScale: 0.5, originalLength: 300 },
} satisfies ToolExample<Input, Output>;
export const photographedFootwearScaleLengthTermTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "forensic-science/photographed-footwear-scale-length-term",
      title: "Photographed Footwear Scale Length Term Tool",
      description:
        "Calibrated impression length with an explicit additional relative enlargement factor; no footwear-source or wearer inference.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          impressionPixels: { type: "number", minimum: 0 },
          referencePixels: { type: "number", exclusiveMinimum: 0 },
          referenceLength: { type: "number", exclusiveMinimum: 0 },
          enlargementFactor: { type: "number", exclusiveMinimum: 0 },
        },
        required: [
          "impressionPixels",
          "referencePixels",
          "referenceLength",
          "enlargementFactor",
        ],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          imageScale: { type: "number" },
          originalLength: { type: "number" },
        },
        required: ["imageScale", "originalLength"],
      },
      ports: {
        inputs: [
          {
            id: "impressionPixels",
            label: "Impression Pixels",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "referencePixels",
            label: "Reference Pixels",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "referenceLength",
            label: "Reference Length",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "enlargementFactor",
            label: "Enlargement Factor",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "imageScale",
            label: "Image Scale",
            valueType: { type: "number" },
          },
          {
            id: "originalLength",
            label: "Original Length",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = photographedFootwearScaleLengthTermTool.execute;
export default photographedFootwearScaleLengthTermTool;
