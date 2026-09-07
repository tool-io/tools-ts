import type { ToolExecutionContext } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  simpleError,
  type SimpleField,
} from "../../core/simple.js";
import {
  validateRandomInput,
  finish,
  sourceFor,
  indices,
  aligned,
  unique,
} from "../batch42-shared.js";

export type Input = Readonly<{
  readonly seed: string;
  readonly count: number;
  readonly withoutReplacement: boolean;
  readonly cardIds: readonly string[];
  readonly fronts: readonly string[];
  readonly backs: readonly string[];
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const inputFields = [
  { id: "seed", label: "Seed", kind: "string" },
  { id: "count", label: "Count", kind: "number" },
  { id: "withoutReplacement", label: "Without replacement", kind: "boolean" },
  { id: "cardIds", label: "Card ids", kind: "stringList" },
  { id: "fronts", label: "Fronts", kind: "stringList" },
  { id: "backs", label: "Backs", kind: "stringList" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input, context?: ToolExecutionContext): Output => {
  const random = sourceFor(input.seed, context);
  unique(input.cardIds, "cards");
  aligned(input.cardIds, input.fronts, "fronts");
  aligned(input.cardIds, input.backs, "backs");
  const selected = indices(input.cardIds.length, input, random);
  return {
    result: {
      session: selected.map((i) => ({
        cardId: input.cardIds[i],
        front: input.fronts[i],
        answer: input.backs[i],
      })),
      unselectedCardIds: input.cardIds.filter((_, i) => !selected.includes(i)),
    },
  };
};
export const calculate = (
  input: Input,
  context?: ToolExecutionContext,
): Output => {
  validateRandomInput(input, inputFields);
  return finish(compute(input, context));
};
export const example = {
  input: {
    seed: "tool.io/batch42",
    count: 1,
    withoutReplacement: true,
    cardIds: ["card-a", "card-b"],
    fronts: ["Capital of France?", "2+2?"],
    backs: ["Paris", "4"],
  },
} satisfies ToolExample<Input>;
export const tool = createSimpleTool({
  id: "random/flashcard-practice-session",
  title: "Random Flashcard Practice Session Generator",
  description:
    "Generate a reproducible practice session from caller verified front/back flashcards, explicitly choosing replacement. No spaced-repetition efficacy or answer verification is claimed.",
  inputs: inputFields,
  outputs: [
    { id: "result", label: "Reproducible sample and evidence", kind: "object" },
  ],
  calculate: (input, context) => calculate(input as unknown as Input, context),
});
export const run = tool.execute;
export default tool;
