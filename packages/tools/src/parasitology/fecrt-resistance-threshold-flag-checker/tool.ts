import type { ToolExecutionContext } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, angle } from "../batch53-shared.js";

export type Input = Readonly<{
  observedReductionPercent: number;
  lowerConfidenceBoundPercent: number;
  lowerBoundKnown: boolean;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "observedReductionPercent",
    label: "Observed reduction percent",
    kind: "number",
  },
  {
    id: "lowerConfidenceBoundPercent",
    label: "Lower confidence bound percent",
    kind: "number",
  },
  { id: "lowerBoundKnown", label: "Lower bound known", kind: "boolean" },
] as const satisfies readonly SimpleField[];
const compute = (
  i: Input,
  context?: ToolExecutionContext,
): Readonly<Record<string, unknown>> => {
  angle(i.observedReductionPercent, "reduction", -1000000, 100);
  angle(
    i.lowerConfidenceBoundPercent,
    "lower-bound",
    -1000000,
    i.observedReductionPercent,
  );
  return {
    belowHistorical95: i.observedReductionPercent < 95,
    lowerBoundKnown: i.lowerBoundKnown,
    lowerBoundBelow90: i.lowerBoundKnown
      ? i.lowerConfidenceBoundPercent < 90
      : null,
    resistanceConfirmed: false,
  };
};
export const calculate = (i: Input, context?: ToolExecutionContext): Output => {
  validateInput(i, fields);
  return finish({ result: compute(i, context) });
};
export const example = {
  input: {
    observedReductionPercent: 94,
    lowerConfidenceBoundPercent: 85,
    lowerBoundKnown: true,
  },
  output: {
    result: {
      belowHistorical95: true,
      lowerBoundKnown: true,
      lowerBoundBelow90: true,
      resistanceConfirmed: false,
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "parasitology/fecrt-resistance-threshold-flag-checker",
  title: "FECRT Resistance Threshold Under 95 Percent Flag Checker",
  description:
    "Retain observed FECRT point and lower-bound evidence against historical 95/90 screens; not a current species/protocol resistance diagnosis.",
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
