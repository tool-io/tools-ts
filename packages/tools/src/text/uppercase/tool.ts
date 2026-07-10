import { createSimpleTool, simpleError } from "../../core/simple.js";
export const uppercaseTool = createSimpleTool({
  id: "text/uppercase",
  title: "Uppercase Text Converter",
  description: "Convert Unicode text to uppercase using a specified locale.",
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
  outputs: [{ id: "text", label: "Uppercase text", kind: "string" }],
  calculate: (input) => {
    try {
      return {
        text: (input.text as string).toLocaleUpperCase(input.locale as string),
      };
    } catch {
      return simpleError("locale", "Enter a supported locale.");
    }
  },
});
export const runUppercase = uppercaseTool.execute;
export default uppercaseTool;
