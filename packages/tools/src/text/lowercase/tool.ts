import { createSimpleTool, simpleError } from "../../core/simple.js";
export const lowercaseTool = createSimpleTool({
  id: "text/lowercase",
  title: "Lowercase Text Converter",
  description: "Convert Unicode text to lowercase using a specified locale.",
  inputs: [
    { id: "text", label: "Text", kind: "string" },
    {
      id: "locale",
      label: "Locale",
      kind: "string",
      default: "en-US",
      required: false,
    },
  ],
  outputs: [{ id: "text", label: "Lowercase text", kind: "string" }],
  calculate: (input) => {
    try {
      return {
        text: (input.text as string).toLocaleLowerCase(input.locale as string),
      };
    } catch {
      return simpleError("locale", "Enter a supported locale.");
    }
  },
});
export const runLowercase = lowercaseTool.execute;
export default lowercaseTool;
