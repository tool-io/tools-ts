import type { ToolExample } from "../../core/example.js";
import type { ToolExecutionContext } from "../../core/definition.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  simpleError,
  bounded,
  sum,
  aligned,
} from "../batch51-shared.js";
export type Input = Readonly<{
  readonly actualAsciiWord: string;
  readonly actualBlankLetterPositions: readonly number[];
  readonly callerLetterMultipliers: readonly number[];
  readonly callerWordMultiplier: number;
}>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  { id: "actualAsciiWord", label: "Actual ascii word", kind: "string" },
  {
    id: "actualBlankLetterPositions",
    label: "Actual blank letter positions",
    kind: "numberList",
  },
  {
    id: "callerLetterMultipliers",
    label: "Caller letter multipliers",
    kind: "numberList",
  },
  {
    id: "callerWordMultiplier",
    label: "Caller word multiplier",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input, context?: ToolExecutionContext) => {
  if (!/^[A-Za-z]{1,15}$/.test(input.actualAsciiWord))
    simpleError("word", "1–15ASCIIletters.");
  const word = input.actualAsciiWord.toUpperCase(),
    table = [
      1, 3, 3, 2, 1, 4, 2, 4, 1, 8, 5, 1, 3, 1, 1, 3, 10, 1, 1, 1, 1, 4, 4, 8,
      4, 10,
    ];
  aligned(Array.from(word), input.callerLetterMultipliers, "letterbonuses");
  bounded(input.callerWordMultiplier, "wordmultiplier", 1, 81);
  input.actualBlankLetterPositions.forEach((v) =>
    bounded(v, "blankindex", 0, word.length - 1),
  );
  if (
    new Set(input.actualBlankLetterPositions).size !==
    input.actualBlankLetterPositions.length
  )
    simpleError("blanks", "Distinctblankpositions.");
  input.callerLetterMultipliers.forEach((v) => bounded(v, "multiplier", 1, 3));
  return {
    actualTileScore:
      input.callerWordMultiplier *
      sum(
        Array.from(word).map((c, i) =>
          input.actualBlankLetterPositions.includes(i)
            ? 0
            : table[c.charCodeAt(0) - 65] * input.callerLetterMultipliers[i],
        ),
      ),
  };
};
export const calculate = (input: Input, context?: ToolExecutionContext) => {
  validateInput(input, fields);
  return finish({ result: compute(input, context) });
};
export const example = {
  input: {
    actualAsciiWord: "CAT",
    actualBlankLetterPositions: [0],
    callerLetterMultipliers: [1, 1, 1],
    callerWordMultiplier: 1,
  },
  output: { result: { actualTileScore: 2 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "fun/scrabble-score",
  title: "Scrabble Score Calculator",
  description:
    "Declared English Scrabble lettervaluesactualblankpositions/bonuses,no dictionarylegality,crosswords or automaticbingo bonus. Boundedoffline arithmetic/sampling only;not gambling advice,fair physical randomness,secure randomness or predictive certainty.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculation or explicitly qualified result",
      kind: "object",

      schema: {
        type: "object",
        additionalProperties: false,
        properties: { actualTileScore: { type: "number" } },
        required: ["actualTileScore"],
      },
    },
  ],
  calculate: (value, context) => calculate(value as unknown as Input, context),
});
export const run = tool.execute;
export default tool;
