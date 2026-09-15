import type { ToolExecutionContext } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
} from "../batch53-shared.js";

export type Input = Readonly<{
  a260: number;
  a230: number;
  callerMinimumRatio: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "a260", label: "A260", kind: "number" },
  { id: "a230", label: "A230", kind: "number" },
  { id: "callerMinimumRatio", label: "Caller minimum ratio", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (
  i: Input,
  context?: ToolExecutionContext,
): Readonly<Record<string, unknown>> => {
  nonnegative(i.a260, "a260");
  positive(i.a230, "a230");
  nonnegative(i.callerMinimumRatio, "minimum");
  const ratio = i.a260 / i.a230;
  return {
    ratio,
    belowCallerMinimum: ratio < i.callerMinimumRatio,
    contaminantIdentified: false,
  };
};
export const calculate = (i: Input, context?: ToolExecutionContext): Output => {
  validateInput(i, fields);
  return finish({ result: compute(i, context) });
};
export const example = {
  input: { a260: 1, a230: 1, callerMinimumRatio: 2 },
  output: {
    result: {
      ratio: 1,
      belowCallerMinimum: true,
      contaminantIdentified: false,
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "transcriptomics/a260230-contaminant-checker",
  title: "A260/230 Organic Contaminant Ratio Checker",
  description:
    "Screen observed A260/A230 against an explicit caller ratio boundary; low ratio does not identify a specific organic contaminant.",
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
