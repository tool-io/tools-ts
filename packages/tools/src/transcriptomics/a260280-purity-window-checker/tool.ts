import type { ToolExecutionContext } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
} from "../batch53-shared.js";

export type Input = Readonly<{ a260: number; a280: number }>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  { id: "a260", label: "A260", kind: "number" },
  { id: "a280", label: "A280", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (i: Input, context?: ToolExecutionContext) => {
  nonnegative(i.a260, "a260");
  positive(i.a280, "a280");
  const ratio = i.a260 / i.a280;
  return {
    ratio,
    inEducationalWindow: ratio >= 1.8 && ratio <= 2.1,
    purityConfirmed: false,
  };
};
export const calculate = (i: Input, context?: ToolExecutionContext) => {
  validateInput(i, fields);
  return finish({ result: compute(i, context) });
};
export const example = {
  input: { a260: 2, a280: 1 },
  output: {
    result: { ratio: 2, inEducationalWindow: true, purityConfirmed: false },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "transcriptomics/a260280-purity-window-checker",
  title: "A260/280 Purity Ratio 1.8-2.1 Window Checker",
  description:
    "Screen measured A260/A280 against the educational 1.8–2.1 window; blanking, pH, matrix and assay suitability still matter.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculation or explicitly qualified evidence",
      kind: "object",

      schema: {
        type: "object",
        additionalProperties: false,
        properties: {
          ratio: { type: "number" },
          inEducationalWindow: { type: "boolean" },
          purityConfirmed: { type: "boolean" },
        },
        required: ["ratio", "inEducationalWindow", "purityConfirmed"],
      },
    },
  ],
  calculate: (v, context) => calculate(v as unknown as Input, context),
});
export const run = tool.execute;
export default tool;
