import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";

export const foreshockMainshockProbableClassifierExample = {
  input: { timeGapHours: 72, distanceKm: 12, magnitudeDifference: 2.1 },
  output: {
    probableForeshock: true,
    basis:
      "inside the classic 30-day / 50-km foreshock zone with ≥1 magnitude jump",
  },
} satisfies ToolExample<Record<string, unknown>, Record<string, unknown>>;

export const foreshockMainshockProbableClassifierTool = createSimpleTool({
  calculate: (input: Readonly<Record<string, unknown>>) =>
    (({ timeGapHours, distanceKm, magnitudeDifference }) => {
      const withinTime = timeGapHours <= 24 * 30;
      const withinSpace = distanceKm <= 50;
      const bigEnoughJump = magnitudeDifference >= 1.0;
      const probableForeshock = withinTime && withinSpace && bigEnoughJump;
      return {
        probableForeshock,
        basis: probableForeshock
          ? "inside the classic 30-day / 50-km foreshock zone with ≥1 magnitude jump"
          : "outside classic foreshock screening bounds",
      };
    })(input as never) as Record<string, unknown>,
  description:
    "Classify a smaller event as probable foreshock based on its proximity in time and distance to a larger successor.",
  id: "seismology/foreshock-mainshock-probable-classifier",
  inputs: [
    {
      minimum: 0,
      description: "Hours before the larger event.",
      id: "timeGapHours",
      kind: "number",
      label: "Δt",
      unit: "h",
    },
    {
      minimum: 0,
      description: "Distance to the larger event.",
      id: "distanceKm",
      kind: "number",
      label: "Δr",
      unit: "km",
    },
    {
      minimum: 0,
      description: "Larger minus smaller magnitude.",
      id: "magnitudeDifference",
      kind: "number",
      label: "ΔM",
    },
  ],
  outputs: [
    {
      description: "Whether the event qualifies as a probable foreshock.",
      id: "probableForeshock",
      kind: "boolean",
      label: "Foreshock?",
    },
    {
      description: "Classification basis.",
      id: "basis",
      kind: "string",
      label: "Basis",
    },
  ],
  title: "Foreshock Mainshock Probable Classifier",
});
export const runForeshockMainshockProbableClassifier =
  foreshockMainshockProbableClassifierTool.execute;
export { foreshockMainshockProbableClassifierExample as example };
export default foreshockMainshockProbableClassifierTool;
