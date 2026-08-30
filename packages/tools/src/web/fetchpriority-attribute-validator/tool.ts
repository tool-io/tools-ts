import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type FetchpriorityAttributeValidatorInput = Readonly<{
  readonly value: string;
}>;
export type FetchpriorityAttributeValidatorOutput = Readonly<{
  readonly valid: boolean;
}>;

export const calculateFetchpriorityAttributeValidator = (
  x: FetchpriorityAttributeValidatorInput,
): FetchpriorityAttributeValidatorOutput => {
  if (typeof x.value !== "string") simpleError("value", "Provide a string.");
  return { valid: ["high", "low", "auto"].includes(x.value.toLowerCase()) };
};

export const example = {
  input: { value: "high" },
  output: { valid: true },
} satisfies ToolExample<
  FetchpriorityAttributeValidatorInput,
  FetchpriorityAttributeValidatorOutput
>;

export const tool = createSimpleTool({
  id: "web/fetchpriority-attribute-validator",
  title: "Fetch Priority Attribute Validator",
  description:
    "Check whether a fetchpriority attribute uses the recognized high, low, or auto keyword.",
  inputs: [{ id: "value", kind: "string", label: "Fetch priority attribute" }],
  outputs: [{ id: "valid", kind: "boolean", label: "Recognized keyword" }],
  calculate: (input) =>
    calculateFetchpriorityAttributeValidator({
      value: input.value as string,
    }),
});
export const fetchpriorityAttributeValidatorTool = tool;
export const runFetchpriorityAttributeValidator = tool.execute;
export default tool;
