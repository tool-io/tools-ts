import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type DecodingAttributeValidatorInput = Readonly<{
  readonly value: string;
}>;
export type DecodingAttributeValidatorOutput = Readonly<{
  readonly valid: boolean;
}>;

export const calculateDecodingAttributeValidator = (
  x: DecodingAttributeValidatorInput,
): DecodingAttributeValidatorOutput => {
  if (typeof x.value !== "string") simpleError("value", "Provide a string.");
  return { valid: ["sync", "async", "auto"].includes(x.value.toLowerCase()) };
};

export const example = {
  input: { value: "async" },
  output: { valid: true },
} satisfies ToolExample<
  DecodingAttributeValidatorInput,
  DecodingAttributeValidatorOutput
>;

export const tool = createSimpleTool({
  id: "web/decoding-attribute-validator",
  title: "Decoding Attribute Validator",
  description:
    "Check whether an image decoding attribute uses a recognized sync, async, or auto keyword.",
  inputs: [{ id: "value", kind: "string", label: "Decoding attribute" }],
  outputs: [{ id: "valid", kind: "boolean", label: "Recognized keyword" }],
  calculate: (input) =>
    calculateDecodingAttributeValidator({
      value: input.value as string,
    }),
});
export const decodingAttributeValidatorTool = tool;
export const runDecodingAttributeValidator = tool.execute;
export default tool;
