import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";
import { calculate as normalizedDot } from "../../vector/vector-normalized-dot-residual/tool.js";
export type Input = {
  readonly vector: readonly number[];
  readonly planeNormal: readonly number[];
};
export type Output = {
  readonly normalCosine: number;
  readonly absoluteParallelResidual: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    vector: { type: "array", maxItems: 256, items: { type: "number" } },
    planeNormal: { type: "array", maxItems: 256, items: { type: "number" } },
  },
  required: ["vector", "planeNormal"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    normalCosine: { type: "number" },
    absoluteParallelResidual: { type: "number" },
  },
  required: ["normalCosine", "absoluteParallelResidual"],
} as const;
/** Measure deviation from perpendicularity to a plane by reusing normalized-dot arithmetic on its supplied normal. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { vector, planeNormal } = request;
  const compute = (): Output => {
    H.domain(vector.length === 3 && planeNormal.length === 3);
    H.domain(
      vector.some((x) => x !== 0),
      "vector",
      "Provide a nonzero vector.",
    );
    H.domain(
      planeNormal.some((x) => x !== 0),
      "planeNormal",
      "Provide a nonzero plane normal.",
    );
    const normalCosine = normalizedDot({
      first: vector,
      second: planeNormal,
      suppliedCosine: 0,
    }).cosine;
    return {
      normalCosine,
      absoluteParallelResidual: Math.max(0, 1 - Math.abs(normalCosine)),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { vector: [1, 0, 0], planeNormal: [2, 0, 0] },
  output: { normalCosine: 1, absoluteParallelResidual: 0 },
} satisfies ToolExample<Input, Output>;
export const vectorPlaneOrthogonalityGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "vector/vector-plane-orthogonality-gap",
    title: "Vector Plane Orthogonality Gap Tool",
    description:
      "Measure deviation from perpendicularity to a plane by reusing normalized-dot arithmetic on its supplied normal.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        vector: { type: "array", maxItems: 256, items: { type: "number" } },
        planeNormal: {
          type: "array",
          maxItems: 256,
          items: { type: "number" },
        },
      },
      required: ["vector", "planeNormal"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        normalCosine: { type: "number" },
        absoluteParallelResidual: { type: "number" },
      },
      required: ["normalCosine", "absoluteParallelResidual"],
    },
    ports: {
      inputs: [
        {
          id: "vector",
          label: "Vector",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
        {
          id: "planeNormal",
          label: "Plane Normal",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
      ],
      outputs: [
        {
          id: "normalCosine",
          label: "Normal Cosine",
          valueType: { type: "number" },
        },
        {
          id: "absoluteParallelResidual",
          label: "Absolute Parallel Residual",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = vectorPlaneOrthogonalityGapTool.execute;
export default vectorPlaneOrthogonalityGapTool;
