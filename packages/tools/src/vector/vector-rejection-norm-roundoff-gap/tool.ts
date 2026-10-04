import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly squaredNorm: number;
  readonly squaredProjection: number;
  readonly tolerance: number;
};
export type Output = {
  readonly squaredRejection: number;
  readonly raw: number;
  readonly clamped: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    squaredNorm: { type: "number", minimum: 0 },
    squaredProjection: { type: "number", minimum: 0 },
    tolerance: { type: "number", minimum: 0 },
  },
  required: ["squaredNorm", "squaredProjection", "tolerance"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    squaredRejection: { type: "number" },
    raw: { type: "number" },
    clamped: { type: "boolean" },
  },
  required: ["squaredRejection", "raw", "clamped"],
} as const;
/** Calculate vector rejection norm roundoff gap from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { squaredNorm, squaredProjection, tolerance } = request;
  const compute = (): Output => {
    H.domain(squaredNorm >= 0 && squaredProjection >= 0 && tolerance >= 0);
    const raw = squaredNorm - squaredProjection;
    H.domain(raw >= -tolerance);
    return { squaredRejection: Math.max(0, raw), raw, clamped: raw < 0 };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { squaredNorm: 25, squaredProjection: 9, tolerance: 0 },
  output: { squaredRejection: 16, raw: 16, clamped: false },
} satisfies ToolExample<Input, Output>;
export const vectorRejectionNormRoundoffGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "vector/vector-rejection-norm-roundoff-gap",
    title: "Vector Rejection Norm Roundoff Gap Tool",
    description:
      "Calculate vector rejection norm roundoff gap from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        squaredNorm: { type: "number", minimum: 0 },
        squaredProjection: { type: "number", minimum: 0 },
        tolerance: { type: "number", minimum: 0 },
      },
      required: ["squaredNorm", "squaredProjection", "tolerance"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        squaredRejection: { type: "number" },
        raw: { type: "number" },
        clamped: { type: "boolean" },
      },
      required: ["squaredRejection", "raw", "clamped"],
    },
    ports: {
      inputs: [
        {
          id: "squaredNorm",
          label: "Squared Norm",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "squaredProjection",
          label: "Squared Projection",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "tolerance",
          label: "Tolerance",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "squaredRejection",
          label: "Squared Rejection",
          valueType: { type: "number" },
        },
        { id: "raw", label: "Raw", valueType: { type: "number" } },
        { id: "clamped", label: "Clamped", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = vectorRejectionNormRoundoffGapTool.execute;
export default vectorRejectionNormRoundoffGapTool;
