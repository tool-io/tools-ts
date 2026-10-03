import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly cosine: number };
export type Output = {
  readonly absoluteCosine: number;
  readonly squaredProjectionFraction: number;
  readonly orthogonal: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { cosine: { type: "number", minimum: -1, maximum: 1 } },
  required: ["cosine"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    absoluteCosine: { type: "number" },
    squaredProjectionFraction: { type: "number" },
    orthogonal: { type: "boolean" },
  },
  required: ["absoluteCosine", "squaredProjectionFraction", "orthogonal"],
} as const;
/** Inspect a supplied normalized dot product’s deviation from orthogonality; no vectors are inferred. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { cosine } = request;
  const compute = (): Output => {
    H.domain(cosine >= -1 && cosine <= 1);
    return {
      absoluteCosine: Math.abs(cosine),
      squaredProjectionFraction: cosine * cosine,
      orthogonal: cosine === 0,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { cosine: 0.6 },
  output: {
    absoluteCosine: 0.6,
    squaredProjectionFraction: 0.36,
    orthogonal: false,
  },
} satisfies ToolExample<Input, Output>;
export const cosineOrthogonalResidualTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "similarity/cosine-orthogonal-residual",
    title: "Cosine Orthogonal Residual Tool",
    description:
      "Inspect a supplied normalized dot product’s deviation from orthogonality; no vectors are inferred.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { cosine: { type: "number", minimum: -1, maximum: 1 } },
      required: ["cosine"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        absoluteCosine: { type: "number" },
        squaredProjectionFraction: { type: "number" },
        orthogonal: { type: "boolean" },
      },
      required: ["absoluteCosine", "squaredProjectionFraction", "orthogonal"],
    },
    ports: {
      inputs: [
        {
          id: "cosine",
          label: "Cosine",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "absoluteCosine",
          label: "Absolute Cosine",
          valueType: { type: "number" },
        },
        {
          id: "squaredProjectionFraction",
          label: "Squared Projection Fraction",
          valueType: { type: "number" },
        },
        {
          id: "orthogonal",
          label: "Orthogonal",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = cosineOrthogonalResidualTool.execute;
export default cosineOrthogonalResidualTool;
