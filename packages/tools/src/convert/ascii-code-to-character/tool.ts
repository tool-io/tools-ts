import { createSimpleTool } from "../../core/simple.js";
export const asciiCodeToCharacterTool = createSimpleTool({
  id: "convert/ascii-code-to-character",
  title: "ASCII Code to Character Converter",
  description:
    "Convert an ASCII integer code from 0 through 127 to its character.",
  inputs: [
    {
      id: "code",
      label: "ASCII code",
      kind: "integer",
      minimum: 0,
      maximum: 127,
    },
  ],
  outputs: [
    {
      id: "character",
      label: "Character",
      kind: "string",
      format: "ascii-character",
    },
  ],
  calculate: (input) => {
    return { character: String.fromCodePoint(input.code as number) };
  },
});
export const runAsciiCodeToCharacter = asciiCodeToCharacterTool.execute;
export default asciiCodeToCharacterTool;
