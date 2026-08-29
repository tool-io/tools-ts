import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";

export const example = {
  input: { flags: "i", pattern: "[a-z]+" },
  output: { valid: true, error: "" },
} satisfies ToolExample<
  { readonly flags: string; readonly pattern: string },
  { readonly valid: boolean; readonly error: string }
>;
export const tool = createSimpleTool({
  id: "check/regex-expression",
  title: "Regular Expression Syntax Checker",
  description:
    "Check whether a JavaScript regular expression and its flags compile. It does not run the expression against user text or claim to detect catastrophic backtracking.",
  inputs: [
    { id: "pattern", kind: "string", label: "Pattern" },
    { id: "flags", kind: "string", label: "Flags", default: "" },
  ],
  outputs: [
    { id: "valid", kind: "boolean", label: "Valid" },
    { id: "error", kind: "string", label: "Syntax error" },
  ],
  calculate: (input) => {
    try {
      new RegExp(input.pattern as string, input.flags as string);
      return { valid: true, error: "" };
    } catch (error) {
      return {
        valid: false,
        error:
          error instanceof Error ? error.message : "Invalid regular expression",
      };
    }
  },
});
export type RegexExpressionInput = Readonly<typeof example.input>;
export type RegexExpressionOutput = Readonly<typeof example.output>;
export const regexExpressionTool = tool;
export const runRegexExpression = tool.execute;
export default tool;
