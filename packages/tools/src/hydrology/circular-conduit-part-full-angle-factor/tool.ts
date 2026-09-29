import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly radius: number;
  readonly filledAngleRadians: number;
};
export type Output = {
  readonly area: number;
  readonly wettedPerimeter: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    radius: { type: "number", exclusiveMinimum: 0 },
    filledAngleRadians: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["radius", "filledAngleRadians"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { area: { type: "number" }, wettedPerimeter: { type: "number" } },
  required: ["area", "wettedPerimeter"],
} as const;
/** Use the central angle of the wetted circular segment in radians. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { radius, filledAngleRadians } = request;
  const compute = (): Output => {
    H.positive(radius);
    H.domain(filledAngleRadians > 0 && filledAngleRadians <= 2 * Math.PI);
    return {
      area:
        (radius *
          radius *
          (filledAngleRadians - Math.sin(filledAngleRadians))) /
        2,
      wettedPerimeter: radius * filledAngleRadians,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { radius: 2, filledAngleRadians: 3.141592653589793 },
  output: { area: 6.283185307179586, wettedPerimeter: 6.283185307179586 },
} satisfies ToolExample<Input, Output>;
export const circularConduitPartFullAngleFactorTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "hydrology/circular-conduit-part-full-angle-factor",
    title: "Circular Conduit Part Full Angle Factor Tool",
    description:
      "Use the central angle of the wetted circular segment in radians.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        radius: { type: "number", exclusiveMinimum: 0 },
        filledAngleRadians: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["radius", "filledAngleRadians"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        area: { type: "number" },
        wettedPerimeter: { type: "number" },
      },
      required: ["area", "wettedPerimeter"],
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
          id: "filledAngleRadians",
          label: "Filled Angle Radians",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "area", label: "Area", valueType: { type: "number" } },
        {
          id: "wettedPerimeter",
          label: "Wetted Perimeter",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = circularConduitPartFullAngleFactorTool.execute;
export default circularConduitPartFullAngleFactorTool;
