import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type DecimalDegreesToDmsInput = {
  readonly degrees?: number;
  readonly axis?: "latitude" | "longitude";
};

export type DecimalDegreesToDmsOutput = {
  readonly degrees: number;
  readonly minutes: number;
  readonly seconds: number;
  readonly direction: string;
};

export const calculateDecimalDegreesToDms = (
  input: DecimalDegreesToDmsInput,
): DecimalDegreesToDmsOutput => {
  const signedDegrees = input.degrees ?? 0;
  const axis = input.axis ?? "latitude";
  const limit = axis === "latitude" ? 90 : 180;
  if (Math.abs(signedDegrees) > limit)
    simpleError(
      "degrees",
      `${axis === "latitude" ? "Latitude" : "Longitude"} must be within ±${limit} degrees.`,
      "out_of_range",
    );
  const absolute = Math.abs(signedDegrees);
  const totalSeconds = Math.round(absolute * 3_600_000_000) / 1_000_000;
  const deg = Math.floor(totalSeconds / 3600);
  const min = Math.floor((totalSeconds - deg * 3600) / 60);
  const sec =
    Math.round((totalSeconds - deg * 3600 - min * 60) * 1_000_000) / 1_000_000;
  return {
    degrees: deg,
    minutes: min,
    seconds: sec,
    direction:
      axis === "latitude"
        ? signedDegrees >= 0
          ? "N"
          : "S"
        : signedDegrees >= 0
          ? "E"
          : "W",
  };
};

export const decimalDegreesToDmsExample = {
  input: {
    degrees: -73.9857,
    axis: "longitude",
  },
  output: {
    degrees: 73,
    minutes: 59,
    seconds: 8.52,
    direction: "W",
  },
} satisfies ToolExample<DecimalDegreesToDmsInput, DecimalDegreesToDmsOutput>;

export const decimalDegreesToDmsTool = createSimpleTool({
  id: "convert/decimal-degrees-to-dms",
  title: "Decimal Degrees to DMS Converter",
  description:
    "Split signed decimal degrees into degrees, minutes, seconds and a hemisphere letter.",
  inputs: [
    {
      description: "Signed decimal degrees within ±180.",
      default: 0,
      id: "degrees",
      kind: "number",
      label: "Decimal degrees",
    },
    {
      description: "Whether the angle is latitude or longitude.",
      default: "latitude",
      id: "axis",
      kind: "string",
      label: "Axis",
      enum: ["latitude", "longitude"],
    },
  ],
  outputs: [
    {
      description: "Unsigned degree component.",
      id: "degrees",
      kind: "integer",
      label: "Degrees",
    },
    {
      description: "Arc minutes from 0 to 59.",
      id: "minutes",
      kind: "integer",
      label: "Minutes",
    },
    {
      description: "Arc seconds from 0 to 60 (exclusive).",
      id: "seconds",
      kind: "number",
      label: "Seconds",
    },
    {
      description: "Hemisphere letter N/S/E/W.",
      id: "direction",
      kind: "string",
      label: "Direction",
    },
  ],
  calculate: (input) =>
    calculateDecimalDegreesToDms({
      axis: input.axis as "latitude" | "longitude" | undefined,
      degrees: input.degrees as number | undefined,
    }),
});

export const runDecimalDegreesToDms = decimalDegreesToDmsTool.execute;
export default decimalDegreesToDmsTool;
