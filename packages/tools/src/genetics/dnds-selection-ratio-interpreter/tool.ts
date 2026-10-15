import type { ToolExecutionContext } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
} from "../batch53-shared.js";

export type Input = Readonly<{ dn: number; ds: number }>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  { id: "dn", label: "Dn", kind: "number" },
  { id: "ds", label: "Ds", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (i: Input, context?: ToolExecutionContext) => {
  nonnegative(i.dn, "dN");
  positive(i.ds, "dS");
  const ratio = i.dn / i.ds;
  return {
    ratio,
    conditionalScreen:
      ratio > 1 ? "greater-than-one" : ratio < 1 ? "less-than-one" : "one",
    selectionEstablished: false,
  };
};
export const calculate = (i: Input, context?: ToolExecutionContext) => {
  validateInput(i, fields);
  return finish({ result: compute(i, context) });
};
export const example = {
  input: { dn: 0.2, ds: 0.1 },
  output: {
    result: {
      ratio: 2,
      conditionalScreen: "greater-than-one",
      selectionEstablished: false,
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "genetics/dnds-selection-ratio-interpreter",
  title: "Silent versus Replacement dN/dS Selection Ratio Interpreter",
  description:
    "Interpret the supplied normalized dN/dS ratio without inferring selection from raw synonymous/nonsynonymous counts.",
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
          conditionalScreen: { type: "string" },
          selectionEstablished: { type: "boolean" },
        },
        required: ["ratio", "conditionalScreen", "selectionEstablished"],
      },
    },
  ],
  calculate: (v, context) => calculate(v as unknown as Input, context),
});
export const run = tool.execute;
export default tool;
