import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly height: number; readonly sunAltitude: number };
export type Output = { readonly shadowLength: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    height: { type: "number", minimum: 0 },
    sunAltitude: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["height", "sunAltitude"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { shadowLength: { type: "number" } },
  required: ["shadowLength"],
} as const;
/** Level ground and a point solar altitude in radians; azimuth and terrain are excluded. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { height, sunAltitude } = request;
  const compute = (): Output => {
    H.domain(height >= 0 && sunAltitude > 0 && sunAltitude <= Math.PI / 2);
    return { shadowLength: height / Math.tan(sunAltitude) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { height: 10, sunAltitude: 0.7853981633974483 },
  output: { shadowLength: 10.000000000000002 },
} satisfies ToolExample<Input, Output>;
export const shadowLengthBuildingHeightTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "urban-planning/shadow-length-building-height-term",
    title: "Shadow Length Building Height Term Tool",
    description:
      "Level ground and a point solar altitude in radians; azimuth and terrain are excluded.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        height: { type: "number", minimum: 0 },
        sunAltitude: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["height", "sunAltitude"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { shadowLength: { type: "number" } },
      required: ["shadowLength"],
    },
    ports: {
      inputs: [
        {
          id: "height",
          label: "Height",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "sunAltitude",
          label: "Sun Altitude",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "shadowLength",
          label: "Shadow Length",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = shadowLengthBuildingHeightTermTool.execute;
export default shadowLengthBuildingHeightTermTool;
