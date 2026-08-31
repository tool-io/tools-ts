import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import { validateInput, finish, locale } from "../batch-shared.js";
export type Input = Readonly<{ readonly localeTag: string }>;
export type Output = Readonly<{
  readonly observedDecimalSeparator: string;
  readonly decimalSeparatorFamily: string;
  readonly formattedFractionProbe: string;
}>;
const inputFields = [
  { id: "localeTag", label: "Locale tag", kind: "string" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  const tag = locale(input.localeTag),
    formatter = new Intl.NumberFormat(tag, {
      useGrouping: false,
      minimumFractionDigits: 1,
      maximumFractionDigits: 1,
    }),
    parts = formatter.formatToParts(1.5),
    separator = parts.find((p) => p.type === "decimal")?.value;
  if (!separator)
    return simpleError(
      "locale",
      "Host locale data must expose a decimal separator.",
    );
  return {
    observedDecimalSeparator: separator,
    decimalSeparatorFamily:
      separator === "," ? "comma" : separator === "." ? "point" : "other",
    formattedFractionProbe: parts.map((p) => p.value).join(""),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = { localeTag: "de-DE" } satisfies Input;
export const exampleOutput = {
  observedDecimalSeparator: ",",
  decimalSeparatorFamily: "comma",
  formattedFractionProbe: "1,5",
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "linguistics/decimal-comma-vs-point-region-lookup",
  title: "Decimal Comma vs Point Region Lookup",
  description:
    "Probe supported caller locale decimal separator through runtime Intl/ICU, retaining non-comma/non-point separators rather than stereotyping a region; no decimal parsing or currency-format alias.",
  inputs: inputFields,
  outputs: [
    {
      id: "observedDecimalSeparator",
      label: "Observed decimal separator",
      kind: "string",
    },
    {
      id: "decimalSeparatorFamily",
      label: "Decimal separator family",
      kind: "string",
    },
    {
      id: "formattedFractionProbe",
      label: "Formatted fraction probe",
      kind: "string",
    },
  ],
  calculate: (value) => calculate({ localeTag: value.localeTag as string }),
});
export const run = tool.execute;
export default tool;
