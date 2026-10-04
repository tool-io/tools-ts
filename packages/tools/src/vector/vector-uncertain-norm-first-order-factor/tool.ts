import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly vector: readonly number[];
  readonly standardDeviations: readonly number[];
};
export type Output = {
  readonly norm: number;
  readonly standardUncertainty: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    vector: { type: "array", maxItems: 256, items: { type: "number" } },
    standardDeviations: {
      type: "array",
      maxItems: 256,
      items: { type: "number" },
    },
  },
  required: ["vector", "standardDeviations"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    norm: { type: "number" },
    standardUncertainty: { type: "number" },
  },
  required: ["norm", "standardUncertainty"],
} as const;
/** First-order norm uncertainty for independent supplied component errors; excludes the nondifferentiable zero vector. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { vector, standardDeviations } = request;
  const compute = (): Output => {
    H.sameLength(vector, standardDeviations);
    H.domain(
      vector.some((x) => x !== 0) && standardDeviations.every((x) => x >= 0),
    );
    return {
      norm: Math.hypot(...vector),
      standardUncertainty: Math.hypot(
        ...vector.map(
          (x, i) => (x / Math.hypot(...vector)) * standardDeviations[i],
        ),
      ),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { vector: [3, 4], standardDeviations: [1, 1] },
  output: { norm: 5, standardUncertainty: 1 },
} satisfies ToolExample<Input, Output>;
export const vectorUncertainNormFirstOrderFactorTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "vector/vector-uncertain-norm-first-order-factor",
      title: "Vector Uncertain Norm First Order Factor Tool",
      description:
        "First-order norm uncertainty for independent supplied component errors; excludes the nondifferentiable zero vector.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          vector: { type: "array", maxItems: 256, items: { type: "number" } },
          standardDeviations: {
            type: "array",
            maxItems: 256,
            items: { type: "number" },
          },
        },
        required: ["vector", "standardDeviations"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          norm: { type: "number" },
          standardUncertainty: { type: "number" },
        },
        required: ["norm", "standardUncertainty"],
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
            id: "standardDeviations",
            label: "Standard Deviations",
            required: true,
            valueType: { type: "list", items: { type: "number" } },
          },
        ],
        outputs: [
          { id: "norm", label: "Norm", valueType: { type: "number" } },
          {
            id: "standardUncertainty",
            label: "Standard Uncertainty",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = vectorUncertainNormFirstOrderFactorTool.execute;
export default vectorUncertainNormFirstOrderFactorTool;
