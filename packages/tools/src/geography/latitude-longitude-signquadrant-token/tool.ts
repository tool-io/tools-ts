import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly latitude: number; readonly longitude: number };
export type Output = { readonly quadrant: string; readonly onAxis: boolean };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    latitude: { type: "number", minimum: -90, maximum: 90 },
    longitude: { type: "number", minimum: -180, maximum: 180 },
  },
  required: ["latitude", "longitude"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    quadrant: { type: "string", maxLength: 8192 },
    onAxis: { type: "boolean" },
  },
  required: ["quadrant", "onAxis"],
} as const;
/** Calculate latitude longitude signquadrant token from explicit caller-supplied inputs. */
export function calculate(input: Input): Output {
  H.requireInput(input, inputSchema);
  const { latitude, longitude } = input;
  const compute = (): Output => {
    H.domain(
      latitude >= -90 &&
        latitude <= 90 &&
        longitude >= -180 &&
        longitude <= 180,
    );
    const onAxis = latitude === 0 || longitude === 0;
    return {
      quadrant: onAxis
        ? "axis"
        : (latitude > 0 ? "N" : "S") + (longitude > 0 ? "E" : "W"),
      onAxis,
    };
  };
  const output = H.canonicalOutput(compute());
  H.requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { latitude: 30, longitude: -40 },
  output: { quadrant: "NW", onAxis: false },
} satisfies ToolExample<Input, Output>;
export const latitudeLongitudeSignquadrantTokenTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "geography/latitude-longitude-signquadrant-token",
    title: "Latitude Longitude Signquadrant Token Tool",
    description:
      "Calculate latitude longitude signquadrant token from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        latitude: { type: "number", minimum: -90, maximum: 90 },
        longitude: { type: "number", minimum: -180, maximum: 180 },
      },
      required: ["latitude", "longitude"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        quadrant: { type: "string", maxLength: 8192 },
        onAxis: { type: "boolean" },
      },
      required: ["quadrant", "onAxis"],
    },
    ports: {
      inputs: [
        {
          id: "latitude",
          label: "Latitude",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "longitude",
          label: "Longitude",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "quadrant", label: "Quadrant", valueType: { type: "string" } },
        { id: "onAxis", label: "On Axis", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = latitudeLongitudeSignquadrantTokenTool.execute;
export default latitudeLongitudeSignquadrantTokenTool;
