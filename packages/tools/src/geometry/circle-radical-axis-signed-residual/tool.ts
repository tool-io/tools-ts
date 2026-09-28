import {
  defineSchemaCalculation,
  requireInput,
  requireOutput,
  canonicalOutput,
  domain,
} from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";
export type Input = {
  readonly point: readonly number[];
  readonly leftCenter: readonly number[];
  readonly rightCenter: readonly number[];
  readonly leftRadius: number;
  readonly rightRadius: number;
};
export type Output = { readonly residual: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    point: { type: "array", maxItems: 256, items: { type: "number" } },
    leftCenter: { type: "array", maxItems: 256, items: { type: "number" } },
    rightCenter: { type: "array", maxItems: 256, items: { type: "number" } },
    leftRadius: { type: "number" },
    rightRadius: { type: "number" },
  },
  required: ["point", "leftCenter", "rightCenter", "leftRadius", "rightRadius"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { residual: { type: "number" } },
  required: ["residual"],
} as const;
/** Compute circle radical axis signed residual from explicit bounded inputs. */
export function calculate(input: Input): Output {
  requireInput(input, inputSchema);
  const { point, leftCenter, rightCenter, leftRadius, rightRadius } = input;
  const compute = (): Output => {
    domain(
      point.length === 2 &&
        leftCenter.length === 2 &&
        rightCenter.length === 2 &&
        leftRadius >= 0 &&
        rightRadius >= 0,
    );
    const power = (c: readonly number[], r: number) =>
      (point[0] - c[0]) ** 2 + (point[1] - c[1]) ** 2 - r * r;
    return {
      residual: power(leftCenter, leftRadius) - power(rightCenter, rightRadius),
    };
  };
  const output = canonicalOutput(compute());
  requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: {
    point: [1, 0],
    leftCenter: [0, 0],
    rightCenter: [2, 0],
    leftRadius: 1,
    rightRadius: 1,
  },
  output: { residual: 0 },
} satisfies ToolExample<Input, Output>;
export const circleRadicalAxisSignedResidualTool = defineSchemaCalculation<
  Input,
  Output
>({
  id: "geometry/circle-radical-axis-signed-residual",
  title: "Circle Radical Axis Signed Residual Tool",
  description:
    "Compute circle radical axis signed residual from explicit bounded inputs.",
  calculate,
  inputSchema,
  outputSchema,
  ports: {
    inputs: [
      {
        id: "point",
        label: "Point",
        required: true,
        valueType: { type: "list", items: { type: "number" } },
      },
      {
        id: "leftCenter",
        label: "Left Center",
        required: true,
        valueType: { type: "list", items: { type: "number" } },
      },
      {
        id: "rightCenter",
        label: "Right Center",
        required: true,
        valueType: { type: "list", items: { type: "number" } },
      },
      {
        id: "leftRadius",
        label: "Left Radius",
        required: true,
        valueType: { type: "number" },
      },
      {
        id: "rightRadius",
        label: "Right Radius",
        required: true,
        valueType: { type: "number" },
      },
    ],
    outputs: [
      { id: "residual", label: "Residual", valueType: { type: "number" } },
    ],
  },
});
export const run = circleRadicalAxisSignedResidualTool.execute;
export default circleRadicalAxisSignedResidualTool;
