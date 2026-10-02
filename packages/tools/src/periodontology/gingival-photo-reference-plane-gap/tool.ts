import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly measuredDistance: number;
  readonly referenceScale: number;
  readonly suppliedPlaneFactor: number;
  readonly comparisonDistance: number;
};
export type Output = { readonly planeDistance: number; readonly gap: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    measuredDistance: { type: "number", minimum: 0 },
    referenceScale: { type: "number", exclusiveMinimum: 0 },
    suppliedPlaneFactor: { type: "number", exclusiveMinimum: 0 },
    comparisonDistance: { type: "number", minimum: 0 },
  },
  required: [
    "measuredDistance",
    "referenceScale",
    "suppliedPlaneFactor",
    "comparisonDistance",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { planeDistance: { type: "number" }, gap: { type: "number" } },
  required: ["planeDistance", "gap"],
} as const;
/** Apply explicit image and plane correction factors without deriving geometry or tissue findings from a photograph. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const {
    measuredDistance,
    referenceScale,
    suppliedPlaneFactor,
    comparisonDistance,
  } = request;
  const compute = (): Output => {
    H.domain(measuredDistance >= 0 && comparisonDistance >= 0);
    H.positive(referenceScale);
    H.positive(suppliedPlaneFactor);
    return {
      planeDistance: measuredDistance * referenceScale * suppliedPlaneFactor,
      gap:
        measuredDistance * referenceScale * suppliedPlaneFactor -
        comparisonDistance,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    measuredDistance: 20,
    referenceScale: 0.5,
    suppliedPlaneFactor: 0.8,
    comparisonDistance: 7,
  },
  output: { planeDistance: 8, gap: 1 },
} satisfies ToolExample<Input, Output>;
export const gingivalPhotoReferencePlaneGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "periodontology/gingival-photo-reference-plane-gap",
    title: "Gingival Photo Reference Plane Gap Tool",
    description:
      "Apply explicit image and plane correction factors without deriving geometry or tissue findings from a photograph.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        measuredDistance: { type: "number", minimum: 0 },
        referenceScale: { type: "number", exclusiveMinimum: 0 },
        suppliedPlaneFactor: { type: "number", exclusiveMinimum: 0 },
        comparisonDistance: { type: "number", minimum: 0 },
      },
      required: [
        "measuredDistance",
        "referenceScale",
        "suppliedPlaneFactor",
        "comparisonDistance",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        planeDistance: { type: "number" },
        gap: { type: "number" },
      },
      required: ["planeDistance", "gap"],
    },
    ports: {
      inputs: [
        {
          id: "measuredDistance",
          label: "Measured Distance",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "referenceScale",
          label: "Reference Scale",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "suppliedPlaneFactor",
          label: "Supplied Plane Factor",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "comparisonDistance",
          label: "Comparison Distance",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "planeDistance",
          label: "Plane Distance",
          valueType: { type: "number" },
        },
        { id: "gap", label: "Gap", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = gingivalPhotoReferencePlaneGapTool.execute;
export default gingivalPhotoReferencePlaneGapTool;
