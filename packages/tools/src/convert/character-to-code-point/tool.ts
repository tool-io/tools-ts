import { createSimpleTool, simpleError } from "../../core/simple.js";
export const characterToCodePointTool = createSimpleTool({
  id: "convert/character-to-code-point",
  title: "Unicode Character to Code Point Converter",
  description: "Convert one Unicode character to its scalar code point.",
  inputs: [{ id: "character", label: "Character", kind: "string" }],
  outputs: [
    {
      id: "codePoint",
      label: "Code point",
      kind: "integer",
      format: "unicode-code-point",
    },
  ],
  calculate: (input) => {
    const characters = [...(input.character as string)];
    if (characters.length !== 1)
      simpleError("character", "Enter exactly one Unicode character.");
    return { codePoint: characters[0]!.codePointAt(0)! };
  },
});
export const runCharacterToCodePoint = characterToCodePointTool.execute;
export default characterToCodePointTool;
