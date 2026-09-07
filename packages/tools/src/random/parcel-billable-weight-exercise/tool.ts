import type { ToolExecutionContext } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  simpleError,
  type SimpleField,
} from "../../core/simple.js";
import {
  validateRandomInput,
  finish,
  corpus,
  positive,
  nonnegative,
  integer,
} from "../batch42-shared.js";
import base from "../../logistics/dimensional-weight-divisor-calculator/tool.js";

export type Input = Readonly<{
  readonly seed: string;
  readonly count: number;
  readonly withoutReplacement: boolean;
  readonly candidateInputsJson: readonly string[];
  readonly actualWeightKg: number;
  readonly callerBillingStepKg: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const inputFields = [
  { id: "seed", label: "Seed", kind: "string" },
  { id: "count", label: "Count", kind: "number" },
  { id: "withoutReplacement", label: "Without replacement", kind: "boolean" },
  {
    id: "candidateInputsJson",
    label: "Candidate inputs json",
    kind: "stringList",
  },
  { id: "actualWeightKg", label: "Actual weight kg", kind: "number" },
  {
    id: "callerBillingStepKg",
    label: "Caller billing step kg",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input, context?: ToolExecutionContext): Output => {
  nonnegative(input.actualWeightKg, "actualweight");
  positive(input.callerBillingStepKg, "billingstep");
  const drawn = corpus(base, input, context);
  const exercises = drawn.result.exercises.map((e) => {
    const volumetric = (e.answer as { volumetricWeightKg: number })
        .volumetricWeightKg,
      unrounded = Math.max(input.actualWeightKg, volumetric),
      steps = integer(
        Math.ceil(unrounded / input.callerBillingStepKg),
        "billingsteps",
      );
    return {
      ...e,
      actualWeightKg: input.actualWeightKg,
      unroundedBillableWeightKg: unrounded,
      callerRoundedBillableWeightKg: steps * input.callerBillingStepKg,
    };
  });
  return { result: { ...drawn.result, exercises } };
};
export const calculate = (
  input: Input,
  context?: ToolExecutionContext,
): Output => {
  validateRandomInput(input, inputFields);
  return finish(compute(input, context));
};
export const example = {
  input: {
    seed: "tool.io/batch42",
    count: 1,
    withoutReplacement: true,
    candidateInputsJson: [
      '{"lengthCm": 60, "widthCm": 40, "heightCm": 40, "volumetricDivisorCm3PerKg": 5000}',
    ],
    actualWeightKg: 10,
    callerBillingStepKg: 0.5,
  },
} satisfies ToolExample<Input>;
export const tool = createSimpleTool({
  id: "random/parcel-billable-weight-exercise",
  title: "Random Parcel Billable Weight Exercise Generator",
  description:
    "Build a bounded reproducible parcel billable weight exercise from explicitly supplied candidate scenarios. Every candidate must satisfy imported logistics/dimensional-weight-divisor-calculator before selection; answer cards preserve its units, conventions, domain limitations and signed/unknown results. Draws are uniform over caller candidate positions; no replacement means no repeated positions, not necessarily distinct answers. No automatic pedagogical correctness, compliance or physical readiness. Billable weight is the larger of explicit scale weight and imported geometric weight, rounded upward to independently verified caller tariff step; no carrier tariff feed or dimension-rounding inference.",
  inputs: inputFields,
  outputs: [
    { id: "result", label: "Reproducible sample and evidence", kind: "object" },
  ],
  calculate: (input, context) => calculate(input as unknown as Input, context),
});
export const run = tool.execute;
export default tool;
