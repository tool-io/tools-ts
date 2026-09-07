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
    "q | quecto10^-30",
    "r | ronto10^-27",
    "y | yocto10^-24",
    "z | zepto10^-21",
    "a | atto10^-18",
    "f | femto10^-15",
    "p | pico10^-12",
    "n | nano10^-9",
    "\u00b5 | micro10^-6",
    "m | milli10^-3",
    "c | centi10^-2",
    "d | deci10^-1",
    "da | deca10^1",
    "h | hecto10^2",
    "k | kilo10^3",
    "M | mega10^6",
    "G | giga10^9",
    "T | tera10^12",
    "P | peta10^15",
    "E | exa10^18",
    "Z | zetta10^21",
    "Y | yotta10^24",
    "R | ronna10^27",
    "Q | quetta10^30",
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
  return repertoire(source, 24, input, context);
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
  id: "random/si-prefix-symbol",
  title: "Random SI Prefix Symbol Generator",
  description:
    "Explicit small educational annotated notation inventory for Random SI Prefix Symbol Generator. Sources/repertoire scope recorded in batch42 manifest. Not exhaustive; FDI codes use permanent quadrants1\u20134teeth1\u20138and primary quadrants5\u20138teeth1\u20135; no anatomical diagnosis. Prosigns continuous, not separated letters. Dental, safety, electrical, musical and diagram tokens do not establish standards conformance or safe operation. Uniform pinned repertoire-entry sampling; without replacement means distinct entry indices, not guaranteed distinct rendered glyphs. Reproducible seed or one advancing caller source; not secure randomness.",
  inputs: inputFields,
  outputs: [
    { id: "result", label: "Reproducible sample and evidence", kind: "object" },
  ],
  calculate: (input, context) => calculate(input as unknown as Input, context),
});
export const run = tool.execute;
export default tool;
