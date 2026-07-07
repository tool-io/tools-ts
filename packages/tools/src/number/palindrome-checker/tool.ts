import { createSimpleTool } from "../../core/simple.js";
export const palindromeCheckerTool = createSimpleTool({
  id: "number/palindrome-checker",
  title: "Numeric Palindrome Checker",
  description:
    "Check whether the unsigned base-10 digits of a safe integer read the same in both directions.",
  inputs: [{ id: "value", label: "Integer", kind: "integer" }],
  outputs: [{ id: "palindrome", label: "Palindrome", kind: "boolean" }],
  calculate: (input) => {
    const text = Math.abs(input.value as number).toString();
    return { palindrome: text === [...text].reverse().join("") };
  },
});
export const runPalindromeChecker = palindromeCheckerTool.execute;
export default palindromeCheckerTool;
