import type { ToolExample } from "../../core/example.js";
import type { ToolExecutionContext } from "../../core/definition.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  simpleError,
  unique,
} from "../batch51-shared.js";
export type Input = Readonly<{
  readonly actualAsciiLetters: string;
  readonly callerVerifiedCandidateWords: readonly string[];
}>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  { id: "actualAsciiLetters", label: "Actual ascii letters", kind: "string" },
  {
    id: "callerVerifiedCandidateWords",
    label: "Caller verified candidate words",
    kind: "stringList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input, context?: ToolExecutionContext) => {
  const key = (s: string) => {
      if (!/^[A-Za-z]+$/.test(s)) simpleError("word", "ASCIIletters.");
      return Array.from(s.toLowerCase()).sort().join("");
    },
    k = key(input.actualAsciiLetters);
  unique(input.callerVerifiedCandidateWords, "dictionary");
  return {
    matchedAnagrams: input.callerVerifiedCandidateWords.filter(
      (v) => key(v) === k,
    ),
  };
};
export const calculate = (input: Input, context?: ToolExecutionContext) => {
  validateInput(input, fields);
  return finish({ result: compute(input, context) });
};
export const example = {
  input: {
    actualAsciiLetters: "tea",
    callerVerifiedCandidateWords: ["tea", "eat", "ate", "too"],
  },
  output: { result: { matchedAnagrams: ["tea", "eat", "ate"] } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "fun/anagram-finder",
  title: "Anagram Finder Fun",
  description:
    "Findexactcasefoldedletter-multisetanagramsinactualcallerfinitewordlist,no externaldictionary or wildcardblanks. Boundedoffline arithmetic/sampling only;not gambling advice,fair physical randomness,secure randomness or predictive certainty.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculation or explicitly qualified result",
      kind: "object",

      schema: {
        type: "object",
        additionalProperties: false,
        properties: {
          matchedAnagrams: { type: "array", items: { type: "string" } },
        },
        required: ["matchedAnagrams"],
      },
    },
  ],
  calculate: (value, context) => calculate(value as unknown as Input, context),
});
export const run = tool.execute;
export default tool;
