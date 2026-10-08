import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly questionId: string;
  readonly oneBasedChoicePosition: number;
  readonly choiceCount: number;
};
export type Output = { readonly label: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    questionId: { type: "string", maxLength: 8192, minLength: 1 },
    oneBasedChoicePosition: { type: "integer", minimum: 1 },
    choiceCount: { type: "integer", minimum: 1 },
  },
  required: ["questionId", "oneBasedChoicePosition", "choiceCount"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { label: { type: "string", maxLength: 8192 } },
  required: ["label"],
} as const;
/** Label an explicit one-based question-choice position within supplied bounds without choosing an answer or shuffling choices. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { questionId, oneBasedChoicePosition, choiceCount } = request;
  const compute = (): Output => {
    H.domain(questionId.length > 0, "questionId");
    (H.domain(
      Number.isSafeInteger(choiceCount) &&
        choiceCount >= 1 &&
        choiceCount <= Number.MAX_SAFE_INTEGER,
      "choiceCount",
    ),
      choiceCount);
    (H.domain(
      Number.isSafeInteger(oneBasedChoicePosition) &&
        oneBasedChoicePosition >= 1 &&
        oneBasedChoicePosition <= choiceCount,
      "oneBasedChoicePosition",
    ),
      oneBasedChoicePosition);
    return {
      label:
        questionId +
        " [choice " +
        oneBasedChoicePosition +
        " of " +
        choiceCount +
        "]",
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { questionId: "Q17", oneBasedChoicePosition: 3, choiceCount: 4 },
  output: { label: "Q17 [choice 3 of 4]" },
} satisfies ToolExample<Input, Output>;
export const questionChoicePositionDisplayLabelTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: ["education"],
      keywords: ["education"],
    },
    id: "education/question-choice-position-display-label",
    title: "Question Choice Position Display Label",
    description:
      "Label an explicit one-based question-choice position within supplied bounds without choosing an answer or shuffling choices.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        questionId: { type: "string", maxLength: 8192, minLength: 1 },
        oneBasedChoicePosition: { type: "integer", minimum: 1 },
        choiceCount: { type: "integer", minimum: 1 },
      },
      required: ["questionId", "oneBasedChoicePosition", "choiceCount"],
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
          id: "questionId",
          label: "Question Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "oneBasedChoicePosition",
          label: "One Based Choice Position",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "choiceCount",
          label: "Choice Count",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [{ id: "label", label: "Label", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = questionChoicePositionDisplayLabelTool.execute;
export default questionChoicePositionDisplayLabelTool;
