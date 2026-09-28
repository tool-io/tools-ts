import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly surfaceRadius: number; readonly height: number };
export type Output = {
  readonly radius: number;
  readonly relativeChange: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    surfaceRadius: { type: "number", exclusiveMinimum: 0 },
    height: { type: "number" },
  },
  required: ["surfaceRadius", "height"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    radius: { type: "number" },
    relativeChange: { type: "number" },
  },
  required: ["radius", "relativeChange"],
} as const;
/** Calculate latitude height radius approximation from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { surfaceRadius, height } = request;
  const compute = (): Output => {
    H.positive(surfaceRadius);
    H.domain(surfaceRadius + height > 0);
    return {
      radius: surfaceRadius + height,
      relativeChange: height / surfaceRadius,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { surfaceRadius: 6000000, height: 1000 },
  output: { radius: 6001000, relativeChange: 0.00016666666666666666 },
} satisfies ToolExample<Input, Output>;
export const latitudeHeightRadiusApproximationTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "geography/latitude-height-radius-approximation",
    title: "Latitude Height Radius Approximation Tool",
    description:
      "Calculate latitude height radius approximation from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        surfaceRadius: { type: "number", exclusiveMinimum: 0 },
        height: { type: "number" },
      },
      required: ["surfaceRadius", "height"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        radius: { type: "number" },
        relativeChange: { type: "number" },
      },
      required: ["radius", "relativeChange"],
    },
    ports: {
      inputs: [
        {
          id: "surfaceRadius",
          label: "Surface Radius",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "height",
          label: "Height",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "radius", label: "Radius", valueType: { type: "number" } },
        {
          id: "relativeChange",
          label: "Relative Change",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = latitudeHeightRadiusApproximationTool.execute;
export default latitudeHeightRadiusApproximationTool;
