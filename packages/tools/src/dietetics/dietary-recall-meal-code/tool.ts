import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly recallId: string;
  readonly mealCode: string;
  readonly reportedTime: string;
};
export type Output = { readonly label: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    recallId: { type: "string", maxLength: 8192, minLength: 1 },
    mealCode: { type: "string", maxLength: 8192, minLength: 1 },
    reportedTime: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["recallId", "mealCode", "reportedTime"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { label: { type: "string", maxLength: 8192 } },
  required: ["label"],
} as const;
/** Encode explicitly reported dietary-recall meal and time wording without inferring meal composition or adequacy. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { recallId, mealCode, reportedTime } = request;
  const compute = (): Output => {
    H.domain(
      recallId.length > 0 && mealCode.length > 0 && reportedTime.length > 0,
      "recallId",
    );
    return { label: JSON.stringify([recallId, mealCode, reportedTime]) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { recallId: "R17", mealCode: "breakfast", reportedTime: "08:00" },
  output: { label: '["R17","breakfast","08:00"]' },
} satisfies ToolExample<Input, Output>;
export const dietaryRecallMealCodeTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: ["dietetics", "health and medicine"],
      keywords: ["dietetics", "health and medicine"],
    },
    id: "dietetics/dietary-recall-meal-code",
    title: "Dietary Recall Meal Code",
    description:
      "Encode explicitly reported dietary-recall meal and time wording without inferring meal composition or adequacy.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        recallId: { type: "string", maxLength: 8192, minLength: 1 },
        mealCode: { type: "string", maxLength: 8192, minLength: 1 },
        reportedTime: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["recallId", "mealCode", "reportedTime"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { label: { type: "string", maxLength: 8192 } },
      required: ["label"],
    },
    ports: {
      inputs: [
        {
          id: "recallId",
          label: "Recall Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "mealCode",
          label: "Meal Code",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "reportedTime",
          label: "Reported Time",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "label", label: "Label", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = dietaryRecallMealCodeTool.execute;
export default dietaryRecallMealCodeTool;
