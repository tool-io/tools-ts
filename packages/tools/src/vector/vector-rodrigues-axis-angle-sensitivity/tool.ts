import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly vector: readonly number[];
  readonly unitAxis: readonly number[];
  readonly angle: number;
};
export type Output = { readonly derivative: readonly number[] };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    vector: { type: "array", maxItems: 256, items: { type: "number" } },
    unitAxis: { type: "array", maxItems: 256, items: { type: "number" } },
    angle: { type: "number" },
  },
  required: ["vector", "unitAxis", "angle"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    derivative: { type: "array", maxItems: 256, items: { type: "number" } },
  },
  required: ["derivative"],
} as const;
/** Calculate vector rodrigues axis angle sensitivity from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { vector, unitAxis, angle } = request;
  const compute = (): Output => {
    H.domain(
      vector.length === 3 &&
        unitAxis.length === 3 &&
        Math.abs(Math.hypot(...unitAxis) - 1) <= 1e-12,
    );
    const [x, y, z] = unitAxis,
      [a, b, c] = vector,
      dot = H.dot(vector, unitAxis),
      cross = [y * c - z * b, z * a - x * c, x * b - y * a];
    return {
      derivative: vector.map(
        (v, i) =>
          -v * Math.sin(angle) +
          cross[i] * Math.cos(angle) +
          unitAxis[i] * dot * Math.sin(angle),
      ),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { vector: [1, 0, 0], unitAxis: [0, 0, 1], angle: 0 },
  output: { derivative: [0, 1, 0] },
} satisfies ToolExample<Input, Output>;
export const vectorRodriguesAxisAngleSensitivityTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "vector/vector-rodrigues-axis-angle-sensitivity",
      title: "Vector Rodrigues Axis Angle Sensitivity Tool",
      description:
        "Calculate vector rodrigues axis angle sensitivity from explicit caller-supplied inputs.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          vector: { type: "array", maxItems: 256, items: { type: "number" } },
          unitAxis: { type: "array", maxItems: 256, items: { type: "number" } },
          angle: { type: "number" },
        },
        required: ["vector", "unitAxis", "angle"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          derivative: {
            type: "array",
            maxItems: 256,
            items: { type: "number" },
          },
        },
        required: ["derivative"],
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
            id: "unitAxis",
            label: "Unit Axis",
            required: true,
            valueType: { type: "list", items: { type: "number" } },
          },
          {
            id: "angle",
            label: "Angle",
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
export const run = vectorRodriguesAxisAngleSensitivityTool.execute;
export default vectorRodriguesAxisAngleSensitivityTool;
