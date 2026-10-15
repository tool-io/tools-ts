import type { ToolExample } from "../../core/example.js";
import type { ToolExecutionContext } from "../../core/definition.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  simpleError,
  bounded,
  unique,
  sourceFor,
  draw,
} from "../batch51-shared.js";
export type Input = Readonly<{
  readonly seed: string;
  readonly actualWords: readonly string[];
  readonly columnCount: number;
}>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  { id: "seed", label: "Seed", kind: "string" },
  { id: "actualWords", label: "Actual words", kind: "stringList" },
  { id: "columnCount", label: "Column count", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input, context?: ToolExecutionContext) => {
  const random = sourceFor(input.seed, context);
  unique(input.actualWords, "words");
  bounded(input.columnCount, "columns", 1, 32);
  if (
    input.actualWords.length > 32 ||
    input.actualWords.some(
      (v) => !/^[A-Z]+$/.test(v) || v.length > input.columnCount,
    )
  )
    simpleError("words", "1–32uppercaseASCIIwordsfitcolumns.");
  return {
    letterGrid: input.actualWords.map((w) =>
      Array.from(w).concat(
        Array.from({ length: input.columnCount - w.length }, () =>
          String.fromCharCode(65 + draw(0, 25, random)),
        ),
      ),
    ),
    wordStartRows: input.actualWords.map((_, i) => i),
  };
};
export const calculate = (input: Input, context?: ToolExecutionContext) => {
  validateInput(input, fields);
  return finish({ result: compute(input, context) });
};
export const example = {
  input: { seed: "batch51", actualWords: ["CAT", "DOG"], columnCount: 4 },
  output: {
    result: {
      letterGrid: [
        ["C", "A", "T", "K"],
        ["D", "O", "G", "J"],
      ],
      wordStartRows: [0, 1],
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "fun/word-search-generator",
  title: "Word Search Puzzle Generator",
  description:
    "ExplicitsimpleLEFT-TO-RIGHTonewordperrowwordsearchwithrandomfiller,not eightdirectionhardpuzzle or unintended-occurrence/uniqueness guarantee. Bounded offline explicitly declared convention;not personalidentity/traitinference,prediction,secure randomness or guaranteedgameresult.",
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
          letterGrid: {
            type: "array",
            items: { type: "array", items: { type: "string" } },
          },
          wordStartRows: { type: "array", items: { type: "number" } },
        },
        required: ["letterGrid", "wordStartRows"],
      },
    },
  ],
  calculate: (value, context) => calculate(value as unknown as Input, context),
});
export const run = tool.execute;
export default tool;
