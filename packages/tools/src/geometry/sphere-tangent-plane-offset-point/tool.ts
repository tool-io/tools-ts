import {
  defineSchemaCalculation,
  requireInput,
  requireOutput,
  canonicalOutput,
  domain,
  positive,
  dot,
} from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";
export type Input = {
  readonly center: readonly number[];
  readonly surface: readonly number[];
  readonly point: readonly number[];
};
export type Output = { readonly signedDistance: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    center: { type: "array", maxItems: 256, items: { type: "number" } },
    surface: { type: "array", maxItems: 256, items: { type: "number" } },
    point: { type: "array", maxItems: 256, items: { type: "number" } },
  },
  required: ["center", "surface", "point"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { signedDistance: { type: "number" } },
  required: ["signedDistance"],
} as const;
/** Compute sphere tangent plane offset point from explicit bounded inputs. */
export function calculate(input: Input): Output {
  requireInput(input, inputSchema);
  const { center, surface, point } = input;
  const compute = (): Output => {
    domain(center.length === 3 && surface.length === 3 && point.length === 3);
    const n = surface.map((x, i) => x - center[i]),
      r = Math.hypot(...n);
    positive(r);
    return {
      signedDistance:
        dot(
          point.map((x, i) => x - surface[i]),
          n,
        ) / r,
    };
  };
  const output = canonicalOutput(compute());
  requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { center: [0, 0, 0], surface: [2, 0, 0], point: [3, 1, 0] },
  output: { signedDistance: 1 },
} satisfies ToolExample<Input, Output>;
export const sphereTangentPlaneOffsetPointTool = defineSchemaCalculation<
  Input,
  Output
>({
  id: "geometry/sphere-tangent-plane-offset-point",
  title: "Sphere Tangent Plane Offset Point Tool",
  description:
    "Compute sphere tangent plane offset point from explicit bounded inputs.",
  calculate,
  inputSchema,
  outputSchema,
  ports: {
    inputs: [
      {
        id: "center",
        label: "Center",
        required: true,
        valueType: { type: "list", items: { type: "number" } },
      },
      {
        id: "surface",
        label: "Surface",
        required: true,
        valueType: { type: "list", items: { type: "number" } },
      },
      {
        id: "point",
        label: "Point",
        required: true,
        valueType: { type: "list", items: { type: "number" } },
      },
    ],
    outputs: [
      {
        id: "signedDistance",
        label: "Signed Distance",
        valueType: { type: "number" },
      },
    ],
  },
});
export const run = sphereTangentPlaneOffsetPointTool.execute;
export default sphereTangentPlaneOffsetPointTool;
