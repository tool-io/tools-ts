import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly objectPixels: number;
  readonly rulerPixels: number;
  readonly rulerLength: number;
  readonly objectDepth: number;
  readonly rulerDepth: number;
};
export type Output = {
  readonly uncorrectedLength: number;
  readonly correctedLength: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    objectPixels: { type: "number", minimum: 0 },
    rulerPixels: { type: "number", exclusiveMinimum: 0 },
    rulerLength: { type: "number", exclusiveMinimum: 0 },
    objectDepth: { type: "number", exclusiveMinimum: 0 },
    rulerDepth: { type: "number", exclusiveMinimum: 0 },
  },
  required: [
    "objectPixels",
    "rulerPixels",
    "rulerLength",
    "objectDepth",
    "rulerDepth",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    uncorrectedLength: { type: "number" },
    correctedLength: { type: "number" },
  },
  required: ["uncorrectedLength", "correctedLength"],
} as const;
/** Pinhole parallel-plane perspective scale correction using camera distances; arbitrary camera poses and lens distortion are not solved. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { objectPixels, rulerPixels, rulerLength, objectDepth, rulerDepth } =
    request;
  const compute = (): Output => {
    H.domain(objectPixels >= 0);
    H.positive(rulerPixels);
    H.positive(rulerLength);
    H.positive(objectDepth);
    H.positive(rulerDepth);
    return {
      uncorrectedLength: (objectPixels * rulerLength) / rulerPixels,
      correctedLength:
        (objectPixels * rulerLength * objectDepth) / (rulerPixels * rulerDepth),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    objectPixels: 100,
    rulerPixels: 50,
    rulerLength: 10,
    objectDepth: 2,
    rulerDepth: 1,
  },
  output: { uncorrectedLength: 20, correctedLength: 40 },
} satisfies ToolExample<Input, Output>;
export const evidenceScalePerspectiveLengthFactorTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "forensic-science/evidence-scale-perspective-length-factor",
      title: "Evidence Scale Perspective Length Factor Tool",
      description:
        "Pinhole parallel-plane perspective scale correction using camera distances; arbitrary camera poses and lens distortion are not solved.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          objectPixels: { type: "number", minimum: 0 },
          rulerPixels: { type: "number", exclusiveMinimum: 0 },
          rulerLength: { type: "number", exclusiveMinimum: 0 },
          objectDepth: { type: "number", exclusiveMinimum: 0 },
          rulerDepth: { type: "number", exclusiveMinimum: 0 },
        },
        required: [
          "objectPixels",
          "rulerPixels",
          "rulerLength",
          "objectDepth",
          "rulerDepth",
        ],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          uncorrectedLength: { type: "number" },
          correctedLength: { type: "number" },
        },
        required: ["uncorrectedLength", "correctedLength"],
      },
      ports: {
        inputs: [
          {
            id: "objectPixels",
            label: "Object Pixels",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "rulerPixels",
            label: "Ruler Pixels",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "rulerLength",
            label: "Ruler Length",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "objectDepth",
            label: "Object Depth",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "rulerDepth",
            label: "Ruler Depth",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "uncorrectedLength",
            label: "Uncorrected Length",
            valueType: { type: "number" },
          },
          {
            id: "correctedLength",
            label: "Corrected Length",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = evidenceScalePerspectiveLengthFactorTool.execute;
export default evidenceScalePerspectiveLengthFactorTool;
