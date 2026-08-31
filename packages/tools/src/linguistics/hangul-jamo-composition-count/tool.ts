import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import { validateInput, finish, sum, textBound } from "../batch-shared.js";
export type Input = Readonly<{ readonly syllableText: string }>;
export type Output = Readonly<{
  readonly normalizedHangulSyllableCount: number;
  readonly perSyllableJamoCounts: readonly number[];
  readonly decomposedJamoStrings: readonly string[];
  readonly totalComposingJamoCount: number;
}>;
const inputFields = [
  { id: "syllableText", label: "Syllable text", kind: "string" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  const text = textBound(input.syllableText).normalize("NFC"),
    chars = [...text];
  if (
    !chars.length ||
    chars.some((c) => c.codePointAt(0)! < 0xac00 || c.codePointAt(0)! > 0xd7a3)
  )
    simpleError(
      "syllables",
      "Only modern precomposed Hangul syllables after NFC composition required.",
    );
  const counts: number[] = [],
    strings: string[] = [];
  chars.forEach((c) => {
    const s = c.codePointAt(0)! - 0xac00,
      l = Math.floor(s / 588),
      v = Math.floor((s % 588) / 28),
      t = s % 28;
    counts.push(t ? 3 : 2);
    strings.push(
      String.fromCodePoint(0x1100 + l, 0x1161 + v) +
        (t ? String.fromCodePoint(0x11a7 + t) : ""),
    );
  });
  return {
    normalizedHangulSyllableCount: chars.length,
    perSyllableJamoCounts: counts,
    decomposedJamoStrings: strings,
    totalComposingJamoCount: sum(counts),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = { syllableText: "가각" } satisfies Input;
export const exampleOutput = {
  normalizedHangulSyllableCount: 2,
  perSyllableJamoCounts: [2, 3],
  decomposedJamoStrings: ["가", "각"],
  totalComposingJamoCount: 5,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "linguistics/hangul-jamo-composition-count",
  title: "Hangul Jamo Composition Count",
  description:
    "Resolve exact modern Hangul L/V/optional-T composition and per-syllable jamo counts after NFC, not random Hangul generation or archaic/conjoining-jamo inventory inference.",
  inputs: inputFields,
  outputs: [
    {
      id: "normalizedHangulSyllableCount",
      label: "Normalized hangul syllable count",
      kind: "number",
    },
    {
      id: "perSyllableJamoCounts",
      label: "Per syllable jamo counts",
      kind: "numberList",
    },
    {
      id: "decomposedJamoStrings",
      label: "Decomposed jamo strings",
      kind: "stringList",
    },
    {
      id: "totalComposingJamoCount",
      label: "Total composing jamo count",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({ syllableText: value.syllableText as string }),
});
export const run = tool.execute;
export default tool;
