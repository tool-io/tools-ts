import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";
import { calculate as normalizedDot } from "../../vector/vector-normalized-dot-residual/tool.js";
export type Input = {
  readonly firstAxis: readonly number[];
  readonly secondAxis: readonly number[];
};
export type Output = {
  readonly cosine: number;
  readonly absoluteResidual: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    firstAxis: { type: "array", maxItems: 256, items: { type: "number" } },
    secondAxis: { type: "array", maxItems: 256, items: { type: "number" } },
  },
  required: ["firstAxis", "secondAxis"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    cosine: { type: "number" },
    absoluteResidual: { type: "number" },
  },
  required: ["cosine", "absoluteResidual"],
} as const;
/** Inspect research-axis orthogonality by reusing the portable normalized-dot calculation. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { firstAxis, secondAxis } = request;
  const compute = (): Output => {
    H.domain(firstAxis.length === 3 && secondAxis.length === 3);
    const cosine = normalizedDot({
      first: firstAxis,
      second: secondAxis,
      suppliedCosine: 0,
    }).cosine;
    return { cosine, absoluteResidual: Math.abs(cosine) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { firstAxis: [1, 0, 0], secondAxis: [0, 2, 0] },
  output: { cosine: 0, absoluteResidual: 0 },
} satisfies ToolExample<Input, Output>;
export const anatomicalAxisOrthogonalityResidualTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "anatomy/anatomical-axis-orthogonality-residual",
      title: "Anatomical Axis Orthogonality Residual Tool",
      description:
        "Inspect research-axis orthogonality by reusing the portable normalized-dot calculation.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          firstAxis: {
            type: "array",
            maxItems: 256,
            items: { type: "number" },
          },
          secondAxis: {
            type: "array",
            maxItems: 256,
            items: { type: "number" },
          },
        },
        required: ["firstAxis", "secondAxis"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          cosine: { type: "number" },
          absoluteResidual: { type: "number" },
        },
        required: ["cosine", "absoluteResidual"],
      },
      ports: {
        inputs: [
          {
            id: "firstAxis",
            label: "First Axis",
            required: true,
            valueType: { type: "list", items: { type: "number" } },
          },
          {
            id: "secondAxis",
            label: "Second Axis",
            required: true,
            valueType: { type: "list", items: { type: "number" } },
          },
        ],
        outputs: [
          { id: "cosine", label: "Cosine", valueType: { type: "number" } },
          {
            id: "absoluteResidual",
            label: "Absolute Residual",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = anatomicalAxisOrthogonalityResidualTool.execute;
export default anatomicalAxisOrthogonalityResidualTool;
