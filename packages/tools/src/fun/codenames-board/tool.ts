import type { ToolExample } from "../../core/example.js";
import type { ToolExecutionContext } from "../../core/definition.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  simpleError,
  unique,
  sourceFor,
  indices,
  shuffle,
} from "../batch51-shared.js";
export type Input = Readonly<{
  readonly seed: string;
  readonly callerCandidateWords: readonly string[];
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "seed", label: "Seed", kind: "string" },
  {
    id: "callerCandidateWords",
    label: "Caller candidate words",
    kind: "stringList",
  },
] as const satisfies readonly SimpleField[];
const compute = (
  input: Input,
  context?: ToolExecutionContext,
): Readonly<Record<string, unknown>> => {
  const random = sourceFor(input.seed, context);
  unique(input.callerCandidateWords, "words");
  if (input.callerCandidateWords.length < 25)
    simpleError("words", "Atleast25distinctwords.");
  return {
    boardWords: indices(
      input.callerCandidateWords.length,
      { seed: input.seed, count: 25, withoutReplacement: true },
      random,
    ).map((i) => input.callerCandidateWords[i]),
    secretRoles: shuffle(
      [
        ...Array(9).fill("red"),
        ...Array(8).fill("blue"),
        ...Array(7).fill("neutral"),
        "assassin",
      ] as string[],
      random,
    ),
  };
};
export const calculate = (
  input: Input,
  context?: ToolExecutionContext,
): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input, context) });
};
export const example = {
  input: {
    seed: "batch51",
    callerCandidateWords: [
      "a",
      "b",
      "c",
      "d",
      "e",
      "f",
      "g",
      "h",
      "i",
      "j",
      "k",
      "l",
      "m",
      "n",
      "o",
      "p",
      "q",
      "r",
      "s",
      "t",
      "u",
      "v",
      "w",
      "x",
      "y",
    ],
  },
  output: {
    result: {
      boardWords: [
        "k",
        "i",
        "o",
        "f",
        "j",
        "c",
        "l",
        "a",
        "g",
        "b",
        "w",
        "e",
        "t",
        "r",
        "v",
        "p",
        "s",
        "x",
        "m",
        "h",
        "u",
        "q",
        "y",
        "n",
        "d",
      ],
      secretRoles: [
        "red",
        "blue",
        "neutral",
        "neutral",
        "blue",
        "neutral",
        "red",
        "blue",
        "neutral",
        "neutral",
        "blue",
        "assassin",
        "red",
        "red",
        "red",
        "blue",
        "red",
        "blue",
        "neutral",
        "red",
        "red",
        "blue",
        "neutral",
        "blue",
        "red",
      ],
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "fun/codenames-board",
  title: "Codenames Board Generator",
  description:
    "Codenames-style25wordboard9red8blue7neutral1assassinsecretkey,redstarts,actualcallerwords,no cluequality or copyrightwordlist. Bounded offline explicitly declared convention;not personalidentity/traitinference,prediction,secure randomness or guaranteedgameresult.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculation or explicitly qualified result",
      kind: "object",
    },
  ],
  calculate: (value, context) => calculate(value as unknown as Input, context),
});
export const run = tool.execute;
export default tool;
