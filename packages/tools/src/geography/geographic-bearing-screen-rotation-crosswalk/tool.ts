import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly bearingDegrees: number;
  readonly clockwiseScreenRotation: boolean;
};
export type Output = { readonly screenRotationDegrees: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    bearingDegrees: { type: "number" },
    clockwiseScreenRotation: { type: "boolean" },
  },
  required: ["bearingDegrees", "clockwiseScreenRotation"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { screenRotationDegrees: { type: "number" } },
  required: ["screenRotationDegrees"],
} as const;
/** Map north-zero clockwise bearing to east-zero screen rotation under an explicit rotation direction, normalized to one turn. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { bearingDegrees, clockwiseScreenRotation } = request;
  const compute = (): Output => {
    return {
      screenRotationDegrees: (() => {
        const raw =
          ((bearingDegrees % 360) - 90) * (clockwiseScreenRotation ? 1 : -1);
        const wrapped = raw % 360;
        return wrapped < 0
          ? wrapped + 360 === 360
            ? 0
            : wrapped + 360
          : wrapped;
      })(),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { bearingDegrees: 0, clockwiseScreenRotation: true },
  output: { screenRotationDegrees: 270 },
} satisfies ToolExample<Input, Output>;
export const geographicBearingScreenRotationCrosswalkTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      discovery: {
        aliases: [],
        collections: ["data", "learn"],
        fields: ["geography", "earth and environmental sciences"],
        keywords: ["geography", "earth and environmental sciences"],
      },
      id: "geography/geographic-bearing-screen-rotation-crosswalk",
      title: "Geographic Bearing Screen Rotation Crosswalk",
      description:
        "Map north-zero clockwise bearing to east-zero screen rotation under an explicit rotation direction, normalized to one turn.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          bearingDegrees: { type: "number" },
          clockwiseScreenRotation: { type: "boolean" },
        },
        required: ["bearingDegrees", "clockwiseScreenRotation"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: { screenRotationDegrees: { type: "number" } },
        required: ["screenRotationDegrees"],
      },
      ports: {
        inputs: [
          {
            id: "bearingDegrees",
            label: "Bearing Degrees",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "clockwiseScreenRotation",
            label: "Clockwise Screen Rotation",
            required: true,
            valueType: { type: "boolean" },
          },
        ],
        outputs: [
          {
            id: "screenRotationDegrees",
            label: "Screen Rotation Degrees",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = geographicBearingScreenRotationCrosswalkTool.execute;
export default geographicBearingScreenRotationCrosswalkTool;
