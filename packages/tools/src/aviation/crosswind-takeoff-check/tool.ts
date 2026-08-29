import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const example = {
  input: {
    runwayHeadingDeg: 90,
    windFromDeg: 120,
    windSpeedKt: 20,
    crosswindLimitKt: 15,
  },
  output: { crosswindKt: 9.999999999999998, marginKt: 5.000000000000002 },
} satisfies ToolExample<Record<string, number>, Record<string, number>>;
export const tool = createSimpleTool({
  id: "aviation/crosswind-takeoff-check",
  title: "Crosswind Takeoff Check",
  description:
    "Resolve wind speed into an absolute crosswind component relative to runway heading and compare it with a user-supplied aircraft or pilot limit. This checks only the wind component, not runway condition or takeoff performance.",
  inputs: [
    {
      id: "runwayHeadingDeg",
      kind: "number",
      label: "Runway heading (deg)",
      minimum: 0,
    },
    {
      id: "windFromDeg",
      kind: "number",
      label: "Wind-from direction (deg)",
      minimum: 0,
    },
    { id: "windSpeedKt", kind: "number", label: "Wind speed (kt)", minimum: 0 },
    {
      id: "crosswindLimitKt",
      kind: "number",
      label: "Crosswind limit (kt)",
      minimum: 0,
    },
  ],
  outputs: [
    { id: "crosswindKt", kind: "number", label: "Crosswind Kt" },
    { id: "marginKt", kind: "number", label: "Margin Kt" },
  ],
  calculate: (input) => {
    const i = input as Record<string, number>;

    const output = {
      crosswindKt: Math.abs(
        i.windSpeedKt *
          Math.sin(((i.windFromDeg - i.runwayHeadingDeg) * Math.PI) / 180),
      ),
      marginKt:
        i.crosswindLimitKt -
        Math.abs(
          i.windSpeedKt *
            Math.sin(((i.windFromDeg - i.runwayHeadingDeg) * Math.PI) / 180),
        ),
    };
    for (const [field, value] of Object.entries(output))
      if (!Number.isFinite(value))
        simpleError(field, "The inputs produce a non-finite result.");
    return output;
  },
});
export type CrosswindTakeoffCheckInput = Readonly<typeof example.input>;
export type CrosswindTakeoffCheckOutput = Readonly<typeof example.output>;
export const crosswindTakeoffCheckTool = tool;
export const runCrosswindTakeoffCheck = tool.execute;
export default tool;
