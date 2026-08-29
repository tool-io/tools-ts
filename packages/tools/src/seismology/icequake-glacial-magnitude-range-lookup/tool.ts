import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const icequakeGlacialMagnitudeRangeLookupExample = {
  input: { mechanism: "basal-stick-slip" },
  output: {
    magnitudeLow: 4.5,
    magnitudeHigh: 5.2,
    note: "Greenland-style double-couple events with long T-phase tails",
  },
} satisfies ToolExample<Record<string, unknown>, Record<string, unknown>>;

export const icequakeGlacialMagnitudeRangeLookupTool = createSimpleTool({
  calculate: (input: Readonly<Record<string, unknown>>) =>
    (({ mechanism }) => {
      const table = {
        "basal-stick-slip": {
          magnitudeLow: 4.5,
          magnitudeHigh: 5.2,
          note: "Greenland-style double-couple events with long T-phase tails",
        },
        crevasse: {
          magnitudeLow: -1.0,
          magnitudeHigh: 1.5,
          note: "Near-surface tensile cracking in the accumulation zone",
        },
        calving: {
          magnitudeLow: 2.0,
          magnitudeHigh: 3.5,
          note: "Iceberg detachment and rotation impulses",
        },
      }[mechanism];
      if (!table) simpleError("mechanism", "Unknown glacial mechanism.");
      return table;
    })(input as never) as Record<string, unknown>,
  description:
    "Characteristic magnitude ranges for glacial earthquake mechanisms.",
  id: "seismology/icequake-glacial-magnitude-range-lookup",
  inputs: [
    {
      description: "basal-stick-slip, crevasse, or calving.",
      id: "mechanism",
      kind: "string",
      label: "Mechanism",
    },
  ],
  outputs: [
    {
      description: "Lower magnitude bound.",
      id: "magnitudeLow",
      kind: "number",
      label: "M_lo",
    },
    {
      description: "Upper magnitude bound.",
      id: "magnitudeHigh",
      kind: "number",
      label: "M_hi",
    },
    {
      description: "Mechanism note.",
      id: "note",
      kind: "string",
      label: "Note",
    },
  ],
  title: "Icequake Glacial Magnitude Range Lookup",
});
export const runIcequakeGlacialMagnitudeRangeLookup =
  icequakeGlacialMagnitudeRangeLookupTool.execute;
export { icequakeGlacialMagnitudeRangeLookupExample as example };
export default icequakeGlacialMagnitudeRangeLookupTool;
