import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type SoundexEncodeInput = {
  readonly text: string;
};

export type SoundexEncodeOutput = {
  readonly soundex: string;
};

export const soundexEncodeExample = {
  input: { text: "Robert" },
  output: { soundex: "R163" },
} satisfies ToolExample<SoundexEncodeInput, SoundexEncodeOutput>;

const soundexDigit = (letter: string): string | undefined => {
  if ("BFPV".includes(letter)) return "1";
  if ("CGJKQSXZ".includes(letter)) return "2";
  if ("DT".includes(letter)) return "3";
  if (letter === "L") return "4";
  if ("MN".includes(letter)) return "5";
  if (letter === "R") return "6";
  return undefined;
};

export const soundexEncodeTool = createSimpleTool({
  id: "text/soundex-encode",
  title: "Soundex Encoder",
  description:
    "Encode a name into its standard American Soundex code of one letter followed by three digits.",
  inputs: [{ id: "text", label: "Text", kind: "string" }],
  outputs: [{ id: "soundex", label: "Soundex code", kind: "string" }],
  calculate: (input) => {
    const source = (input.text as string).toUpperCase().replace(/[^A-Z]/g, "");
    if (source.length === 0)
      simpleError(
        "text",
        "Text must contain at least one letter.",
        "letters_required",
      );
    const first = source.charAt(0);
    let encoded = first;
    let previous = soundexDigit(first) ?? "";
    for (const letter of source.slice(1)) {
      const code = soundexDigit(letter);
      if (code !== undefined) {
        if (code !== previous) encoded += code;
        previous = code;
      } else if (letter !== "H" && letter !== "W") {
        previous = "";
      }
    }
    return { soundex: `${encoded}000`.slice(0, 4) };
  },
});
export const runSoundexEncode = soundexEncodeTool.execute;
export default soundexEncodeTool;
