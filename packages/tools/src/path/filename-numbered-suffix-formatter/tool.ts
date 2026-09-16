import type { ToolExecutionContext } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  bounded,
  decimalUnsigned,
  filename,
} from "../batch53-shared.js";

export type Input = Readonly<{
  prefix: string;
  numberDecimal: string;
  digitWidth: number;
  suffix: string;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "prefix", label: "Prefix", kind: "string" },
  { id: "numberDecimal", label: "Number decimal", kind: "string" },
  { id: "digitWidth", label: "Digit width", kind: "number" },
  { id: "suffix", label: "Suffix", kind: "string" },
] as const satisfies readonly SimpleField[];
const compute = (
  i: Input,
  context?: ToolExecutionContext,
): Readonly<Record<string, unknown>> => {
  const n = decimalUnsigned(i.numberDecimal);
  bounded(i.digitWidth, "width", 1, 1024);
  const name = i.prefix + "(" + n.padStart(i.digitWidth, "0") + ")" + i.suffix;
  filename(name);
  return { name };
};
export const calculate = (i: Input, context?: ToolExecutionContext): Output => {
  validateInput(i, fields);
  return finish({ result: compute(i, context) });
};
export const example = {
  input: {
    prefix: "report",
    numberDecimal: "7",
    digitWidth: 3,
    suffix: ".txt",
  },
  output: { result: { name: "report(007).txt" } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "path/filename-numbered-suffix-formatter",
  title: "Numbered Filename Suffix Formatter",
  description:
    "Format a parenthesized unsigned decimal filename suffix with minimum digit width; exact decimal text avoids unsafe numeric conversion.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculation or explicitly qualified evidence",
      kind: "object",
    },
  ],
  calculate: (v, context) => calculate(v as unknown as Input, context),
});
export const run = tool.execute;
export default tool;
