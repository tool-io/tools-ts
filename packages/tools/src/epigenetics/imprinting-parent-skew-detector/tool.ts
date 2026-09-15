import type { ToolExecutionContext } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  angle,
} from "../batch53-shared.js";

export type Input = Readonly<{
  maternalExpression: number;
  paternalExpression: number;
  callerSkewFraction: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "maternalExpression", label: "Maternal expression", kind: "number" },
  { id: "paternalExpression", label: "Paternal expression", kind: "number" },
  { id: "callerSkewFraction", label: "Caller skew fraction", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (
  i: Input,
  context?: ToolExecutionContext,
): Readonly<Record<string, unknown>> => {
  nonnegative(i.maternalExpression, "maternal");
  nonnegative(i.paternalExpression, "paternal");
  angle(i.callerSkewFraction, "skew", 0.5, 1);
  const total = positive(i.maternalExpression + i.paternalExpression, "total"),
    fractionMaternal = i.maternalExpression / total;
  return {
    fractionMaternal,
    dominantParent:
      i.maternalExpression > i.paternalExpression
        ? "maternal"
        : i.maternalExpression < i.paternalExpression
          ? "paternal"
          : "tie",
    skewed:
      Math.max(fractionMaternal, 1 - fractionMaternal) >= i.callerSkewFraction,
    imprintingEstablished: false,
  };
};
export const calculate = (i: Input, context?: ToolExecutionContext): Output => {
  validateInput(i, fields);
  return finish({ result: compute(i, context) });
};
export const example = {
  input: {
    maternalExpression: 9,
    paternalExpression: 1,
    callerSkewFraction: 0.8,
  },
  output: {
    result: {
      fractionMaternal: 0.9,
      dominantParent: "maternal",
      skewed: true,
      imprintingEstablished: false,
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "epigenetics/imprinting-parent-skew-detector",
  title: "Imprinting DMR Parent-of-Origin Allele Skew Detector",
  description:
    "Retain parental direction in independently phased allele expression skew; imbalance is not proof of imprinting or loss of imprinting.",
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
