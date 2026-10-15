import type { ToolExample } from "../../core/example.js";
import type { ToolExecutionContext } from "../../core/definition.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  simpleError,
  unique,
  sourceFor,
  shuffle,
} from "../batch51-shared.js";
export type Input = Readonly<{
  readonly seed: string;
  readonly actualEntrants: readonly string[];
}>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  { id: "seed", label: "Seed", kind: "string" },
  { id: "actualEntrants", label: "Actual entrants", kind: "stringList" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input, context?: ToolExecutionContext) => {
  const random = sourceFor(input.seed, context);
  unique(input.actualEntrants, "entrants");
  if (
    input.actualEntrants.length < 2 ||
    input.actualEntrants.length > 64 ||
    input.actualEntrants.includes("BYE")
  )
    simpleError("entrants", "2–64distinctnonreservedentrants.");
  const a = shuffle(input.actualEntrants, random);
  let size = 2;
  while (size < a.length) size *= 2;
  while (a.length < size) a.push("BYE");
  return {
    firstRoundPairs: Array.from({ length: size / 2 }, (_, i) => [
      a[2 * i],
      a[2 * i + 1],
    ]),
  };
};
export const calculate = (input: Input, context?: ToolExecutionContext) => {
  validateInput(input, fields);
  return finish({ result: compute(input, context) });
};
export const example = {
  input: { seed: "batch51", actualEntrants: ["A", "B", "C"] },
  output: {
    result: {
      firstRoundPairs: [
        ["C", "A"],
        ["B", "BYE"],
      ],
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "fun/tournament-bracket",
  title: "Tournament Bracket Generator",
  description:
    "Shuffledsingle-eliminationFIRSTroundwithpoweroftwobyes,no future winners or seeded-strengthtournamentclaim. Boundedoffline arithmetic/sampling only;not gambling advice,fair physical randomness,secure randomness or predictive certainty.",
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
          firstRoundPairs: {
            type: "array",
            items: { type: "array", items: { type: "string" } },
          },
        },
        required: ["firstRoundPairs"],
      },
    },
  ],
  calculate: (value, context) => calculate(value as unknown as Input, context),
});
export const run = tool.execute;
export default tool;
