import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly steps: readonly number[] };
export type Output = {
  readonly coordinateBounds: readonly number[];
  readonly euclideanBound: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    steps: { type: "array", maxItems: 256, items: { type: "number" } },
  },
  required: ["steps"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    coordinateBounds: {
      type: "array",
      maxItems: 256,
      items: { type: "number" },
    },
    euclideanBound: { type: "number" },
  },
  required: ["coordinateBounds", "euclideanBound"],
} as const;
/** Calculate vector component quantization error bound from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { steps } = request;
  const compute = (): Output => {
    H.domain(steps.every((x) => x >= 0));
    const coordinateBounds = steps.map((x) => x / 2);
    return {
      coordinateBounds,
      euclideanBound: Math.hypot(...coordinateBounds),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { steps: [6, 8] },
  output: { coordinateBounds: [3, 4], euclideanBound: 5 },
} satisfies ToolExample<Input, Output>;
export const vectorComponentQuantizationErrorBoundTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "vector/vector-component-quantization-error-bound",
      title: "Vector Component Quantization Error Bound Tool",
      description:
        "Calculate vector component quantization error bound from explicit caller-supplied inputs.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          steps: { type: "array", maxItems: 256, items: { type: "number" } },
        },
        required: ["steps"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          coordinateBounds: {
            type: "array",
            maxItems: 256,
            items: { type: "number" },
          },
          euclideanBound: { type: "number" },
        },
        required: ["coordinateBounds", "euclideanBound"],
      },
      ports: {
        inputs: [
          {
            id: "steps",
            label: "Steps",
            required: true,
            valueType: { type: "list", items: { type: "number" } },
          },
        ],
        outputs: [
          {
            id: "coordinateBounds",
            label: "Coordinate Bounds",
            valueType: { type: "list", items: { type: "number" } },
          },
          {
            id: "euclideanBound",
            label: "Euclidean Bound",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = vectorComponentQuantizationErrorBoundTool.execute;
export default vectorComponentQuantizationErrorBoundTool;
