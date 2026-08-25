import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const flowCytometryPercentageExample = {
  input: { positiveEvents: 2500, totalEvents: 10000 },
  output: { positivePercent: 25 },
} satisfies ToolExample<
  { readonly positiveEvents: number; readonly totalEvents: number },
  { readonly positivePercent: number }
>;

export const flowCytometryPercentageTool = createSimpleTool({
  id: "biology/flow-cytometry-percentage",
  title: "Flow Positive %",
  description:
    "Compute the percentage of positive events recorded by a flow cytometry run as positive events divided by total events times one hundred.",
  inputs: [
    {
      description:
        "Number of events classified as positive; must not exceed the total event count.",
      id: "positiveEvents",
      label: "Positive events",
      kind: "integer",
      minimum: 0,
    },
    {
      description:
        "Total number of recorded events; must be greater than zero.",
      id: "totalEvents",
      label: "Total events",
      kind: "integer",
      minimum: 1,
    },
  ],
  outputs: [
    {
      description: "Percentage of events that are positive.",
      id: "positivePercent",
      label: "Positive percent",
      kind: "number",
      unit: "%",
    },
  ],
  calculate: (input) => {
    const positiveEvents = input.positiveEvents as number;
    const totalEvents = input.totalEvents as number;
    if (positiveEvents > totalEvents)
      simpleError(
        "positiveEvents",
        "Positive events must not exceed the total event count.",
        "invalid_events",
      );
    return { positivePercent: (positiveEvents / totalEvents) * 100 };
  },
});
export const runFlowCytometryPercentage = flowCytometryPercentageTool.execute;
export default flowCytometryPercentageTool;
