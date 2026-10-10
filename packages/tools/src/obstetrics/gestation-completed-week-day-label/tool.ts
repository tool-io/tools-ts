import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly recordedGestationalDays: number };
export type Output = {
  readonly completedWeeks: number;
  readonly remainingDays: number;
  readonly label: string;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { recordedGestationalDays: { type: "integer", minimum: 0 } },
  required: ["recordedGestationalDays"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    completedWeeks: { type: "integer" },
    remainingDays: { type: "integer" },
    label: { type: "string", maxLength: 8192 },
  },
  required: ["completedWeeks", "remainingDays", "label"],
} as const;
/** Format explicitly supplied gestational days as completed weeks plus days without dating a pregnancy. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { recordedGestationalDays } = request;
  const compute = (): Output => {
    (H.domain(
      Number.isSafeInteger(recordedGestationalDays) &&
        recordedGestationalDays >= 0 &&
        recordedGestationalDays <= Number.MAX_SAFE_INTEGER,
      "recordedGestationalDays",
    ),
      recordedGestationalDays);
    return (() => {
      const completedWeeks = Math.floor(recordedGestationalDays / 7),
        remainingDays = recordedGestationalDays % 7;
      return {
        completedWeeks,
        remainingDays,
        label: completedWeeks + "+" + remainingDays,
      };
    })();
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { recordedGestationalDays: 198 },
  output: { completedWeeks: 28, remainingDays: 2, label: "28+2" },
} satisfies ToolExample<Input, Output>;
export const gestationCompletedWeekDayLabelTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: ["obstetrics", "health and medicine"],
      keywords: ["obstetrics", "health and medicine"],
    },
    id: "obstetrics/gestation-completed-week-day-label",
    title: "Gestation Completed Week Day Label",
    description:
      "Format explicitly supplied gestational days as completed weeks plus days without dating a pregnancy.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { recordedGestationalDays: { type: "integer", minimum: 0 } },
      required: ["recordedGestationalDays"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        completedWeeks: { type: "integer" },
        remainingDays: { type: "integer" },
        label: { type: "string", maxLength: 8192 },
      },
      required: ["completedWeeks", "remainingDays", "label"],
    },
    ports: {
      inputs: [
        {
          id: "recordedGestationalDays",
          label: "Recorded Gestational Days",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "completedWeeks",
          label: "Completed Weeks",
          valueType: { type: "integer" },
        },
        {
          id: "remainingDays",
          label: "Remaining Days",
          valueType: { type: "integer" },
        },
        { id: "label", label: "Label", valueType: { type: "string" } },
      ],
    },
  },
  calculate,
});
export const run = gestationCompletedWeekDayLabelTool.execute;
export default gestationCompletedWeekDayLabelTool;
