import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly assistedItems: number;
  readonly completedItems: number;
  readonly omittedItems: number;
  readonly includeOmitted: boolean;
};
export type Output = {
  readonly denominator: number;
  readonly assistedShare: number;
  readonly defined: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    assistedItems: { type: "integer", minimum: 0 },
    completedItems: { type: "integer", minimum: 0 },
    omittedItems: { type: "integer", minimum: 0 },
    includeOmitted: { type: "boolean" },
  },
  required: [
    "assistedItems",
    "completedItems",
    "omittedItems",
    "includeOmitted",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    denominator: { type: "integer" },
    assistedShare: { type: "number" },
    defined: { type: "boolean" },
  },
  required: ["denominator", "assistedShare", "defined"],
} as const;
/** Audit supplied questionnaire assistance metadata without ability, consent or score inference. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { assistedItems, completedItems, omittedItems, includeOmitted } =
    request;
  const compute = (): Output => {
    H.integer(completedItems, 0);
    H.integer(assistedItems, 0, completedItems);
    H.integer(omittedItems, 0);
    return {
      denominator: completedItems + (includeOmitted ? omittedItems : 0),
      assistedShare:
        completedItems + (includeOmitted ? omittedItems : 0) > 0
          ? assistedItems /
            (completedItems + (includeOmitted ? omittedItems : 0))
          : 0,
      defined: completedItems + (includeOmitted ? omittedItems : 0) > 0,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    assistedItems: 3,
    completedItems: 8,
    omittedItems: 2,
    includeOmitted: true,
  },
  output: { denominator: 10, assistedShare: 0.3, defined: true },
} satisfies ToolExample<Input, Output>;
export const questionnaireAssistanceItemShareTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "geriatrics/questionnaire-assistance-item-share",
    title: "Questionnaire Assistance Item Share Tool",
    description:
      "Audit supplied questionnaire assistance metadata without ability, consent or score inference.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        assistedItems: { type: "integer", minimum: 0 },
        completedItems: { type: "integer", minimum: 0 },
        omittedItems: { type: "integer", minimum: 0 },
        includeOmitted: { type: "boolean" },
      },
      required: [
        "assistedItems",
        "completedItems",
        "omittedItems",
        "includeOmitted",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        denominator: { type: "integer" },
        assistedShare: { type: "number" },
        defined: { type: "boolean" },
      },
      required: ["denominator", "assistedShare", "defined"],
    },
    ports: {
      inputs: [
        {
          id: "assistedItems",
          label: "Assisted Items",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "completedItems",
          label: "Completed Items",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "omittedItems",
          label: "Omitted Items",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "includeOmitted",
          label: "Include Omitted",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        {
          id: "denominator",
          label: "Denominator",
          valueType: { type: "integer" },
        },
        {
          id: "assistedShare",
          label: "Assisted Share",
          valueType: { type: "number" },
        },
        { id: "defined", label: "Defined", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = questionnaireAssistanceItemShareTool.execute;
export default questionnaireAssistanceItemShareTool;
