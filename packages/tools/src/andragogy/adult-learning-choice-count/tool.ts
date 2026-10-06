import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly optionCodes: readonly string[];
  readonly available: readonly boolean[];
};
export type Output = {
  readonly availableChoices: number;
  readonly availableOptions: readonly string[];
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    optionCodes: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    available: { type: "array", maxItems: 256, items: { type: "boolean" } },
  },
  required: ["optionCodes", "available"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    availableChoices: { type: "integer" },
    availableOptions: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
  },
  required: ["availableChoices", "availableOptions"],
} as const;
/** Count available unique learning options from an explicit availability mask without selecting an option for a learner. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { optionCodes, available } = request;
  const compute = (): Output => {
    H.domain(optionCodes.length === available.length, "available");
    H.domain(new Set(optionCodes).size === optionCodes.length, "optionCodes");
    const availableOptions = optionCodes.filter((_, i) => available[i]);
    return { availableChoices: availableOptions.length, availableOptions };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { optionCodes: ["A", "B", "C"], available: [true, false, true] },
  output: { availableChoices: 2, availableOptions: ["A", "C"] },
} satisfies ToolExample<Input, Output>;
export const adultLearningChoiceCountTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: ["andragogy", "education"],
      keywords: ["andragogy", "education"],
    },
    id: "andragogy/adult-learning-choice-count",
    title: "Adult Learning Choice Count",
    description:
      "Count available unique learning options from an explicit availability mask without selecting an option for a learner.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        optionCodes: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
        available: { type: "array", maxItems: 256, items: { type: "boolean" } },
      },
      required: ["optionCodes", "available"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        availableChoices: { type: "integer" },
        availableOptions: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
      },
      required: ["availableChoices", "availableOptions"],
    },
    ports: {
      inputs: [
        {
          id: "optionCodes",
          label: "Option Codes",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
        {
          id: "available",
          label: "Available",
          required: true,
          valueType: { type: "list", items: { type: "boolean" } },
        },
      ],
      outputs: [
        {
          id: "availableChoices",
          label: "Available Choices",
          valueType: { type: "integer" },
        },
        {
          id: "availableOptions",
          label: "Available Options",
          valueType: { type: "list", items: { type: "string" } },
        },
      ],
    },
  },
  calculate,
});
export const run = adultLearningChoiceCountTool.execute;
export default adultLearningChoiceCountTool;
