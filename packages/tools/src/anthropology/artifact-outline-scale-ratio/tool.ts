import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly sourcePerimeter: number;
  readonly targetPerimeter: number;
  readonly sourceArea: number;
  readonly targetArea: number;
};
export type Output = {
  readonly linearRatio: number;
  readonly areaRatio: number;
  readonly similarityResidual: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    sourcePerimeter: { type: "number", exclusiveMinimum: 0 },
    targetPerimeter: { type: "number", minimum: 0 },
    sourceArea: { type: "number", exclusiveMinimum: 0 },
    targetArea: { type: "number", minimum: 0 },
  },
  required: ["sourcePerimeter", "targetPerimeter", "sourceArea", "targetArea"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    linearRatio: { type: "number" },
    areaRatio: { type: "number" },
    similarityResidual: { type: "number" },
  },
  required: ["linearRatio", "areaRatio", "similarityResidual"],
} as const;
/** Compare perimeter and area scaling of explicit outlines against geometric similarity. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { sourcePerimeter, targetPerimeter, sourceArea, targetArea } = request;
  const compute = (): Output => {
    H.positive(sourcePerimeter);
    H.positive(sourceArea);
    H.domain(targetPerimeter >= 0 && targetArea >= 0);
    return {
      linearRatio: targetPerimeter / sourcePerimeter,
      areaRatio: targetArea / sourceArea,
      similarityResidual:
        targetArea / sourceArea - (targetPerimeter / sourcePerimeter) ** 2,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    sourcePerimeter: 10,
    targetPerimeter: 20,
    sourceArea: 6,
    targetArea: 24,
  },
  output: { linearRatio: 2, areaRatio: 4, similarityResidual: 0 },
} satisfies ToolExample<Input, Output>;
export const artifactOutlineScaleRatioTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "anthropology/artifact-outline-scale-ratio",
    title: "Artifact Outline Scale Ratio Tool",
    description:
      "Compare perimeter and area scaling of explicit outlines against geometric similarity.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        sourcePerimeter: { type: "number", exclusiveMinimum: 0 },
        targetPerimeter: { type: "number", minimum: 0 },
        sourceArea: { type: "number", exclusiveMinimum: 0 },
        targetArea: { type: "number", minimum: 0 },
      },
      required: [
        "sourcePerimeter",
        "targetPerimeter",
        "sourceArea",
        "targetArea",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        linearRatio: { type: "number" },
        areaRatio: { type: "number" },
        similarityResidual: { type: "number" },
      },
      required: ["linearRatio", "areaRatio", "similarityResidual"],
    },
    ports: {
      inputs: [
        {
          id: "sourcePerimeter",
          label: "Source Perimeter",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "targetPerimeter",
          label: "Target Perimeter",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "sourceArea",
          label: "Source Area",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "targetArea",
          label: "Target Area",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "linearRatio",
          label: "Linear Ratio",
          valueType: { type: "number" },
        },
        { id: "areaRatio", label: "Area Ratio", valueType: { type: "number" } },
        {
          id: "similarityResidual",
          label: "Similarity Residual",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = artifactOutlineScaleRatioTool.execute;
export default artifactOutlineScaleRatioTool;
