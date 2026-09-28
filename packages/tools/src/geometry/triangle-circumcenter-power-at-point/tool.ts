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
  readonly center: readonly number[];
  readonly radius: number;
};
export type Output = { readonly power: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    point: { type: "array", maxItems: 256, items: { type: "number" } },
    center: { type: "array", maxItems: 256, items: { type: "number" } },
    radius: { type: "number" },
  },
  required: ["point", "center", "radius"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { power: { type: "number" } },
  required: ["power"],
} as const;
/** Compute triangle circumcenter power at point from explicit bounded inputs. */
export function calculate(input: Input): Output {
  requireInput(input, inputSchema);
  const { point, center, radius } = input;
  const compute = (): Output => {
    domain(point.length === 2 && center.length === 2 && radius >= 0);
    return {
      power:
        (point[0] - center[0]) ** 2 + (point[1] - center[1]) ** 2 - radius ** 2,
    };
  };
  const output = canonicalOutput(compute());
  requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { point: [3, 4], center: [0, 0], radius: 3 },
  output: { power: 16 },
} satisfies ToolExample<Input, Output>;
export const triangleCircumcenterPowerAtPointTool = defineSchemaCalculation<
  Input,
  Output
>({
  id: "geometry/triangle-circumcenter-power-at-point",
  title: "Triangle Circumcenter Power At Point Tool",
  description:
    "Compute triangle circumcenter power at point from explicit bounded inputs.",
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
        id: "center",
        label: "Center",
        required: true,
        valueType: { type: "list", items: { type: "number" } },
      },
      {
        id: "radius",
        label: "Radius",
        required: true,
        valueType: { type: "number" },
      },
    ],
    outputs: [{ id: "power", label: "Power", valueType: { type: "number" } }],
  },
});
export const run = triangleCircumcenterPowerAtPointTool.execute;
export default triangleCircumcenterPowerAtPointTool;
