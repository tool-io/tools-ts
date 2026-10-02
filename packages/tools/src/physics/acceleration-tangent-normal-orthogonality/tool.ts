import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly tangent: readonly number[];
  readonly normal: readonly number[];
  readonly tolerance: number;
};
export type Output = { readonly dot: number; readonly orthogonal: boolean };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    tangent: { type: "array", maxItems: 256, items: { type: "number" } },
    normal: { type: "array", maxItems: 256, items: { type: "number" } },
    tolerance: { type: "number", minimum: 0 },
  },
  required: ["tangent", "normal", "tolerance"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { dot: { type: "number" }, orthogonal: { type: "boolean" } },
  required: ["dot", "orthogonal"],
} as const;
/** Check a supplied tangent/normal acceleration decomposition using an explicit absolute dot-product tolerance. */
export function calculate(input: Input): Output {
  H.requireInput(input, inputSchema);
  const { tangent, normal, tolerance } = input;
  const compute = (): Output => {
    H.sameLength(tangent, normal);
    H.domain(tangent.length > 0 && tolerance >= 0);
    const dot = H.dot(tangent, normal);
    return { dot, orthogonal: Math.abs(dot) <= tolerance };
  };
  const output = H.canonicalOutput(compute());
  H.requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { tangent: [1, 0], normal: [0, 2], tolerance: 0 },
  output: { dot: 0, orthogonal: true },
} satisfies ToolExample<Input, Output>;
export const accelerationTangentNormalOrthogonalityTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "physics/acceleration-tangent-normal-orthogonality",
      title: "Acceleration Tangent Normal Orthogonality Tool",
      description:
        "Check a supplied tangent/normal acceleration decomposition using an explicit absolute dot-product tolerance.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          tangent: { type: "array", maxItems: 256, items: { type: "number" } },
          normal: { type: "array", maxItems: 256, items: { type: "number" } },
          tolerance: { type: "number", minimum: 0 },
        },
        required: ["tangent", "normal", "tolerance"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          dot: { type: "number" },
          orthogonal: { type: "boolean" },
        },
        required: ["dot", "orthogonal"],
      },
      ports: {
        inputs: [
          {
            id: "tangent",
            label: "Tangent",
            required: true,
            valueType: { type: "list", items: { type: "number" } },
          },
          {
            id: "normal",
            label: "Normal",
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
          { id: "dot", label: "Dot", valueType: { type: "number" } },
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
export const run = accelerationTangentNormalOrthogonalityTool.execute;
export default accelerationTangentNormalOrthogonalityTool;
