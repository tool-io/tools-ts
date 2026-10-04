import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly lessonMinutes: number;
  readonly activityMinutes: number;
  readonly transitionMinutes: number;
};
export type Output = {
  readonly remainingMinutes: number;
  readonly overrunMinutes: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    lessonMinutes: { type: "number", minimum: 0 },
    activityMinutes: { type: "number", minimum: 0 },
    transitionMinutes: { type: "number", minimum: 0 },
  },
  required: ["lessonMinutes", "activityMinutes", "transitionMinutes"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    remainingMinutes: { type: "number" },
    overrunMinutes: { type: "number" },
  },
  required: ["remainingMinutes", "overrunMinutes"],
} as const;
/** Balance nonoverlapping activity and transition time against a fixed lesson duration. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { lessonMinutes, activityMinutes, transitionMinutes } = request;
  const compute = (): Output => {
    H.domain(
      lessonMinutes >= 0 && activityMinutes >= 0 && transitionMinutes >= 0,
      "lessonMinutes",
    );
    return {
      remainingMinutes: Math.max(
        0,
        lessonMinutes - activityMinutes - transitionMinutes,
      ),
      overrunMinutes: Math.max(
        0,
        activityMinutes + transitionMinutes - lessonMinutes,
      ),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { lessonMinutes: 60, activityMinutes: 45, transitionMinutes: 8 },
  output: { remainingMinutes: 7, overrunMinutes: 0 },
} satisfies ToolExample<Input, Output>;
export const lessonActivityTransitionMinuteBudgetTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "education/lesson-activity-transition-minute-budget",
      title: "Lesson Activity Transition Minute Budget Tool",
      description:
        "Balance nonoverlapping activity and transition time against a fixed lesson duration.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          lessonMinutes: { type: "number", minimum: 0 },
          activityMinutes: { type: "number", minimum: 0 },
          transitionMinutes: { type: "number", minimum: 0 },
        },
        required: ["lessonMinutes", "activityMinutes", "transitionMinutes"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          remainingMinutes: { type: "number" },
          overrunMinutes: { type: "number" },
        },
        required: ["remainingMinutes", "overrunMinutes"],
      },
      ports: {
        inputs: [
          {
            id: "lessonMinutes",
            label: "Lesson Minutes",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "activityMinutes",
            label: "Activity Minutes",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "transitionMinutes",
            label: "Transition Minutes",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "remainingMinutes",
            label: "Remaining Minutes",
            valueType: { type: "number" },
          },
          {
            id: "overrunMinutes",
            label: "Overrun Minutes",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = lessonActivityTransitionMinuteBudgetTool.execute;
export default lessonActivityTransitionMinuteBudgetTool;
