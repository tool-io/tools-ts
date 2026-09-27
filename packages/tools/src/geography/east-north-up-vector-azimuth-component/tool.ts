import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly east: number; readonly north: number };
export type Output = {
  readonly azimuthDegrees: number;
  readonly horizontalMagnitude: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { east: { type: "number" }, north: { type: "number" } },
  required: ["east", "north"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    azimuthDegrees: { type: "number" },
    horizontalMagnitude: { type: "number" },
  },
  required: ["azimuthDegrees", "horizontalMagnitude"],
} as const;
/** Calculate east north up vector azimuth component from explicit caller-supplied inputs. */
export function calculate(input: Input): Output {
  H.requireInput(input, inputSchema);
  const { east, north } = input;
  const compute = (): Output => {
    H.domain(east !== 0 || north !== 0);
    return {
      azimuthDegrees: H.mod((Math.atan2(east, north) * 180) / Math.PI, 360),
      horizontalMagnitude: Math.hypot(east, north),
    };
  };
  const output = H.canonicalOutput(compute());
  H.requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { east: 3, north: 0 },
  output: { azimuthDegrees: 90, horizontalMagnitude: 3 },
} satisfies ToolExample<Input, Output>;
export const eastNorthUpVectorAzimuthComponentTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "geography/east-north-up-vector-azimuth-component",
    title: "East North Up Vector Azimuth Component Tool",
    description:
      "Calculate east north up vector azimuth component from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { east: { type: "number" }, north: { type: "number" } },
      required: ["east", "north"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        azimuthDegrees: { type: "number" },
        horizontalMagnitude: { type: "number" },
      },
      required: ["azimuthDegrees", "horizontalMagnitude"],
    },
    ports: {
      inputs: [
        {
          id: "east",
          label: "East",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "north",
          label: "North",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "azimuthDegrees",
          label: "Azimuth Degrees",
          valueType: { type: "number" },
        },
        {
          id: "horizontalMagnitude",
          label: "Horizontal Magnitude",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = eastNorthUpVectorAzimuthComponentTool.execute;
export default eastNorthUpVectorAzimuthComponentTool;
