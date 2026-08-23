import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type DmsToDecimalDegreesInput = {
  readonly degrees?: number;
  readonly minutes?: number;
  readonly seconds?: number;
  readonly hemisphere?: "N" | "S" | "E" | "W";
};

export type DmsToDecimalDegreesOutput = {
  readonly decimalDegrees: number;
};

export const calculateDmsToDecimalDegrees = (
  input: DmsToDecimalDegreesInput,
): DmsToDecimalDegreesOutput => {
  const degrees = input.degrees ?? 0;
  const minutes = input.minutes ?? 0;
  const seconds = input.seconds ?? 0;
  const hemisphere = input.hemisphere ?? "N";
  if (minutes < 0 || minutes > 59)
    simpleError("minutes", "Minutes must be between 0 and 59.", "out_of_range");
  if (!(seconds >= 0) || seconds >= 60)
    simpleError(
      "seconds",
      "Seconds must be at least 0 and below 60.",
      "out_of_range",
    );
  const degreeLimit = hemisphere === "N" || hemisphere === "S" ? 90 : 180;
  if (Math.abs(degrees) > degreeLimit)
    simpleError(
      "degrees",
      `Degrees must be within ±${degreeLimit} for hemisphere ${hemisphere}.`,
      "out_of_range",
    );
  const sign = degrees < 0 || hemisphere === "S" || hemisphere === "W" ? -1 : 1;
  return {
    decimalDegrees: sign * (Math.abs(degrees) + minutes / 60 + seconds / 3600),
  };
};

export const dmsToDecimalDegreesExample = {
  input: {
    degrees: 40,
    minutes: 42,
    seconds: 46.08,
    hemisphere: "N",
  },
  output: {
    decimalDegrees: 40.7128,
  },
} satisfies ToolExample<DmsToDecimalDegreesInput, DmsToDecimalDegreesOutput>;

export const dmsToDecimalDegreesTool = createSimpleTool({
  id: "convert/dms-to-decimal-degrees",
  title: "DMS to Decimal Degrees Converter",
  description:
    "Combine degrees, minutes and seconds with a hemisphere letter into signed decimal degrees.",
  inputs: [
    {
      description: "Degree component, negative allowed.",
      default: 0,
      id: "degrees",
      kind: "integer",
      label: "Degrees",
    },
    {
      description: "Arc minutes from 0 to 59.",
      default: 0,
      id: "minutes",
      kind: "integer",
      label: "Minutes",
      minimum: 0,
      maximum: 59,
    },
    {
      description: "Arc seconds below 60.",
      default: 0,
      id: "seconds",
      kind: "number",
      label: "Seconds",
      minimum: 0,
      maximum: 59.999999,
    },
    {
      description: "Compass hemisphere letter.",
      default: "N",
      id: "hemisphere",
      kind: "string",
      label: "Hemisphere",
      enum: ["N", "S", "E", "W"],
    },
  ],
  outputs: [
    {
      description: "Signed decimal degrees.",
      id: "decimalDegrees",
      kind: "number",
      label: "Decimal degrees",
    },
  ],
  calculate: (input) =>
    calculateDmsToDecimalDegrees({
      degrees: input.degrees as number | undefined,
      hemisphere: input.hemisphere as "N" | "S" | "E" | "W" | undefined,
      minutes: input.minutes as number | undefined,
      seconds: input.seconds as number | undefined,
    }),
});

export const runDmsToDecimalDegrees = dmsToDecimalDegreesTool.execute;
export default dmsToDecimalDegreesTool;
