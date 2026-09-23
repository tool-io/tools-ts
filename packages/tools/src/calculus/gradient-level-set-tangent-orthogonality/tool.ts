import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly gradient: readonly number[];
  readonly direction: readonly number[];
  readonly tolerance: number;
};
export type Output = {
  readonly dotProduct: number;
  readonly withinTolerance: boolean;
  readonly regularLevel: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    gradient: { type: "array", maxItems: 256, items: { type: "number" } },
    direction: { type: "array", maxItems: 256, items: { type: "number" } },
    tolerance: { type: "number", minimum: 0 },
  },
  required: ["gradient", "direction", "tolerance"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    dotProduct: { type: "number" },
    withinTolerance: { type: "boolean" },
    regularLevel: { type: "boolean" },
  },
  required: ["dotProduct", "withinTolerance", "regularLevel"],
} as const;
/** Unnormalized supplied dot-product tolerance, with a separate regular-level flag. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { gradient, direction, tolerance } = request;
  const compute = (): Output => {
    H.sameLength(gradient, direction);
    H.domain(gradient.length > 0 && tolerance >= 0);
    return {
      dotProduct: H.dot(gradient, direction),
      withinTolerance: Math.abs(H.dot(gradient, direction)) <= tolerance,
      regularLevel: gradient.some((x) => x !== 0),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { gradient: [2, 3], direction: [3, -2], tolerance: 0 },
  output: { dotProduct: 0, withinTolerance: true, regularLevel: true },
} satisfies ToolExample<Input, Output>;
export const gradientLevelSetTangentOrthogonalityTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "calculus/gradient-level-set-tangent-orthogonality",
      title: "Gradient Level Set Tangent Orthogonality Tool",
      description:
        "Unnormalized supplied dot-product tolerance, with a separate regular-level flag.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          gradient: { type: "array", maxItems: 256, items: { type: "number" } },
          direction: {
            type: "array",
            maxItems: 256,
            items: { type: "number" },
          },
          tolerance: { type: "number", minimum: 0 },
        },
        required: ["gradient", "direction", "tolerance"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          dotProduct: { type: "number" },
          withinTolerance: { type: "boolean" },
          regularLevel: { type: "boolean" },
        },
        required: ["dotProduct", "withinTolerance", "regularLevel"],
      },
      ports: {
        inputs: [
          {
            id: "gradient",
            label: "Gradient",
            required: true,
            valueType: { type: "list", items: { type: "number" } },
          },
          {
            id: "direction",
            label: "Direction",
            required: true,
            valueType: { type: "list", items: { type: "number" } },
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
            id: "dotProduct",
            label: "Dot Product",
            valueType: { type: "number" },
          },
          {
            id: "withinTolerance",
            label: "Within Tolerance",
            valueType: { type: "boolean" },
          },
          {
            id: "regularLevel",
            label: "Regular Level",
            valueType: { type: "boolean" },
          },
        ],
      },
    },
    calculate,
  });
export const run = gradientLevelSetTangentOrthogonalityTool.execute;
export default gradientLevelSetTangentOrthogonalityTool;
