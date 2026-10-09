import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly mealTime: number; readonly eventTime: number };
export type Output = { readonly signedGap: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { mealTime: { type: "number" }, eventTime: { type: "number" } },
  required: ["mealTime", "eventTime"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { signedGap: { type: "number" } },
  required: ["signedGap"],
} as const;
/** Calculate supplied gastrointestinal diary event-minus-meal timestamp difference in matching units without inferring causation. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { mealTime, eventTime } = request;
  const compute = (): Output => {
    return { signedGap: eventTime - mealTime };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { mealTime: 12, eventTime: 17 },
  output: { signedGap: 5 },
} satisfies ToolExample<Input, Output>;
export const gastroenterologyDiaryMealEventOffsetTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "gastroenterology/gastroenterology-diary-meal-event-offset",
      title: "Gastroenterology Diary Meal Event Offset Tool",
      description:
        "Calculate supplied gastrointestinal diary event-minus-meal timestamp difference in matching units without inferring causation.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          mealTime: { type: "number" },
          eventTime: { type: "number" },
        },
        required: ["mealTime", "eventTime"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: { signedGap: { type: "number" } },
        required: ["signedGap"],
      },
      ports: {
        inputs: [
          {
            id: "mealTime",
            label: "Meal Time",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "eventTime",
            label: "Event Time",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "signedGap",
            label: "Signed Gap",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = gastroenterologyDiaryMealEventOffsetTool.execute;
export default gastroenterologyDiaryMealEventOffsetTool;
