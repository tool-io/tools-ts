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
  finalVirions: number;
  initiallyInfectedCells: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "finalVirions", label: "Final virions", kind: "number" },
  {
    id: "initiallyInfectedCells",
    label: "Initially infected cells",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (
  i: Input,
  context?: ToolExecutionContext,
): Readonly<Record<string, unknown>> => {
  nonnegative(i.finalVirions, "yield");
  positive(i.initiallyInfectedCells, "cells");
  return {
    physicalVirionsPerInitiallyInfectedCell:
      i.finalVirions / i.initiallyInfectedCells,
    infectiousBurstSize: "not-established",
  };
};
export const calculate = (i: Input, context?: ToolExecutionContext): Output => {
  validateInput(i, fields);
  return finish({ result: compute(i, context) });
};
export const example = {
  input: { finalVirions: 1000, initiallyInfectedCells: 100 },
  output: {
    result: {
      physicalVirionsPerInitiallyInfectedCell: 10,
      infectiousBurstSize: "not-established",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "virology/plateau-yield-virions-per-cell-final-ratio",
  title: "Plateau Yield Virions per Cell Final Ratio Calculator",
  description:
    "Calculate final physical virion yield per initially infected cell; physical particles are not interchangeable with plaque-forming infectious units.",
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
