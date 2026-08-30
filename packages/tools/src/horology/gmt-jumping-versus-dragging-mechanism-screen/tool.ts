import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type GmtMechanismScreenInput = {
  readonly hourHandMovesContinuously: boolean;
  readonly hourHandSteps: boolean;
  readonly independentHourSetting: boolean;
};

export type GmtMechanismScreenOutput = {
  readonly classification: "ambiguous" | "continuous" | "dragging" | "jumping";
  readonly explanation: string;
};

export const screenGmtJumpingVersusDraggingMechanism = (
  input: GmtMechanismScreenInput,
): GmtMechanismScreenOutput => {
  if (input.hourHandMovesContinuously && input.hourHandSteps)
    simpleError(
      "hourHandSteps",
      "The hour hand cannot be classified as both continuous and stepped.",
      "contradictory_hour_hand_behavior",
    );
  if (input.hourHandSteps)
    return {
      classification: "jumping",
      explanation:
        "The hour hand advances in discrete steps, which is the defining hour-indicator behavior of a jumping-hour display.",
    };
  if (input.independentHourSetting)
    return {
      classification: "dragging",
      explanation:
        "An independently set hour hand must be advanced while preserving the running minute indication, which is characteristic of a dragged or independent hour display.",
    };
  if (input.hourHandMovesContinuously)
    return {
      classification: "continuous",
      explanation:
        "The hour hand moves continuously with no discrete steps or independent-setting behavior supplied.",
    };
  return {
    classification: "ambiguous",
    explanation:
      "The supplied features do not distinguish a jumping, dragged, or conventional hour display.",
  };
};

export const gmtMechanismScreenExample = {
  input: {
    hourHandMovesContinuously: false,
    hourHandSteps: true,
    independentHourSetting: false,
  },
  output: {
    classification: "jumping",
    explanation:
      "The hour hand advances in discrete steps, which is the defining hour-indicator behavior of a jumping-hour display.",
  },
} satisfies ToolExample<GmtMechanismScreenInput, GmtMechanismScreenOutput>;

export const gmtMechanismScreenTool = createSimpleTool({
  calculate: (input) =>
    screenGmtJumpingVersusDraggingMechanism({
      hourHandMovesContinuously: input.hourHandMovesContinuously as boolean,
      hourHandSteps: input.hourHandSteps as boolean,
      independentHourSetting: input.independentHourSetting as boolean,
    }),
  description:
    "Screen a caller-described hour display as jumping, dragged, continuous, or ambiguous using observed mechanism features.",
  id: "horology/gmt-jumping-versus-dragging-mechanism-screen",
  inputs: [
    {
      id: "hourHandMovesContinuously",
      kind: "boolean",
      label: "Hour hand moves continuously",
    },
    {
      id: "hourHandSteps",
      kind: "boolean",
      label: "Hour hand advances in discrete steps",
    },
    {
      id: "independentHourSetting",
      kind: "boolean",
      label: "Hour can be set independently",
    },
  ],
  outputs: [
    {
      enum: ["continuous", "jumping", "dragging", "ambiguous"],
      id: "classification",
      kind: "string",
      label: "Mechanism screen",
    },
    { id: "explanation", kind: "string", label: "Classification explanation" },
  ],
  title: "GMT Jumping Versus Dragging Mechanism Screen",
});

export const runGmtMechanismScreen = gmtMechanismScreenTool.execute;
export default gmtMechanismScreenTool;
