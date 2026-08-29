import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const swarmVsMainshockAftershockSequenceClassifierExample = {
  input: { largestMinusSecondLargest: 0.2, durationDays: 14, eventCount: 300 },
  output: {
    sequenceType: "swarm",
    basis: "no dominant event (0.20 gap over >=5 days)",
  },
} satisfies ToolExample<Record<string, unknown>, Record<string, unknown>>;

export const swarmVsMainshockAftershockSequenceClassifierTool =
  createSimpleTool({
    calculate: (input: Readonly<Record<string, unknown>>) =>
      (({ largestMinusSecondLargest, durationDays, eventCount }) => {
        if (eventCount < 1)
          simpleError("eventCount", "Provide at least one event.");
        const isSwarm = largestMinusSecondLargest < 0.5 && durationDays >= 5;
        return {
          sequenceType: isSwarm ? "swarm" : "mainshock-aftershock",
          basis: isSwarm
            ? "no dominant event (" +
              (largestMinusSecondLargest as number).toFixed(2) +
              " gap over >=5 days)"
            : "dominant largest event or short burst (" +
              eventCount +
              " events)",
        };
      })(input as never) as Record<string, unknown>,
    description:
      "Classify a sequence as swarm or mainshock-aftershock from the largest-event dominance and duration.",
    id: "seismology/swarm-vs-mainshock-aftershock-sequence-classifier",
    inputs: [
      {
        description: "Magnitude gap between the two largest events.",
        id: "largestMinusSecondLargest",
        kind: "number",
        label: "ΔM12",
      },
      {
        minimum: 0,
        description: "Sequence duration.",
        id: "durationDays",
        kind: "number",
        label: "T",
        unit: "d",
      },
      {
        minimum: 1,
        description: "Total events.",
        id: "eventCount",
        kind: "integer",
        label: "N",
      },
    ],
    outputs: [
      {
        description: "swarm or mainshock-aftershock.",
        id: "sequenceType",
        kind: "string",
        label: "Type",
      },
      {
        description: "Decision basis.",
        id: "basis",
        kind: "string",
        label: "Basis",
      },
    ],
    title: "Swarm Vs Mainshock Aftershock Sequence Classifier",
  });
export const runSwarmVsMainshockAftershockSequenceClassifier =
  swarmVsMainshockAftershockSequenceClassifierTool.execute;
export { swarmVsMainshockAftershockSequenceClassifierExample as example };
export default swarmVsMainshockAftershockSequenceClassifierTool;
