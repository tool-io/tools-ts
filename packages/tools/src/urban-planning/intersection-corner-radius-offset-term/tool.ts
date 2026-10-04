import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly radius: number; readonly interiorAngle: number };
export type Output = {
  readonly tangentOffset: number;
  readonly centerDistance: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    radius: { type: "number", minimum: 0 },
    interiorAngle: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["radius", "interiorAngle"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    tangentOffset: { type: "number" },
    centerDistance: { type: "number" },
  },
  required: ["tangentOffset", "centerDistance"],
} as const;
/** Circular fillet tangent to two rays enclosing the supplied interior angle. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { radius, interiorAngle } = request;
  const compute = (): Output => {
    H.domain(radius >= 0 && interiorAngle > 0 && interiorAngle < Math.PI);
    return {
      tangentOffset: radius / Math.tan(interiorAngle / 2),
      centerDistance: radius / Math.sin(interiorAngle / 2),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { radius: 5, interiorAngle: 1.5707963267948966 },
  output: {
    tangentOffset: 5.000000000000001,
    centerDistance: 7.0710678118654755,
  },
} satisfies ToolExample<Input, Output>;
export const intersectionCornerRadiusOffsetTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "urban-planning/intersection-corner-radius-offset-term",
    title: "Intersection Corner Radius Offset Term Tool",
    description:
      "Circular fillet tangent to two rays enclosing the supplied interior angle.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        radius: { type: "number", minimum: 0 },
        interiorAngle: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["radius", "interiorAngle"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        tangentOffset: { type: "number" },
        centerDistance: { type: "number" },
      },
      required: ["tangentOffset", "centerDistance"],
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
          id: "interiorAngle",
          label: "Interior Angle",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "tangentOffset",
          label: "Tangent Offset",
          valueType: { type: "number" },
        },
        {
          id: "centerDistance",
          label: "Center Distance",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = intersectionCornerRadiusOffsetTermTool.execute;
export default intersectionCornerRadiusOffsetTermTool;
