import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly conditionApplies: boolean;
  readonly suppliedValue: string;
};
export type Output = {
  readonly fieldRequired: boolean;
  readonly missingRequiredValue: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    conditionApplies: { type: "boolean" },
    suppliedValue: { type: "string", maxLength: 8192 },
  },
  required: ["conditionApplies", "suppliedValue"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    fieldRequired: { type: "boolean" },
    missingRequiredValue: { type: "boolean" },
  },
  required: ["fieldRequired", "missingRequiredValue"],
} as const;
/** Evaluate an explicit form-field requirement condition and whether the supplied text is empty, preserving whitespace as text. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { conditionApplies, suppliedValue } = request;
  const compute = (): Output => {
    return {
      fieldRequired: conditionApplies,
      missingRequiredValue: conditionApplies && suppliedValue.length === 0,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { conditionApplies: true, suppliedValue: "" },
  output: { fieldRequired: true, missingRequiredValue: true },
} satisfies ToolExample<Input, Output>;
export const agencyFormConditionalFieldFlagTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: [
        "administrative-science",
        "administrative science",
        "business and finance",
      ],
      keywords: ["administrative science", "business and finance"],
    },
    id: "administrative-science/agency-form-conditional-field-flag",
    title: "Agency Form Conditional Field Flag",
    description:
      "Evaluate an explicit form-field requirement condition and whether the supplied text is empty, preserving whitespace as text.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        conditionApplies: { type: "boolean" },
        suppliedValue: { type: "string", maxLength: 8192 },
      },
      required: ["conditionApplies", "suppliedValue"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        fieldRequired: { type: "boolean" },
        missingRequiredValue: { type: "boolean" },
      },
      required: ["fieldRequired", "missingRequiredValue"],
    },
    ports: {
      inputs: [
        {
          id: "conditionApplies",
          label: "Condition Applies",
          required: true,
          valueType: { type: "boolean" },
        },
        {
          id: "suppliedValue",
          label: "Supplied Value",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        {
          id: "fieldRequired",
          label: "Field Required",
          valueType: { type: "boolean" },
        },
        {
          id: "missingRequiredValue",
          label: "Missing Required Value",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = agencyFormConditionalFieldFlagTool.execute;
export default agencyFormConditionalFieldFlagTool;
