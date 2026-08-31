import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import { validateInput, finish, locale } from "../batch-shared.js";
export type Input = Readonly<{
  readonly decimalIntegerText: string;
  readonly localeTag: string;
}>;
export type Output = Readonly<{
  readonly localeFormattedInteger: string;
  readonly integerGroupWidthsFromRight: readonly number[];
  readonly observedGroupingSeparators: readonly string[];
}>;
const inputFields = [
  { id: "decimalIntegerText", label: "Decimal integer text", kind: "string" },
  { id: "localeTag", label: "Locale tag", kind: "string" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  if (
    input.decimalIntegerText.length > 1000 ||
    !/^[+-]?[0-9]+$(?![\s\S])/.test(input.decimalIntegerText)
  )
    simpleError(
      "integer",
      "Bounded exact signed ASCII decimal integer text required.",
    );
  const tag = locale(input.localeTag),
    formatter = new Intl.NumberFormat(tag, {
      useGrouping: true,
      maximumFractionDigits: 0,
    }),
    parts = formatter.formatToParts(BigInt(input.decimalIntegerText));
  return {
    localeFormattedInteger: parts.map((p) => p.value).join(""),
    integerGroupWidthsFromRight: parts
      .filter((p) => p.type === "integer")
      .map((p) => [...p.value].length)
      .reverse(),
    observedGroupingSeparators: [
      ...new Set(parts.filter((p) => p.type === "group").map((p) => p.value)),
    ],
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  decimalIntegerText: "123456789",
  localeTag: "hi-IN",
} satisfies Input;
export const exampleOutput = {
  localeFormattedInteger: "12,34,56,789",
  integerGroupWidthsFromRight: [3, 2, 2, 2],
  observedGroupingSeparators: [","],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "linguistics/number-grouping-locale-format-lookup",
  title: "Number Grouping Locale Format Lookup",
  description:
    "Resolve actual runtime Intl integer grouping pattern for supported caller locale using exact decimal-text BigInt, retaining non-Western group sizes/native digits; host ICU/CLDR conventions are runtime-dependent, not fixed language-wide rules.",
  inputs: inputFields,
  outputs: [
    {
      id: "localeFormattedInteger",
      label: "Locale formatted integer",
      kind: "string",
    },
    {
      id: "integerGroupWidthsFromRight",
      label: "Integer group widths from right",
      kind: "numberList",
    },
    {
      id: "observedGroupingSeparators",
      label: "Observed grouping separators",
      kind: "stringList",
    },
  ],
  calculate: (value) =>
    calculate({
      decimalIntegerText: value.decimalIntegerText as string,
      localeTag: value.localeTag as string,
    }),
});
export const run = tool.execute;
export default tool;
