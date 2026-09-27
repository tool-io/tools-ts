import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly longitude: number; readonly convention: string };
export type Output = {
  readonly eastPositive: number;
  readonly rotationSense: string;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    longitude: { type: "number" },
    convention: {
      type: "string",
      maxLength: 8192,
      enum: ["east-positive", "west-positive"],
    },
  },
  required: ["longitude", "convention"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    eastPositive: { type: "number" },
    rotationSense: { type: "string", maxLength: 8192 },
  },
  required: ["eastPositive", "rotationSense"],
} as const;
/** Translate the sign of a supplied longitude convention without wrapping its magnitude. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { longitude, convention } = request;
  const compute = (): Output => {
    H.domain(["east-positive", "west-positive"].includes(convention));
    const eastPositive =
      convention === "east-positive" ? longitude : -longitude;
    return {
      eastPositive,
      rotationSense:
        eastPositive > 0 ? "east" : eastPositive < 0 ? "west" : "none",
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { longitude: 30, convention: "west-positive" },
  output: { eastPositive: -30, rotationSense: "west" },
} satisfies ToolExample<Input, Output>;
export const geodeticLongitudeRotationSenseTokenTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "geography/geodetic-longitude-rotation-sense-token",
      title: "Geodetic Longitude Rotation Sense Token Tool",
      description:
        "Translate the sign of a supplied longitude convention without wrapping its magnitude.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          longitude: { type: "number" },
          convention: {
            type: "string",
            maxLength: 8192,
            enum: ["east-positive", "west-positive"],
          },
        },
        required: ["longitude", "convention"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          eastPositive: { type: "number" },
          rotationSense: { type: "string", maxLength: 8192 },
        },
        required: ["eastPositive", "rotationSense"],
      },
      ports: {
        inputs: [
          {
            id: "longitude",
            label: "Longitude",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "convention",
            label: "Convention",
            required: true,
            valueType: { type: "string" },
          },
        ],
        outputs: [
          {
            id: "eastPositive",
            label: "East Positive",
            valueType: { type: "number" },
          },
          {
            id: "rotationSense",
            label: "Rotation Sense",
            valueType: { type: "string" },
          },
        ],
      },
    },
    calculate,
  });
export const run = geodeticLongitudeRotationSenseTokenTool.execute;
export default geodeticLongitudeRotationSenseTokenTool;
