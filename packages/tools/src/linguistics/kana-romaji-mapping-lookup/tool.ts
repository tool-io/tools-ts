import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import {
  validateInput,
  finish,
  aligned,
  bounded,
  textBound,
} from "../batch-shared.js";
export type Input = Readonly<{
  readonly kanaText: string;
  readonly callerKanaPatterns: readonly string[];
  readonly callerRomajiValues: readonly string[];
}>;
export type Output = Readonly<{
  readonly romanizedWithCallerMapping: string;
  readonly matchedPatternCount: number;
  readonly unmatchedCodePointIndices: readonly number[];
}>;
const inputFields = [
  { id: "kanaText", label: "Kana text", kind: "string" },
  {
    id: "callerKanaPatterns",
    label: "Caller kana patterns",
    kind: "stringList",
  },
  {
    id: "callerRomajiValues",
    label: "Caller romaji values",
    kind: "stringList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  aligned(
    input.callerKanaPatterns,
    input.callerRomajiValues,
    "callerKanaPatterns",
  );
  textBound(input.kanaText);
  if (
    new Set(input.callerKanaPatterns).size !==
      input.callerKanaPatterns.length ||
    input.callerKanaPatterns.some(
      (s) => !/^[ぁ-ゖァ-ヺー]{1,8}$(?![\s\S])/.test(s),
    ) ||
    input.callerRomajiValues.some(
      (s) => !/^[A-Za-z'-]{1,32}$(?![\s\S])/.test(s),
    )
  )
    simpleError(
      "mapping",
      "Unique bounded kana patterns with explicit romanization tokens required.",
    );
  const order = input.callerKanaPatterns
    .map((s, i) => ({ s, i }))
    .sort((a, b) => b.s.length - a.s.length);
  let out = "",
    offset = 0,
    point = 0,
    n = 0;
  const unmatched: number[] = [];
  while (offset < input.kanaText.length) {
    const match = order.find((p) => input.kanaText.startsWith(p.s, offset));
    if (match) {
      out += input.callerRomajiValues[match.i];
      offset += match.s.length;
      point += [...match.s].length;
      n++;
    } else {
      const c = String.fromCodePoint(input.kanaText.codePointAt(offset)!);
      out += c;
      unmatched.push(point++);
      offset += c.length;
    }
  }
  return {
    romanizedWithCallerMapping: out,
    matchedPatternCount: n,
    unmatchedCodePointIndices: unmatched,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  kanaText: "きゃしん",
  callerKanaPatterns: ["きゃ", "し", "ん"],
  callerRomajiValues: ["kya", "shi", "n"],
} satisfies Input;
export const exampleOutput = {
  romanizedWithCallerMapping: "kyashin",
  matchedPatternCount: 3,
  unmatchedCodePointIndices: [],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "linguistics/kana-romaji-mapping-lookup",
  title: "Kana-Rōmaji Mapping Lookup",
  description:
    "Apply longest-match caller kana-to-romaji mappings with unmatched text/indices retained, avoiding invented Hepburn/Kunrei/assimilation choices; dictionary coverage and contextual sokuon/long-vowel rules remain caller responsibility.",
  inputs: inputFields,
  outputs: [
    {
      id: "romanizedWithCallerMapping",
      label: "Romanized with caller mapping",
      kind: "string",
    },
    {
      id: "matchedPatternCount",
      label: "Matched pattern count",
      kind: "number",
    },
    {
      id: "unmatchedCodePointIndices",
      label: "Unmatched code point indices",
      kind: "numberList",
    },
  ],
  calculate: (value) =>
    calculate({
      kanaText: value.kanaText as string,
      callerKanaPatterns: value.callerKanaPatterns as readonly string[],
      callerRomajiValues: value.callerRomajiValues as readonly string[],
    }),
});
export const run = tool.execute;
export default tool;
