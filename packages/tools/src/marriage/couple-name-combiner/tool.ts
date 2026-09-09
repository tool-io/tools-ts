import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  simpleError,
  bounded,
} from "../batch48-shared.js";
export type Input = Readonly<{
  readonly firstName: string;
  readonly secondName: string;
  readonly firstPrefixCodePointCount: number;
  readonly secondSuffixCodePointStart: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "firstName", label: "First name", kind: "string" },
  { id: "secondName", label: "Second name", kind: "string" },
  {
    id: "firstPrefixCodePointCount",
    label: "First prefix code point count",
    kind: "number",
  },
  {
    id: "secondSuffixCodePointStart",
    label: "Second suffix code point start",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  if (
    !input.firstName.trim() ||
    !input.secondName.trim() ||
    Math.max(input.firstName.length, input.secondName.length) > 64
  )
    simpleError("names", "Actual boundednonblank names.");
  const a = [...input.firstName],
    b = [...input.secondName];
  bounded(input.firstPrefixCodePointCount, "prefix", 0, a.length);
  bounded(input.secondSuffixCodePointStart, "suffix", 0, b.length);
  if (
    !input.firstPrefixCodePointCount &&
    input.secondSuffixCodePointStart === b.length
  )
    simpleError("name", "Combinedname nonempty.");
  return {
    customCombinedName:
      a.slice(0, input.firstPrefixCodePointCount).join("") +
      b.slice(input.secondSuffixCodePointStart).join(""),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    firstName: "Ada",
    secondName: "Ben",
    firstPrefixCodePointCount: 2,
    secondSuffixCodePointStart: 1,
  },
  output: { result: { customCombinedName: "Aden" } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "marriage/couple-name-combiner",
  title: "Couple Name Combiner",
  description:
    "Deterministic caller-chosen name prefix+suffix at Unicodecodepoint boundaries, not random or linguistically guaranteed pronounceable; combining graphemes may split and choice external.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Qualified observed calculation or explicit reference",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
