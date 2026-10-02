import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly height: number;
  readonly sunAltitude: number;
  readonly azimuthDifference: number;
  readonly bedWidth: number;
};
export type Output = {
  readonly crossBedShadow: number;
  readonly shadedFraction: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    height: { type: "number", minimum: 0 },
    sunAltitude: { type: "number", exclusiveMinimum: 0 },
    azimuthDifference: { type: "number" },
    bedWidth: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["height", "sunAltitude", "azimuthDifference", "bedWidth"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    crossBedShadow: { type: "number" },
    shadedFraction: { type: "number" },
  },
  required: ["crossBedShadow", "shadedFraction"],
} as const;
/** Calculate trellis climbing bed shade projection term from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { height, sunAltitude, azimuthDifference, bedWidth } = request;
  const compute = (): Output => {
    H.domain(height >= 0 && sunAltitude > 0 && sunAltitude < Math.PI / 2);
    H.positive(bedWidth);
    return {
      crossBedShadow: Math.abs(
        (height * Math.cos(azimuthDifference)) / Math.tan(sunAltitude),
      ),
      shadedFraction: Math.min(
        1,
        Math.abs(
          (height * Math.cos(azimuthDifference)) / Math.tan(sunAltitude),
        ) / bedWidth,
      ),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    height: 2,
    sunAltitude: 0.7853981633974483,
    azimuthDifference: 0,
    bedWidth: 4,
  },
  output: {
    crossBedShadow: 2.0000000000000004,
    shadedFraction: 0.5000000000000001,
  },
} satisfies ToolExample<Input, Output>;
export const trellisClimbingBedShadeProjectionTermTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "permaculture/trellis-climbing-bed-shade-projection-term",
      title: "Trellis Climbing BED Shade Projection Term Tool",
      description:
        "Calculate trellis climbing bed shade projection term from explicit caller-supplied inputs.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          height: { type: "number", minimum: 0 },
          sunAltitude: { type: "number", exclusiveMinimum: 0 },
          azimuthDifference: { type: "number" },
          bedWidth: { type: "number", exclusiveMinimum: 0 },
        },
        required: ["height", "sunAltitude", "azimuthDifference", "bedWidth"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          crossBedShadow: { type: "number" },
          shadedFraction: { type: "number" },
        },
        required: ["crossBedShadow", "shadedFraction"],
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
          {
            id: "azimuthDifference",
            label: "Azimuth Difference",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "bedWidth",
            label: "Bed Width",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "crossBedShadow",
            label: "Cross Bed Shadow",
            valueType: { type: "number" },
          },
          {
            id: "shadedFraction",
            label: "Shaded Fraction",
            valueType: { type: "number", unit: "1" },
          },
        ],
      },
    },
    calculate,
  });
export const run = trellisClimbingBedShadeProjectionTermTool.execute;
export default trellisClimbingBedShadeProjectionTermTool;
