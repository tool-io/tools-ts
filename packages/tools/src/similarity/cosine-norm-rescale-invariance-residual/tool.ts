import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly dot: number;
  readonly firstNorm: number;
  readonly secondNorm: number;
  readonly firstScale: number;
  readonly secondScale: number;
};
export type Output = {
  readonly cosine: number;
  readonly scaledCosine: number;
  readonly residual: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    dot: { type: "number" },
    firstNorm: { type: "number", exclusiveMinimum: 0 },
    secondNorm: { type: "number", exclusiveMinimum: 0 },
    firstScale: { type: "number" },
    secondScale: { type: "number" },
  },
  required: ["dot", "firstNorm", "secondNorm", "firstScale", "secondScale"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    cosine: { type: "number" },
    scaledCosine: { type: "number" },
    residual: { type: "number" },
  },
  required: ["cosine", "scaledCosine", "residual"],
} as const;
/** Calculate cosine norm rescale invariance residual from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { dot, firstNorm, secondNorm, firstScale, secondScale } = request;
  const compute = (): Output => {
    H.positive(firstNorm);
    H.positive(secondNorm);
    H.domain(
      firstScale !== 0 &&
        secondScale !== 0 &&
        Math.abs(dot) <= firstNorm * secondNorm,
    );
    const cosine = dot / (firstNorm * secondNorm),
      scaledCosine = Math.sign(firstScale * secondScale) * cosine;
    return { cosine, scaledCosine, residual: scaledCosine - cosine };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { dot: 3, firstNorm: 3, secondNorm: 2, firstScale: 2, secondScale: 4 },
  output: { cosine: 0.5, scaledCosine: 0.5, residual: 0 },
} satisfies ToolExample<Input, Output>;
export const cosineNormRescaleInvarianceResidualTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "similarity/cosine-norm-rescale-invariance-residual",
      title: "Cosine Norm Rescale Invariance Residual Tool",
      description:
        "Calculate cosine norm rescale invariance residual from explicit caller-supplied inputs.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          dot: { type: "number" },
          firstNorm: { type: "number", exclusiveMinimum: 0 },
          secondNorm: { type: "number", exclusiveMinimum: 0 },
          firstScale: { type: "number" },
          secondScale: { type: "number" },
        },
        required: [
          "dot",
          "firstNorm",
          "secondNorm",
          "firstScale",
          "secondScale",
        ],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          cosine: { type: "number" },
          scaledCosine: { type: "number" },
          residual: { type: "number" },
        },
        required: ["cosine", "scaledCosine", "residual"],
      },
      ports: {
        inputs: [
          {
            id: "dot",
            label: "Dot",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "firstNorm",
            label: "First Norm",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "secondNorm",
            label: "Second Norm",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "firstScale",
            label: "First Scale",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "secondScale",
            label: "Second Scale",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          { id: "cosine", label: "Cosine", valueType: { type: "number" } },
          {
            id: "scaledCosine",
            label: "Scaled Cosine",
            valueType: { type: "number" },
          },
          { id: "residual", label: "Residual", valueType: { type: "number" } },
        ],
      },
    },
    calculate,
  });
export const run = cosineNormRescaleInvarianceResidualTool.execute;
export default cosineNormRescaleInvarianceResidualTool;
