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
    "A 1,1",
    "B 1,2",
    "C/K 1,3",
    "D 1,4",
    "E 1,5",
    "F 2,1",
    "G 2,2",
    "H 2,3",
    "I 2,4",
    "J 2,5",
    "L 3,1",
    "M 3,2",
    "N 3,3",
    "O 3,4",
    "P 3,5",
    "Q 4,1",
    "R 4,2",
    "S 4,3",
    "T 4,4",
    "U 4,5",
    "V 5,1",
    "W 5,2",
    "X 5,3",
    "Y 5,4",
    "Z 5,5",
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
  return repertoire(source, 25, input, context);
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
  id: "random/tap-code-character",
  title: "Random Tap Code Character Generator",
  description:
    "Explicit small educational annotated notation inventory for Random Tap Code Character Generator. Sources/repertoire scope recorded in batch42 manifest. Not exhaustive; FDI codes use permanent quadrants1\u20134teeth1\u20138and primary quadrants5\u20138teeth1\u20135; no anatomical diagnosis. Prosigns continuous, not separated letters. Dental, safety, electrical, musical and diagram tokens do not establish standards conformance or safe operation. Uniform pinned repertoire-entry sampling; without replacement means distinct entry indices, not guaranteed distinct rendered glyphs. Reproducible seed or one advancing caller source; not secure randomness.",
  inputs: inputFields,
  outputs: [
    { id: "result", label: "Reproducible sample and evidence", kind: "object" },
  ],
  calculate: (input, context) => calculate(input as unknown as Input, context),
});
export const run = tool.execute;
export default tool;
