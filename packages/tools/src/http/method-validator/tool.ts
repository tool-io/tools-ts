import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type MethodValidatorInput = Readonly<{
  readonly method: string;
}>;
export type MethodValidatorOutput = Readonly<{
  readonly valid: boolean;
}>;

export const calculateMethodValidator = (
  x: MethodValidatorInput,
): MethodValidatorOutput => {
  if (typeof x.method !== "string") simpleError("method", "Provide a string.");
  return { valid: /^[!#$%&'*+.^_`|~0-9A-Za-z-]+$/.test(x.method) };
};

export const example = {
  input: { method: "PATCH" },
  output: { valid: true },
} satisfies ToolExample<MethodValidatorInput, MethodValidatorOutput>;

export const tool = createSimpleTool({
  id: "http/method-validator",
  title: "HTTP Method Validator",
  description:
    "Check whether a case-sensitive HTTP request method is a nonempty RFC token; custom extension methods are allowed.",
  inputs: [{ id: "method", kind: "string", label: "Request method" }],
  outputs: [{ id: "valid", kind: "boolean", label: "Valid method token" }],
  calculate: (input) =>
    calculateMethodValidator({
      method: input.method as string,
    }),
});
export const methodValidatorTool = tool;
export const runMethodValidator = tool.execute;
export default tool;
