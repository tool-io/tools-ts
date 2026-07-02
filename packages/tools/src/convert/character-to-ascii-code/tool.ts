import { createSimpleTool, simpleError } from "../../core/simple.js";
export const characterToAsciiCodeTool = createSimpleTool({
  id: "convert/character-to-ascii-code",
  title: "Character to ASCII Code Converter",
  description: "Convert one ASCII character to its integer code.",
  inputs: [{ id: "character", label: "Character", kind: "string" }],
  outputs: [
    { id: "code", label: "ASCII code", kind: "integer", format: "ascii-code" },
  ],
  calculate: (input) => {
    const characters = [...(input.character as string)];
    if (characters.length !== 1 || characters[0]!.codePointAt(0)! > 127)
      simpleError("character", "Enter exactly one ASCII character.");
    return { code: characters[0]!.codePointAt(0)! };
  },
});
export const runCharacterToAsciiCode = characterToAsciiCodeTool.execute;
export default characterToAsciiCodeTool;
