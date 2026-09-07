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
import base from "../mahjong-tile/tool.js";

export type Input = Readonly<{ readonly seed: string; readonly count: number }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const inputFields = [
  { id: "seed", label: "Seed", kind: "string" },
  { id: "count", label: "Count", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input, context?: ToolExecutionContext): Output => {
  const deck: string[] = [];
  for (let i = 0; i < 34; i++) {
    const v = base.execute({}, { random: () => (i + 0.5) / 44 });
    if (!v.ok) simpleError("tiles", "Existing mahjong generator failed.");
    for (let copy = 0; copy < 4; copy++) deck.push(v.output.value);
  }
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
  id: "random/mahjong-practice-draw",
  title: "Random Mahjong Practice Draw Generator",
  description:
    "Sample physical tile indices without replacement from a136tile four-copies-per-type mahjong teaching inventory. Imports the first34existing tile symbols; excludes flowers/seasons/jokers/backs, repeated glyphs are valid physical copies. Not a wall/deal simulator or gambling odds predictor.",
  inputs: inputFields,
  outputs: [
    { id: "result", label: "Reproducible sample and evidence", kind: "object" },
  ],
  calculate: (input, context) => calculate(input as unknown as Input, context),
});
export const run = tool.execute;
export default tool;
