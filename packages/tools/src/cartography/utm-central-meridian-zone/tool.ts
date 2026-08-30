import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type UtmCentralMeridianZoneInput = Readonly<{
  readonly utmZone: number;
}>;
export type UtmCentralMeridianZoneOutput = Readonly<{
  readonly centralMeridianDegrees: number;
}>;

export const calculateUtmCentralMeridianZone = (
  x: UtmCentralMeridianZoneInput,
): UtmCentralMeridianZoneOutput => {
  if (
    !Number.isFinite(x.utmZone) ||
    !Number.isSafeInteger(x.utmZone) ||
    x.utmZone < 1
  )
    simpleError("utmZone", "Provide a positive safe integer.");
  if (!(x.utmZone <= 60))
    simpleError("input", "Inputs violate the stated model or operating range.");
  const centralMeridianDegrees = 6 * x.utmZone - 183;
  if (!Number.isFinite(centralMeridianDegrees))
    simpleError(
      "centralMeridianDegrees",
      "Inputs produce an undefined or out-of-range result.",
    );
  return {
    centralMeridianDegrees: Object.is(centralMeridianDegrees, -0)
      ? 0
      : centralMeridianDegrees,
  };
};

export const example = {
  input: {
    utmZone: 33,
  },
  output: { centralMeridianDegrees: 15 },
} satisfies ToolExample<
  UtmCentralMeridianZoneInput,
  UtmCentralMeridianZoneOutput
>;

export const tool = createSimpleTool({
  id: "cartography/utm-central-meridian-zone",
  title: "Utm Central Meridian Zone",
  description: "Central meridian in degrees for a numbered UTM zone.",
  inputs: [{ id: "utmZone", kind: "integer", label: "Utm Zone", minimum: 1 }],
  outputs: [
    {
      id: "centralMeridianDegrees",
      kind: "number",
      label: "Central Meridian Degrees",
      unit: "deg",
    },
  ],
  calculate: (input) =>
    calculateUtmCentralMeridianZone({
      utmZone: input.utmZone as number,
    }),
});
export const utmCentralMeridianZoneTool = tool;
export const runUtmCentralMeridianZone = tool.execute;
export default tool;
