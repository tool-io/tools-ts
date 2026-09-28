import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly scheduledMeals: number;
  readonly attendedMeals: number;
  readonly declinedMeals: number;
  readonly unavailableMeals: number;
  readonly excludeDeclined: boolean;
};
export type Output = {
  readonly opportunities: number;
  readonly participation: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    scheduledMeals: { type: "integer", minimum: 1 },
    attendedMeals: { type: "integer", minimum: 0 },
    declinedMeals: { type: "integer", minimum: 0 },
    unavailableMeals: { type: "integer", minimum: 0 },
    excludeDeclined: { type: "boolean" },
  },
  required: [
    "scheduledMeals",
    "attendedMeals",
    "declinedMeals",
    "unavailableMeals",
    "excludeDeclined",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    opportunities: { type: "integer" },
    participation: { type: "number" },
  },
  required: ["opportunities", "participation"],
} as const;
/** Calculate eldercare meal participation denominator from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const {
    scheduledMeals,
    attendedMeals,
    declinedMeals,
    unavailableMeals,
    excludeDeclined,
  } = request;
  const compute = (): Output => {
    H.integer(scheduledMeals, 1);
    H.integer(attendedMeals, 0);
    H.integer(declinedMeals, 0);
    H.integer(unavailableMeals, 0);
    H.domain(
      attendedMeals + declinedMeals + unavailableMeals <= scheduledMeals &&
        scheduledMeals -
          unavailableMeals -
          (excludeDeclined ? declinedMeals : 0) >
          0,
    );
    return {
      opportunities:
        scheduledMeals -
        unavailableMeals -
        (excludeDeclined ? declinedMeals : 0),
      participation:
        attendedMeals /
        (scheduledMeals -
          unavailableMeals -
          (excludeDeclined ? declinedMeals : 0)),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    scheduledMeals: 21,
    attendedMeals: 14,
    declinedMeals: 3,
    unavailableMeals: 1,
    excludeDeclined: true,
  },
  output: { opportunities: 17, participation: 0.8235294117647058 },
} satisfies ToolExample<Input, Output>;
export const eldercareMealParticipationDenominatorTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "geriatrics/eldercare-meal-participation-denominator",
      title: "Eldercare Meal Participation Denominator Tool",
      description:
        "Calculate eldercare meal participation denominator from explicit caller-supplied inputs.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          scheduledMeals: { type: "integer", minimum: 1 },
          attendedMeals: { type: "integer", minimum: 0 },
          declinedMeals: { type: "integer", minimum: 0 },
          unavailableMeals: { type: "integer", minimum: 0 },
          excludeDeclined: { type: "boolean" },
        },
        required: [
          "scheduledMeals",
          "attendedMeals",
          "declinedMeals",
          "unavailableMeals",
          "excludeDeclined",
        ],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          opportunities: { type: "integer" },
          participation: { type: "number" },
        },
        required: ["opportunities", "participation"],
      },
      ports: {
        inputs: [
          {
            id: "scheduledMeals",
            label: "Scheduled Meals",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "attendedMeals",
            label: "Attended Meals",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "declinedMeals",
            label: "Declined Meals",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "unavailableMeals",
            label: "Unavailable Meals",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "excludeDeclined",
            label: "Exclude Declined",
            required: true,
            valueType: { type: "boolean" },
          },
        ],
        outputs: [
          {
            id: "opportunities",
            label: "Opportunities",
            valueType: { type: "integer" },
          },
          {
            id: "participation",
            label: "Participation",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = eldercareMealParticipationDenominatorTool.execute;
export default eldercareMealParticipationDenominatorTool;
