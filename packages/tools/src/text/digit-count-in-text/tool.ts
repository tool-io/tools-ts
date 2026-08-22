import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";
export const digitCountInTextTool = createSimpleTool({
  id: "text/digit-count-in-text",
  title: "Digit Counter for Text",
  description: "Count the numeric digit characters in text.",
  inputs: [{ id: "text", label: "Text", kind: "string" }],
  outputs: [{ id: "digitCount", label: "Digit count", kind: "integer" }],
  calculate: (input) => {
    return {
      digitCount: ((input.text as string).match(/\d/gu) ?? []).length,
    };
  },
});
export const runDigitCountInText = digitCountInTextTool.execute;
export default digitCountInTextTool;

export type DigitCountInTextInput = {
  readonly text: string;
};

export type DigitCountInTextOutput = {
  readonly digitCount: number;
};

export const digitCountInTextExample = {
  input: {
    text: "example",
  },
  output: {
    digitCount: 0,
  },
} satisfies ToolExample<DigitCountInTextInput, DigitCountInTextOutput>;
