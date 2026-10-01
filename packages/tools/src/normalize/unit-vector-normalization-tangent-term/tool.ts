import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly unitVector: readonly number[];
  readonly perturbation: readonly number[];
  readonly norm: number;
};
export type Output = { readonly derivative: readonly number[] };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    unitVector: { type: "array", maxItems: 256, items: { type: "number" } },
    perturbation: { type: "array", maxItems: 256, items: { type: "number" } },
    norm: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["unitVector", "perturbation", "norm"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    derivative: { type: "array", maxItems: 256, items: { type: "number" } },
  },
  required: ["derivative"],
} as const;
/** Calculate unit vector normalization tangent term from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { unitVector, perturbation, norm } = request;
  const compute = (): Output => {
    H.sameLength(unitVector, perturbation);
    H.domain(Math.abs(Math.hypot(...unitVector) - 1) <= 1e-12);
    H.positive(norm);
    const axial = H.dot(unitVector, perturbation);
    return {
      derivative: perturbation.map(
        (x, i) => (x - unitVector[i] * axial) / norm,
      ),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { unitVector: [1, 0], perturbation: [2, 3], norm: 2 },
  output: { derivative: [0, 1.5] },
} satisfies ToolExample<Input, Output>;
export const unitVectorNormalizationTangentTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "normalize/unit-vector-normalization-tangent-term",
    title: "Unit Vector Normalization Tangent Term Tool",
    description:
      "Calculate unit vector normalization tangent term from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        unitVector: { type: "array", maxItems: 256, items: { type: "number" } },
        perturbation: {
          type: "array",
          maxItems: 256,
          items: { type: "number" },
        },
        norm: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["unitVector", "perturbation", "norm"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        derivative: { type: "array", maxItems: 256, items: { type: "number" } },
      },
      required: ["derivative"],
    },
    ports: {
      inputs: [
        {
          id: "unitVector",
          label: "Unit Vector",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
        {
          id: "perturbation",
          label: "Perturbation",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
        {
          id: "norm",
          label: "Norm",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "derivative",
          label: "Derivative",
          valueType: { type: "list", items: { type: "number" } },
        },
      ],
    },
  },
  calculate,
});
export const run = unitVectorNormalizationTangentTermTool.execute;
export default unitVectorNormalizationTangentTermTool;
