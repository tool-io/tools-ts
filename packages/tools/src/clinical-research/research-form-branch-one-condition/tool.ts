import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly observedCode: string;
  readonly triggerCodes: readonly string[];
  readonly answered: boolean;
  readonly requiredWhenTriggered: boolean;
};
export type Output = {
  readonly triggered: boolean;
  readonly required: boolean;
  readonly missingRequired: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    observedCode: { type: "string", maxLength: 8192 },
    triggerCodes: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    answered: { type: "boolean" },
    requiredWhenTriggered: { type: "boolean" },
  },
  required: [
    "observedCode",
    "triggerCodes",
    "answered",
    "requiredWhenTriggered",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    triggered: { type: "boolean" },
    required: { type: "boolean" },
    missingRequired: { type: "boolean" },
  },
  required: ["triggered", "required", "missingRequired"],
} as const;
/** Evaluate one explicit questionnaire branch requirement. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { observedCode, triggerCodes, answered, requiredWhenTriggered } =
    request;
  const compute = (): Output => {
    const triggered = triggerCodes.includes(observedCode),
      required = triggered && requiredWhenTriggered;
    return { triggered, required, missingRequired: required && !answered };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    observedCode: "yes",
    triggerCodes: ["yes"],
    answered: false,
    requiredWhenTriggered: true,
  },
  output: { triggered: true, required: true, missingRequired: true },
} satisfies ToolExample<Input, Output>;
export const researchFormBranchOneConditionTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "clinical-research/research-form-branch-one-condition",
    title: "Research Form Branch One Condition Tool",
    description: "Evaluate one explicit questionnaire branch requirement.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        observedCode: { type: "string", maxLength: 8192 },
        triggerCodes: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
        answered: { type: "boolean" },
        requiredWhenTriggered: { type: "boolean" },
      },
      required: [
        "observedCode",
        "triggerCodes",
        "answered",
        "requiredWhenTriggered",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        triggered: { type: "boolean" },
        required: { type: "boolean" },
        missingRequired: { type: "boolean" },
      },
      required: ["triggered", "required", "missingRequired"],
    },
    ports: {
      inputs: [
        {
          id: "observedCode",
          label: "Observed Code",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "triggerCodes",
          label: "Trigger Codes",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
        {
          id: "answered",
          label: "Answered",
          required: true,
          valueType: { type: "boolean" },
        },
        {
          id: "requiredWhenTriggered",
          label: "Required When Triggered",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        { id: "triggered", label: "Triggered", valueType: { type: "boolean" } },
        { id: "required", label: "Required", valueType: { type: "boolean" } },
        {
          id: "missingRequired",
          label: "Missing Required",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = researchFormBranchOneConditionTool.execute;
export default researchFormBranchOneConditionTool;
