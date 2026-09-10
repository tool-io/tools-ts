import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  aligned,
  binary,
  unique,
  sum,
} from "../batch46-shared.js";
export type Input = Readonly<{
  readonly callerCohortIds: readonly string[];
  readonly independentlyRecordedIntentFlags: readonly number[];
  readonly independentlyObservedRealizationFlags: readonly number[];
  readonly pairedKnownFlags: readonly number[];
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "callerCohortIds", label: "Caller cohort ids", kind: "stringList" },
  {
    id: "independentlyRecordedIntentFlags",
    label: "Independently recorded intent flags",
    kind: "numberList",
  },
  {
    id: "independentlyObservedRealizationFlags",
    label: "Independently observed realization flags",
    kind: "numberList",
  },
  { id: "pairedKnownFlags", label: "Paired known flags", kind: "numberList" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  unique(input.callerCohortIds, "cohort");
  for (const v of [
    input.independentlyRecordedIntentFlags,
    input.independentlyObservedRealizationFlags,
    input.pairedKnownFlags,
  ]) {
    aligned(input.callerCohortIds, v, "pairs");
    binary(v, "flags");
  }
  const n = positive(
      sum(
        input.independentlyRecordedIntentFlags.map(
          (v, i) => v * input.pairedKnownFlags[i],
        ),
      ),
      "knownintended",
    ),
    r = sum(
      input.independentlyRecordedIntentFlags.map(
        (v, i) =>
          v *
          input.independentlyObservedRealizationFlags[i] *
          input.pairedKnownFlags[i],
      ),
    );
  return {
    intendedKnownCount: n,
    realizedIntendedKnownCount: r,
    observedIntentionRealizationFraction: r / n,
    unknownCallerIds: input.callerCohortIds.filter(
      (_, i) => !input.pairedKnownFlags[i],
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    callerCohortIds: ["a", "b", "c"],
    independentlyRecordedIntentFlags: [1, 1, 0],
    independentlyObservedRealizationFlags: [1, 0, 1],
    pairedKnownFlags: [1, 1, 1],
  },
  output: {
    result: {
      intendedKnownCount: 2,
      realizedIntendedKnownCount: 1,
      observedIntentionRealizationFraction: 0.5,
      unknownCallerIds: [],
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "sociology/fertility-intention-realization-checker",
  title: "Fertility Intention Realization Checker",
  description:
    "Actual independently established paired intention/realization cohort within declared observation window; no inference of reproductive ability, choice, obligation or individual outcome.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculated observation or qualified reference",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
