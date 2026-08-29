import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const example = {
  input: {
    initialCabinAltitudeFt: 1000,
    finalCabinAltitudeFt: 4000,
    elapsedMinutes: 10,
  },
  output: { rateFtPerMinute: 300 },
} satisfies ToolExample<Record<string, number>, Record<string, number>>;
export const tool = createSimpleTool({
  id: "aviation/cabin-rate-of-climb",
  title: "Cabin Rate of Climb",
  description:
    "Calculate the average cabin-altitude change in feet per minute from two cabin altitudes and elapsed minutes. A negative result means cabin descent; this is a measured average, not an aircraft operating limit.",
  inputs: [
    {
      id: "initialCabinAltitudeFt",
      kind: "number",
      label: "Initial cabin altitude (ft)",
    },
    {
      id: "finalCabinAltitudeFt",
      kind: "number",
      label: "Final cabin altitude (ft)",
    },
    {
      id: "elapsedMinutes",
      kind: "number",
      label: "Elapsed time (min)",
      minimum: Number.MIN_VALUE,
    },
  ],
  outputs: [
    { id: "rateFtPerMinute", kind: "number", label: "Rate Ft Per Minute" },
  ],
  calculate: (input) => {
    const i = input as Record<string, number>;

    const output = {
      rateFtPerMinute:
        (i.finalCabinAltitudeFt - i.initialCabinAltitudeFt) / i.elapsedMinutes,
    };
    for (const [field, value] of Object.entries(output))
      if (!Number.isFinite(value))
        simpleError(field, "The inputs produce a non-finite result.");
    return output;
  },
});
export type CabinRateOfClimbInput = Readonly<typeof example.input>;
export type CabinRateOfClimbOutput = Readonly<typeof example.output>;
export const cabinRateOfClimbTool = tool;
export const runCabinRateOfClimb = tool.execute;
export default tool;
