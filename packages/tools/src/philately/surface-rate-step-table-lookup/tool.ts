import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  aligned,
  strictlyIncreasing,
  money,
} from "../batch42-shared.js";
export type Input = Readonly<{
  readonly observedWeightGrams: number;
  readonly callerInclusiveStepUpperGrams: readonly number[];
  readonly callerStepRatesMinor: readonly number[];
}>;
export type Output = Readonly<{
  readonly callerPostageMinor: number;
  readonly matchedStepIndex: number;
}>;
const inputFields = [
  { id: "observedWeightGrams", label: "Observed weight grams", kind: "number" },
  {
    id: "callerInclusiveStepUpperGrams",
    label: "Caller inclusive step upper grams",
    kind: "numberList",
  },
  {
    id: "callerStepRatesMinor",
    label: "Caller step rates minor",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  nonnegative(input.observedWeightGrams, "observedWeightGrams");
  strictlyIncreasing(input.callerInclusiveStepUpperGrams, "weightsteps", 1);
  input.callerInclusiveStepUpperGrams.forEach((v) =>
    positive(v, "upper weight"),
  );
  aligned(
    input.callerInclusiveStepUpperGrams,
    input.callerStepRatesMinor,
    "rates",
  );
  input.callerStepRatesMinor.forEach((v) => money(v, "postage"));
  const j = input.callerInclusiveStepUpperGrams.findIndex(
    (v) => input.observedWeightGrams <= v,
  );
  if (j < 0)
    simpleError(
      "weight",
      "No extrapolation past caller verified weight table.",
    );
  return {
    callerPostageMinor: input.callerStepRatesMinor[j],
    matchedStepIndex: j,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedWeightGrams: 20,
  callerInclusiveStepUpperGrams: [20, 50],
  callerStepRatesMinor: [100, 150],
} satisfies Input;
export const exampleOutput = {
  callerPostageMinor: 100,
  matchedStepIndex: 0,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "philately/surface-rate-step-table-lookup",
  title: "Surface Mail Weight Step Rate Table Lookup",
  description:
    "Look up postal surface rate at first inclusive weight-step upper bound from actual caller historical service table. Caller independently verifies observations, reference edition, units and applicability; not a grading-service certificate, authentication, conservation treatment, actual market price or legal/insurance entitlement.",
  inputs: inputFields,
  outputs: [
    { id: "callerPostageMinor", label: "Caller postage minor", kind: "number" },
    { id: "matchedStepIndex", label: "Matched step index", kind: "number" },
  ],
  calculate: (value) =>
    calculate({
      observedWeightGrams: value.observedWeightGrams as number,
      callerInclusiveStepUpperGrams:
        value.callerInclusiveStepUpperGrams as readonly number[],
      callerStepRatesMinor: value.callerStepRatesMinor as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
