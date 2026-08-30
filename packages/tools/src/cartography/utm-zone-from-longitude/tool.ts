import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type UtmZoneFromLongitudeInput = Readonly<{
  readonly longitudeDegrees: number;
}>;
export type UtmZoneFromLongitudeOutput = Readonly<{
  readonly utmZone: number;
}>;

export const calculateUtmZoneFromLongitude = (
  x: UtmZoneFromLongitudeInput,
): UtmZoneFromLongitudeOutput => {
  if (!Number.isFinite(x.longitudeDegrees))
    simpleError("longitudeDegrees", "Provide a finite number.");
  if (!(x.longitudeDegrees >= -180 && x.longitudeDegrees <= 180))
    simpleError("input", "Inputs violate the stated model or operating range.");
  const utmZone = Math.min(60, Math.floor((x.longitudeDegrees + 180) / 6) + 1);
  if (!Number.isFinite(utmZone))
    simpleError(
      "utmZone",
      "Inputs produce an undefined or out-of-range result.",
    );
  return { utmZone: Object.is(utmZone, -0) ? 0 : utmZone };
};

export const example = {
  input: {
    longitudeDegrees: 13.4,
  },
  output: { utmZone: 33 },
} satisfies ToolExample<UtmZoneFromLongitudeInput, UtmZoneFromLongitudeOutput>;

export const tool = createSimpleTool({
  id: "cartography/utm-zone-from-longitude",
  title: "Utm Zone From Longitude",
  description:
    "Standard longitude-only UTM zone number, 1–60; excludes the Norway/Svalbard special-zone exceptions.",
  inputs: [
    {
      id: "longitudeDegrees",
      kind: "number",
      label: "Longitude Degrees",
      unit: "deg",
    },
  ],
  outputs: [{ id: "utmZone", kind: "number", label: "Utm Zone" }],
  calculate: (input) =>
    calculateUtmZoneFromLongitude({
      longitudeDegrees: input.longitudeDegrees as number,
    }),
});
export const utmZoneFromLongitudeTool = tool;
export const runUtmZoneFromLongitude = tool.execute;
export default tool;
