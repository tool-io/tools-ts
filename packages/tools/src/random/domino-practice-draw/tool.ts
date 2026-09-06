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
import base from "../domino-tile/tool.js";

export type Input = Readonly<{ readonly seed: string; readonly count: number }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const inputFields = [
  { id: "seed", label: "Seed", kind: "string" },
  { id: "count", label: "Count", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input, context?: ToolExecutionContext): Output => {
  const deck: string[] = [];
  for (let a = 0; a <= 6; a++)
    for (let b = a; b <= 6; b++) {
      const j = 1 + 7 * a + b;
      const v = base.execute({}, { random: () => (j + 0.5) / 100 });
      if (!v.ok) simpleError("tiles", "Existing domino generator failed.");
      deck.push(v.output.value);
    }
  if (deck.length !== 28) simpleError("tiles", "Double-six inventory28pieces.");
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
  id: "random/domino-practice-draw",
  title: "Random Domino Practice Draw Generator",
  description:
    "Sample physical tiles without replacement from a28piece unordered double-six horizontal domino subset. Reuses existing single-value repertoire, excluding tile backs and duplicate orientations. Not a wall/deal simulator or gambling odds predictor.",
  inputs: inputFields,
  outputs: [
    { id: "result", label: "Reproducible sample and evidence", kind: "object" },
  ],
  calculate: (input, context) => calculate(input as unknown as Input, context),
});
export const run = tool.execute;
export default tool;
