import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";

export const dartPressureTsunamiFlagCheckerExample = {
  input: { amplitudeCm: 5, dominantPeriodMin: 15 },
  output: {
    tsunamiFlagged: true,
    note: "Amplitude and period consistent with a propagating tsunami; trigger DART mode B.",
  },
} satisfies ToolExample<Record<string, unknown>, Record<string, unknown>>;

export const dartPressureTsunamiFlagCheckerTool = createSimpleTool({
  calculate: (input: Readonly<Record<string, unknown>>) =>
    (({ amplitudeCm, dominantPeriodMin }) => {
      const tsunamiFlagged =
        amplitudeCm >= 3 && dominantPeriodMin >= 2 && dominantPeriodMin <= 60;
      return {
        tsunamiFlagged,
        note: tsunamiFlagged
          ? "Amplitude and period consistent with a propagating tsunami; trigger DART mode B."
          : "Signal within ambient ocean noise or swell band; continue monitoring.",
      };
    })(input as never) as Record<string, unknown>,
  description:
    "Flag DART bottom-pressure observations whose amplitude and period band match a tsunami signature.",
  id: "seismology/dart-pressure-tsunami-flag-checker",
  inputs: [
    {
      minimum: 0,
      description: "Band-passed pressure amplitude (cm equivalent sea height).",
      id: "amplitudeCm",
      kind: "number",
      label: "A",
      unit: "cm",
    },
    {
      minimum: 0,
      description: "Dominant wave period.",
      id: "dominantPeriodMin",
      kind: "number",
      label: "T",
      unit: "min",
    },
  ],
  outputs: [
    {
      description: "Whether the signal qualifies as tsunami.",
      id: "tsunamiFlagged",
      kind: "boolean",
      label: "Flagged",
    },
    {
      description: "Screening note.",
      id: "note",
      kind: "string",
      label: "Note",
    },
  ],
  title: "DART Pressure Tsunami Flag Checker",
});
export const runDartPressureTsunamiFlagChecker =
  dartPressureTsunamiFlagCheckerTool.execute;
export { dartPressureTsunamiFlagCheckerExample as example };
export default dartPressureTsunamiFlagCheckerTool;
