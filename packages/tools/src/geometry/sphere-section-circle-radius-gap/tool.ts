import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly sphereRadius: number;
  readonly planeOffset: number;
};
export type Output = { readonly radius: number; readonly tangent: boolean };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    sphereRadius: { type: "number", minimum: 0 },
    planeOffset: { type: "number" },
  },
  required: ["sphereRadius", "planeOffset"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { radius: { type: "number" }, tangent: { type: "boolean" } },
  required: ["radius", "tangent"],
} as const;
/** Calculate sphere section circle radius gap from explicit caller-supplied inputs. */
export function calculate(input: Input): Output {
  H.requireInput(input, inputSchema);
  const { sphereRadius, planeOffset } = input;
  const compute = (): Output => {
    H.domain(sphereRadius >= 0 && Math.abs(planeOffset) <= sphereRadius);
    return {
      radius: Math.sqrt(
        (sphereRadius - planeOffset) * (sphereRadius + planeOffset),
      ),
      tangent: Math.abs(planeOffset) === sphereRadius,
    };
  };
  const output = H.canonicalOutput(compute());
  H.requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { sphereRadius: 5, planeOffset: 3 },
  output: { radius: 4, tangent: false },
} satisfies ToolExample<Input, Output>;
export const sphereSectionCircleRadiusGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "geometry/sphere-section-circle-radius-gap",
    title: "Sphere Section Circle Radius Gap Tool",
    description:
      "Calculate sphere section circle radius gap from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        sphereRadius: { type: "number", minimum: 0 },
        planeOffset: { type: "number" },
      },
      required: ["sphereRadius", "planeOffset"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { radius: { type: "number" }, tangent: { type: "boolean" } },
      required: ["radius", "tangent"],
    },
    ports: {
      inputs: [
        {
          id: "sphereRadius",
          label: "Sphere Radius",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "planeOffset",
          label: "Plane Offset",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "radius", label: "Radius", valueType: { type: "number" } },
        { id: "tangent", label: "Tangent", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = sphereSectionCircleRadiusGapTool.execute;
export default sphereSectionCircleRadiusGapTool;
