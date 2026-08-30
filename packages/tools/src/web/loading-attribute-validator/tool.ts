import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type LoadingAttributeValidatorInput = Readonly<{
  readonly value: string;
}>;
export type LoadingAttributeValidatorOutput = Readonly<{
  readonly valid: boolean;
}>;

export const calculateLoadingAttributeValidator = (
  x: LoadingAttributeValidatorInput,
): LoadingAttributeValidatorOutput => {
  if (typeof x.value !== "string") simpleError("value", "Provide a string.");
  return { valid: ["eager", "lazy"].includes(x.value.toLowerCase()) };
};

export const example = {
  input: { value: "lazy" },
  output: { valid: true },
} satisfies ToolExample<
  LoadingAttributeValidatorInput,
  LoadingAttributeValidatorOutput
>;

export const tool = createSimpleTool({
  id: "web/loading-attribute-validator",
  title: "Loading Attribute Validator",
  description:
    "Check whether an HTML loading attribute is one of the recognized eager or lazy keywords, ASCII case-insensitively.",
  inputs: [{ id: "value", kind: "string", label: "Loading attribute" }],
  outputs: [{ id: "valid", kind: "boolean", label: "Recognized keyword" }],
  calculate: (input) =>
    calculateLoadingAttributeValidator({
      value: input.value as string,
    }),
});
export const loadingAttributeValidatorTool = tool;
export const runLoadingAttributeValidator = tool.execute;
export default tool;
