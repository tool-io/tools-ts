import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly radius: number;
  readonly latitudeRadians: number;
};
export type Output = { readonly z: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    radius: { type: "number", minimum: 0 },
    latitudeRadians: { type: "number" },
  },
  required: ["radius", "latitudeRadians"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { z: { type: "number" } },
  required: ["z"],
} as const;
/** Calculate geocentric axis z component sphere from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { radius, latitudeRadians } = request;
  const compute = (): Output => {
    H.domain(radius >= 0 && Math.abs(latitudeRadians) <= Math.PI / 2);
    return { z: radius * Math.sin(latitudeRadians) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { radius: 5, latitudeRadians: 1.5707963267948966 },
  output: { z: 5 },
} satisfies ToolExample<Input, Output>;
export const geocentricAxisZComponentSphereTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "geography/geocentric-axis-z-component-sphere",
    title: "Geocentric Axis Z Component Sphere Tool",
    description:
      "Calculate geocentric axis z component sphere from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        radius: { type: "number", minimum: 0 },
        latitudeRadians: { type: "number" },
      },
      required: ["radius", "latitudeRadians"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { z: { type: "number" } },
      required: ["z"],
    },
    ports: {
      inputs: [
        {
          id: "radius",
          label: "Radius",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "latitudeRadians",
          label: "Latitude Radians",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [{ id: "z", label: "Z", valueType: { type: "number" } }],
    },
  },
  calculate,
});
export const run = geocentricAxisZComponentSphereTool.execute;
export default geocentricAxisZComponentSphereTool;
