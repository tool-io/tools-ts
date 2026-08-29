import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";

export const volcanoRepeaterFamilyCorrelationCheckerExample = {
  input: { meanCrossCorrelation: 0.95, eventCount: 12, interEventCv: 0.2 },
  output: {
    familyConfident: true,
    driverHint: "quasi-periodic pressurization",
  },
} satisfies ToolExample<Record<string, unknown>, Record<string, unknown>>;

export const volcanoRepeaterFamilyCorrelationCheckerTool = createSimpleTool({
  calculate: (input: Readonly<Record<string, unknown>>) =>
    (({ meanCrossCorrelation, eventCount, interEventCv }) => {
      const familyConfident =
        meanCrossCorrelation >= 0.9 && eventCount >= 5 && interEventCv < 0.5;
      return {
        familyConfident,
        driverHint: familyConfident
          ? interEventCv < 0.15
            ? "steady aseismic creep driving stick-slip patches"
            : "quasi-periodic pressurization"
          : "insufficient similarity or regularity; likely distinct sources",
      };
    })(input as never) as Record<string, unknown>,
  description:
    "Screen whether an event group qualifies as a repeating-earthquake family via waveform similarity and regularity.",
  id: "seismology/volcano-repeater-family-correlation-checker",
  inputs: [
    {
      minimum: 0,
      description: "Average waveform cross-correlation.",
      id: "meanCrossCorrelation",
      kind: "number",
      label: "CC̄",
    },
    {
      minimum: 0,
      description: "Number of events in the group.",
      id: "eventCount",
      kind: "integer",
      label: "N",
    },
    {
      minimum: 0,
      description: "Coefficient of variation of inter-event times.",
      id: "interEventCv",
      kind: "number",
      label: "CV",
    },
  ],
  outputs: [
    {
      description: "Whether the group qualifies as a repeater family.",
      id: "familyConfident",
      kind: "boolean",
      label: "Family?",
    },
    {
      description: "Likely driving process hint.",
      id: "driverHint",
      kind: "string",
      label: "Driver",
    },
  ],
  title: "Volcano Repeater Family Correlation Checker",
});
export const runVolcanoRepeaterFamilyCorrelationChecker =
  volcanoRepeaterFamilyCorrelationCheckerTool.execute;
export { volcanoRepeaterFamilyCorrelationCheckerExample as example };
export default volcanoRepeaterFamilyCorrelationCheckerTool;
