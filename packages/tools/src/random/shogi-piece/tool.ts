import type { ToolExecutionContext } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  simpleError,
  type SimpleField,
} from "../../core/simple.js";
import { validateRandomInput, finish, repertoire } from "../batch42-shared.js";

const source = {
  values: [
    "\u738b | king",
    "\u7389 | jeweled king",
    "\u98db | rook",
    "\u89d2 | bishop",
    "\u91d1 | gold general",
    "\u9280 | silver general",
    "\u6842 | knight",
    "\u9999 | lance",
    "\u6b69 | pawn",
  ],
} as const;
export type Input = Readonly<{
  readonly seed: string;
  readonly count: number;
  readonly withoutReplacement: boolean;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const inputFields = [
  { id: "seed", label: "Seed", kind: "string" },
  { id: "count", label: "Count", kind: "number" },
  { id: "withoutReplacement", label: "Without replacement", kind: "boolean" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input, context?: ToolExecutionContext): Output => {
  return repertoire(source, 9, input, context);
};
export const calculate = (
  input: Input,
  context?: ToolExecutionContext,
): Output => {
  validateRandomInput(input, inputFields);
  return finish(compute(input, context));
};
export const example = {
  input: { seed: "tool.io/batch42", count: 1, withoutReplacement: false },
} satisfies ToolExample<Input>;
export const tool = createSimpleTool({
  id: "random/shogi-piece",
  title: "Random Shogi Piece Generator",
  description:
    "Explicit small educational annotated notation inventory for Random Shogi Piece Generator. Sources/repertoire scope recorded in batch42 manifest. Not exhaustive; FDI codes use permanent quadrants1\u20134teeth1\u20138and primary quadrants5\u20138teeth1\u20135; no anatomical diagnosis. Prosigns continuous, not separated letters. Dental, safety, electrical, musical and diagram tokens do not establish standards conformance or safe operation. Uniform pinned repertoire-entry sampling; without replacement means distinct entry indices, not guaranteed distinct rendered glyphs. Reproducible seed or one advancing caller source; not secure randomness.",
  inputs: inputFields,
  outputs: [
    { id: "result", label: "Reproducible sample and evidence", kind: "object" },
  ],
  calculate: (input, context) => calculate(input as unknown as Input, context),
});
export const run = tool.execute;
export default tool;
