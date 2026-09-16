import type { ToolExecutionContext } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  decimalUnsigned,
  filename,
} from "../batch53-shared.js";

export type Input = Readonly<{ name: string }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "name", label: "Name", kind: "string" },
] as const satisfies readonly SimpleField[];
const compute = (
  i: Input,
  context?: ToolExecutionContext,
): Readonly<Record<string, unknown>> => {
  filename(i.name);
  const m = /^(.*)\(([0-9]+)\)([^()]*)$(?![\s\S])/.exec(i.name);
  return {
    matched: !!m,
    prefix: m ? m[1] : null,
    numberDecimal: m ? decimalUnsigned(m[2]) : null,
    digitWidth: m ? m[2].length : null,
    suffix: m ? m[3] : null,
  };
};
export const calculate = (i: Input, context?: ToolExecutionContext): Output => {
  validateInput(i, fields);
  return finish({ result: compute(i, context) });
};
export const example = {
  input: { name: "report(007).txt" },
  output: {
    result: {
      matched: true,
      prefix: "report",
      numberDecimal: "7",
      digitWidth: 3,
      suffix: ".txt",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "path/filename-numbered-suffix-parser",
  title: "Numbered Filename Suffix Parser",
  description:
    "Parse a terminal parenthesized unsigned decimal filename suffix before a parentheses-free extension tail; preserve digit width and exact decimal value.",
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
