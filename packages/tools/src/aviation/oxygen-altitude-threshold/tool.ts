import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const example = {
  input: { flightAltitudeFt: 13500, thresholdFt: 12500 },
  output: { feetAboveThreshold: 1000 },
} satisfies ToolExample<Record<string, number>, Record<string, number>>;
export const tool = createSimpleTool({
  id: "aviation/oxygen-altitude-threshold",
  title: "Oxygen Altitude Threshold",
  description:
    "Compare a flight altitude with a threshold supplied by the user and calculate feet above or below that threshold. Oxygen rules vary by jurisdiction, aircraft, duration, and crew/passenger status; this tool does not choose a legal threshold.",
  inputs: [
    { id: "flightAltitudeFt", kind: "number", label: "Flight altitude (ft)" },
    {
      id: "thresholdFt",
      kind: "number",
      label: "Threshold altitude (ft)",
      minimum: 0,
    },
  ],
  outputs: [
    { id: "feetAboveThreshold", kind: "number", label: "Feet Above Threshold" },
  ],
  calculate: (input) => {
    const i = input as Record<string, number>;

    const output = { feetAboveThreshold: i.flightAltitudeFt - i.thresholdFt };
    for (const [field, value] of Object.entries(output))
      if (!Number.isFinite(value))
        simpleError(field, "The inputs produce a non-finite result.");
    return output;
  },
});
export type OxygenAltitudeThresholdInput = Readonly<typeof example.input>;
export type OxygenAltitudeThresholdOutput = Readonly<typeof example.output>;
export const oxygenAltitudeThresholdTool = tool;
export const runOxygenAltitudeThreshold = tool.execute;
export default tool;
