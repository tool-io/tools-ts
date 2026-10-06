import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly required: boolean;
  readonly suppliedText: string;
};
export type Output = { readonly missingRequiredValue: boolean };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    required: { type: "boolean" },
    suppliedText: { type: "string", maxLength: 8192 },
  },
  required: ["required", "suppliedText"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { missingRequiredValue: { type: "boolean" } },
  required: ["missingRequiredValue"],
} as const;
/** Flag an explicitly required prompt variable only when supplied text is empty; whitespace remains a value. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { required, suppliedText } = request;
  const compute = (): Output => {
    return { missingRequiredValue: required && suppliedText.length === 0 };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { required: true, suppliedText: "" },
  output: { missingRequiredValue: true },
} satisfies ToolExample<Input, Output>;
export const promptVariableRequiredValueFlagTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["ai", "data"],
      fields: [
        "artificial-intelligence",
        "artificial intelligence",
        "computer science",
      ],
      keywords: ["artificial intelligence", "computer science"],
    },
    id: "artificial-intelligence/prompt-variable-required-value-flag",
    title: "Prompt Variable Required Value Flag",
    description:
      "Flag an explicitly required prompt variable only when supplied text is empty; whitespace remains a value.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        required: { type: "boolean" },
        suppliedText: { type: "string", maxLength: 8192 },
      },
      required: ["required", "suppliedText"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { missingRequiredValue: { type: "boolean" } },
      required: ["missingRequiredValue"],
    },
    ports: {
      inputs: [
        {
          id: "required",
          label: "Required",
          required: true,
          valueType: { type: "boolean" },
        },
        {
          id: "suppliedText",
          label: "Supplied Text",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
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
export const run = promptVariableRequiredValueFlagTool.execute;
export default promptVariableRequiredValueFlagTool;
