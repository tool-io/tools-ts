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
  substitutionsPerSitePerCycle: number;
  callerBoundary: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "substitutionsPerSitePerCycle",
    label: "Substitutions per site per cycle",
    kind: "number",
  },
  { id: "callerBoundary", label: "Caller boundary", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (
  i: Input,
  context?: ToolExecutionContext,
): Readonly<Record<string, unknown>> => {
  nonnegative(i.substitutionsPerSitePerCycle, "rate");
  positive(i.callerBoundary, "boundary");
  return {
    relativeClass:
      i.substitutionsPerSitePerCycle >= i.callerBoundary
        ? "at-or-above-supplied-boundary"
        : "below-supplied-boundary",
    rateOrderOfMagnitude:
      i.substitutionsPerSitePerCycle === 0
        ? null
        : Math.floor(Math.log10(i.substitutionsPerSitePerCycle)),
  };
};
export const calculate = (i: Input, context?: ToolExecutionContext): Output => {
  validateInput(i, fields);
  return finish({ result: compute(i, context) });
};
export const example = {
  input: { substitutionsPerSitePerCycle: 0.001, callerBoundary: 0.0001 },
  output: {
    result: {
      relativeClass: "at-or-above-supplied-boundary",
      rateOrderOfMagnitude: -3,
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "virology/mutation-rate-magnitude-class-rater",
  title: "Mutation Rate substitutions/site/cycle Magnitude Class Rater",
  description:
    "Rate magnitude screen in substitutions/site/cycle against an explicit boundary; not a species-specific mutation model.",
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
