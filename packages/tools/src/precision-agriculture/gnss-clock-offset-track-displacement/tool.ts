import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly offsetSeconds: number;
  readonly speed: number;
  readonly suppliedMetersPerSecondPerSpeedUnit: number;
  readonly headingDegrees: number;
};
export type Output = {
  readonly signedDistanceMeters: number;
  readonly eastMeters: number;
  readonly northMeters: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    offsetSeconds: { type: "number" },
    speed: { type: "number", minimum: 0 },
    suppliedMetersPerSecondPerSpeedUnit: {
      type: "number",
      exclusiveMinimum: 0,
    },
    headingDegrees: { type: "number" },
  },
  required: [
    "offsetSeconds",
    "speed",
    "suppliedMetersPerSecondPerSpeedUnit",
    "headingDegrees",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    signedDistanceMeters: { type: "number" },
    eastMeters: { type: "number" },
    northMeters: { type: "number" },
  },
  required: ["signedDistanceMeters", "eastMeters", "northMeters"],
} as const;
/** Convert one explicit clock offset, constant speed and clockwise-from-north heading to signed east/north displacement; no live location or machine control. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const {
    offsetSeconds,
    speed,
    suppliedMetersPerSecondPerSpeedUnit,
    headingDegrees,
  } = request;
  const compute = (): Output => {
    H.domain(speed >= 0);
    H.positive(suppliedMetersPerSecondPerSpeedUnit);
    return {
      signedDistanceMeters:
        offsetSeconds * speed * suppliedMetersPerSecondPerSpeedUnit,
      eastMeters:
        offsetSeconds *
        speed *
        suppliedMetersPerSecondPerSpeedUnit *
        Math.sin((headingDegrees * Math.PI) / 180),
      northMeters:
        offsetSeconds *
        speed *
        suppliedMetersPerSecondPerSpeedUnit *
        Math.cos((headingDegrees * Math.PI) / 180),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    offsetSeconds: 2,
    speed: 36,
    suppliedMetersPerSecondPerSpeedUnit: 0.2777777777777778,
    headingDegrees: 0,
  },
  output: { signedDistanceMeters: 20, eastMeters: 0, northMeters: 20 },
} satisfies ToolExample<Input, Output>;
export const gnssClockOffsetTrackDisplacementTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "precision-agriculture/gnss-clock-offset-track-displacement",
    title: "GNSS Clock Offset Track Displacement Tool",
    description:
      "Convert one explicit clock offset, constant speed and clockwise-from-north heading to signed east/north displacement; no live location or machine control.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        offsetSeconds: { type: "number" },
        speed: { type: "number", minimum: 0 },
        suppliedMetersPerSecondPerSpeedUnit: {
          type: "number",
          exclusiveMinimum: 0,
        },
        headingDegrees: { type: "number" },
      },
      required: [
        "offsetSeconds",
        "speed",
        "suppliedMetersPerSecondPerSpeedUnit",
        "headingDegrees",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        signedDistanceMeters: { type: "number" },
        eastMeters: { type: "number" },
        northMeters: { type: "number" },
      },
      required: ["signedDistanceMeters", "eastMeters", "northMeters"],
    },
    ports: {
      inputs: [
        {
          id: "offsetSeconds",
          label: "Offset Seconds",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "speed",
          label: "Speed",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "suppliedMetersPerSecondPerSpeedUnit",
          label: "Supplied Meters Per Second Per Speed Unit",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "headingDegrees",
          label: "Heading Degrees",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "signedDistanceMeters",
          label: "Signed Distance Meters",
          valueType: { type: "number" },
        },
        {
          id: "eastMeters",
          label: "East Meters",
          valueType: { type: "number" },
        },
        {
          id: "northMeters",
          label: "North Meters",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = gnssClockOffsetTrackDisplacementTool.execute;
export default gnssClockOffsetTrackDisplacementTool;
