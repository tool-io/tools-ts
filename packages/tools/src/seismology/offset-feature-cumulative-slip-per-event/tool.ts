import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const offsetFeatureCumulativeSlipPerEventExample = {
  input: { cumulativeOffsetM: 12, eventCount: 4 },
  output: {
    perEventSlipM: 3,
    variabilityNote:
      "Character-vs-variable slip should be assessed from per-event spread.",
  },
} satisfies ToolExample<Record<string, unknown>, Record<string, unknown>>;

export const offsetFeatureCumulativeSlipPerEventTool = createSimpleTool({
  calculate: (input: Readonly<Record<string, unknown>>) =>
    (({ cumulativeOffsetM, eventCount }) => {
      if (eventCount <= 0)
        simpleError("eventCount", "Need at least one event.");
      const perEventSlipM = cumulativeOffsetM / eventCount;
      return {
        perEventSlipM,
        variabilityNote:
          perEventSlipM > 0
            ? "Character-vs-variable slip should be assessed from per-event spread."
            : "",
      };
    })(input as never) as Record<string, unknown>,
  description:
    "Average per-event slip from cumulative offset divided by the number of events recorded.",
  id: "seismology/offset-feature-cumulative-slip-per-event",
  inputs: [
    {
      minimum: 0,
      description: "Total cumulative offset.",
      id: "cumulativeOffsetM",
      kind: "number",
      label: "U",
      unit: "m",
    },
    {
      minimum: 0,
      description: "Number of paleoevents.",
      id: "eventCount",
      kind: "integer",
      label: "N",
    },
  ],
  outputs: [
    {
      description: "Mean slip per event.",
      id: "perEventSlipM",
      kind: "number",
      label: "ū",
      unit: "m",
    },
    {
      description: "Interpretation guidance.",
      id: "variabilityNote",
      kind: "string",
      label: "Note",
    },
  ],
  title: "Offset Feature Cumulative Slip Per Event Calculator",
});
export const runOffsetFeatureCumulativeSlipPerEvent =
  offsetFeatureCumulativeSlipPerEventTool.execute;
export { offsetFeatureCumulativeSlipPerEventExample as example };
export default offsetFeatureCumulativeSlipPerEventTool;
