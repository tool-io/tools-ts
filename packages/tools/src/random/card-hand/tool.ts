import type { ToolExecutionContext } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { simpleError } from "../batch42-shared.js";
import {
  validateRandomInput,
  finish,
  sourceFor,
  indices,
} from "../batch42-shared.js";
import base from "../playing-card/tool.js";

export type Input = Readonly<{ readonly seed: string; readonly count: number }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const inputFields = [
  { id: "seed", label: "Seed", kind: "string" },
  { id: "count", label: "Count", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input, context?: ToolExecutionContext): Output => {
  const deck: string[] = [];
  for (let i = 0; i < 82; i++) {
    const v = base.execute({}, { random: () => (i + 0.5) / 82 });
    if (!v.ok) simpleError("deck", "Existing card generator failed.");
    const cp = v.output.value.codePointAt(0)!;
    if (
      cp >= 0x1f0a1 &&
      cp <= 0x1f0de &&
      [0xa, 0xb, 0xc, 0xd].includes((cp >> 4) & 15) &&
      (cp & 15) >= 1 &&
      (cp & 15) <= 14 &&
      (cp & 15) !== 12
    )
      deck.push(v.output.value);
  }
  if (deck.length !== 52)
    simpleError(
      "deck",
      "Existing repertoire no longer yields the standard 52-card subset.",
    );
  const random = sourceFor(input.seed, context);
  const selected = indices(
    deck.length,
    { ...input, withoutReplacement: true },
    random,
  );
  return {
    result: {
      pieces: selected.map((i) => deck[i]),
      physicalPieceIndices: selected,
      inventorySize: deck.length,
      undrawnPieceCount: deck.length - selected.length,
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
  input: { seed: "tool.io/batch42", count: 1 },
} satisfies ToolExample<Input>;
export const tool = createSimpleTool({
  id: "random/card-hand",
  title: "Random Card Hand Generator",
  description:
    "Sample a standard 52-card hand without replacement, filtering the existing Unicode playing-card generator to ranks ace\u2013 king excluding knights/jokers/backs. Card count is the hand size. Not a wall/deal simulator or gambling odds predictor.",
  inputs: inputFields,
  outputs: [
    { id: "result", label: "Reproducible sample and evidence", kind: "object" },
  ],
  calculate: (input, context) => calculate(input as unknown as Input, context),
});
export const run = tool.execute;
export default tool;
