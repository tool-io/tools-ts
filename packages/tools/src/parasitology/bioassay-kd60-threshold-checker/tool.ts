import type { ToolExecutionContext } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  fraction,
  countFraction,
} from "../batch53-shared.js";

export type Input = Readonly<{
  knockedDownAt60Minutes: number;
  exposedCount: number;
  callerMinimumFraction: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "knockedDownAt60Minutes",
    label: "Knocked down at60 minutes",
    kind: "number",
  },
  { id: "exposedCount", label: "Exposed count", kind: "number" },
  {
    id: "callerMinimumFraction",
    label: "Caller minimum fraction",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (
  i: Input,
  context?: ToolExecutionContext,
): Readonly<Record<string, unknown>> => {
  fraction(i.callerMinimumFraction, "threshold");
  const fractionAt60 = countFraction(i.knockedDownAt60Minutes, i.exposedCount);
  return {
    fractionAt60,
    atOrAboveCallerThreshold: fractionAt60 >= i.callerMinimumFraction,
    resistanceConfirmed: false,
  };
};
export const calculate = (i: Input, context?: ToolExecutionContext): Output => {
  validateInput(i, fields);
  return finish({ result: compute(i, context) });
};
export const example = {
  input: {
    knockedDownAt60Minutes: 8,
    exposedCount: 10,
    callerMinimumFraction: 0.8,
  },
  output: {
    result: {
      fractionAt60: 0.8,
      atOrAboveCallerThreshold: true,
      resistanceConfirmed: false,
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "parasitology/bioassay-kd60-threshold-checker",
  title:
    "Insecticide Resistance Bioassay Knockdown KD60 Minutes Threshold Checker",
  description:
    "Screen observed KD60 knockdown fraction, distinct from 24-hour mortality and KDT50; not a resistance diagnosis.",
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
