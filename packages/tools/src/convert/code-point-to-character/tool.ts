import { createSimpleTool, simpleError } from "../../core/simple.js";
export const codePointToCharacterTool = createSimpleTool({
  id: "convert/code-point-to-character",
  title: "Unicode Code Point to Character Converter",
  description: "Convert a Unicode scalar code point to its character.",
  inputs: [
    {
      id: "codePoint",
      label: "Code point",
      kind: "integer",
      minimum: 0,
      maximum: 1114111,
    },
  ],
  outputs: [{ id: "character", label: "Character", kind: "string" }],
  calculate: (input) => {
    const point = input.codePoint as number;
    if (point >= 0xd800 && point <= 0xdfff)
      simpleError(
        "codePoint",
        "Surrogate code points are not Unicode scalar values.",
      );
    return { character: String.fromCodePoint(point) };
  },
});
export const runCodePointToCharacter = codePointToCharacterTool.execute;
export default codePointToCharacterTool;
