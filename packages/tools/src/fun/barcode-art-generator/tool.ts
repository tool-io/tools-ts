import type { ToolExample } from "../../core/example.js";
import type { ToolExecutionContext } from "../../core/definition.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, simpleError } from "../batch51-shared.js";
export type Input = Readonly<{ readonly actualAsciiText: string }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "actualAsciiText", label: "Actual ascii text", kind: "string" },
] as const satisfies readonly SimpleField[];
const compute = (
  input: Input,
  context?: ToolExecutionContext,
): Readonly<Record<string, unknown>> => {
  if (!/^[ -~]{1,32}$/.test(input.actualAsciiText))
    simpleError("art", "1–32printableASCII.");
  return {
    decorativeBars: Array.from(input.actualAsciiText)
      .map((c) =>
        c
          .charCodeAt(0)
          .toString(2)
          .padStart(8, "0")
          .replace(/1/g, "|")
          .replace(/0/g, " "),
      )
      .join(" "),
  };
};
export const calculate = (
  input: Input,
  context?: ToolExecutionContext,
): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input, context) });
};
export const example = {
  input: { actualAsciiText: "A" },
  output: { result: { decorativeBars: " |     |" } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "fun/barcode-art-generator",
  title: "Barcode Art Generator Fun",
  description:
    "Explicit8bitASCIIbinarydecorativebars,NOTscannable EAN/UPC/Code128encoding. Offline bounded explicit text/rule convention,not natural-language validity,personaltrait inference or security.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculation or explicitly qualified result",
      kind: "object",
    },
  ],
  calculate: (value, context) => calculate(value as unknown as Input, context),
});
export const run = tool.execute;
export default tool;
