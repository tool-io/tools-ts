import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const tremorSlipEpisodicWeeksLookupExample = {
  input: { regionClass: "cascadia" },
  output: {
    recurrenceWeeks: 66,
    episodeDurationWeeks: 4,
    migrationKmPerDay: 8,
  },
} satisfies ToolExample<Record<string, unknown>, Record<string, unknown>>;

export const tremorSlipEpisodicWeeksLookupTool = createSimpleTool({
  calculate: (input: Readonly<Record<string, unknown>>) =>
    (({ regionClass }) => {
      const table = {
        cascadia: {
          recurrenceWeeks: 66,
          episodeDurationWeeks: 4,
          migrationKmPerDay: 8,
        },
        nankai: {
          recurrenceWeeks: 26,
          episodeDurationWeeks: 1,
          migrationKmPerDay: 10,
        },
        alaska: {
          recurrenceWeeks: 52,
          episodeDurationWeeks: 3,
          migrationKmPerDay: 7,
        },
        mexico: {
          recurrenceWeeks: 130,
          episodeDurationWeeks: 6,
          migrationKmPerDay: 5,
        },
      }[regionClass];
      if (!table) simpleError("regionClass", "Unknown ETS region class.");
      return table;
    })(input as never) as Record<string, unknown>,
  description:
    "Typical episodic-tremor-and-slip recurrence and migration parameters by region class.",
  id: "seismology/tremor-slip-episodic-weeks-lookup",
  inputs: [
    {
      description: "ETS region class (cascadia, nankai, alaska, mexico).",
      id: "regionClass",
      kind: "string",
      label: "Region",
    },
  ],
  outputs: [
    {
      description: "Mean episode recurrence.",
      id: "recurrenceWeeks",
      kind: "number",
      label: "Interval",
      unit: "wk",
    },
    {
      description: "Typical single-episode duration.",
      id: "episodeDurationWeeks",
      kind: "number",
      label: "Duration",
      unit: "wk",
    },
    {
      description: "Tremor migration speed.",
      id: "migrationKmPerDay",
      kind: "number",
      label: "V_mig",
      unit: "km/d",
    },
  ],
  title: "Tremor Slip Episodic Weeks Lookup",
});
export const runTremorSlipEpisodicWeeksLookup =
  tremorSlipEpisodicWeeksLookupTool.execute;
export { tremorSlipEpisodicWeeksLookupExample as example };
export default tremorSlipEpisodicWeeksLookupTool;
